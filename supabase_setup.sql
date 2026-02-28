-- 1. Create the main data table
create table if not exists public.portfolio_data (
  id bigint primary key,
  content jsonb not null,
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.portfolio_data enable row level security;

-- 3. Create Policies for Data Access
-- Allow everyone to read the portfolio data
create policy "Public Read Access" 
on public.portfolio_data 
for select 
using (true);

-- Allow authenticated users (admin) to insert/update data
create policy "Authenticated Insert Access" 
on public.portfolio_data 
for insert 
with check (auth.role() = 'authenticated');

create policy "Authenticated Update Access" 
on public.portfolio_data 
for update 
using (auth.role() = 'authenticated');

-- 4. Create Storage Bucket for Images/Resumes
insert into storage.buckets (id, name, public) 
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- 5. Create Policies for Storage Access
-- Allow everyone to view images/files
create policy "Public Access" 
on storage.objects 
for select 
using ( bucket_id = 'portfolio-assets' );

-- Allow authenticated users to upload/modify files
create policy "Authenticated Upload" 
on storage.objects 
for insert 
with check ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );

create policy "Authenticated Update" 
on storage.objects 
for update 
using ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );

create policy "Authenticated Delete" 
on storage.objects 
for delete 
using ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );

-- 6. Insert initial empty row if it doesn't exist (optional, app handles upsert)
insert into public.portfolio_data (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
