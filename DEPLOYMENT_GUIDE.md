# 🚀 Deployment Guide: Vercel + Supabase

Follow these steps exactly to deploy your portfolio website.

---

## **Phase 1: GitHub Setup**

1.  **Create a New Repository:**
    *   Go to [GitHub.com](https://github.com/new).
    *   Name it `portfolio-app`.
    *   Make it **Private** (recommended) or Public.
    *   Click **Create repository**.

2.  **Push Your Code:**
    *   Open your terminal (VS Code or Command Prompt) in your project folder.
    *   Run these commands one by one:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        git branch -M main
        git remote add origin https://github.com/YOUR_USERNAME/portfolio-app.git
        git push -u origin main
        ```
    *   *(Replace `YOUR_USERNAME` with your actual GitHub username)*

---

## **Phase 2: Supabase Setup (Database)**

1.  **Create Project:**
    *   Go to [Supabase.com](https://supabase.com/dashboard) and sign up/login.
    *   Click **"New Project"**.
    *   Select your Organization.
    *   **Name:** `Portfolio DB`
    *   **Database Password:** Generate a strong password and **SAVE IT** (you won't see it again).
    *   **Region:** Choose the one closest to you (e.g., London, Frankfurt).
    *   Click **"Create new project"**.

2.  **Get API Keys:**
    *   Once the project is ready (takes ~2 mins), go to **Project Settings** (gear icon) -> **API**.
    *   Copy the **Project URL** (`https://...supabase.co`).
    *   Copy the **anon public** key.
    *   **Keep these tabs open!** You will need them for Vercel.

3.  **Run Database Setup Script:**
    *   In Supabase, go to the **SQL Editor** (icon on the left sidebar).
    *   Click **"New query"**.
    *   Copy the code block below and paste it into the SQL Editor:

    ```sql
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
    ```

    *   Click **"Run"** (bottom right).
    *   *Success! Your database tables and storage buckets are now ready.*

---

## **Phase 3: Vercel Deployment (Hosting)**

1.  **Import Project:**
    *   Go to [Vercel.com](https://vercel.com/dashboard) and sign up/login.
    *   Click **"Add New..."** -> **"Project"**.
    *   Select **"Continue with GitHub"**.
    *   Find your `portfolio-app` repository and click **"Import"**.

2.  **Configure Project:**
    *   **Framework Preset:** It should auto-detect "Vite". If not, select **Vite**.
    *   **Root Directory:** Leave as `./`.

3.  **Add Environment Variables:**
    *   Expand the **"Environment Variables"** section.
    *   Add the following keys and values (copy from your `.env` file or Supabase dashboard):

    | Key | Value |
    | :--- | :--- |
    | `VITE_SUPABASE_URL` | *(Paste your Supabase Project URL)* |
    | `VITE_SUPABASE_ANON_KEY` | *(Paste your Supabase anon public key)* |
    | `VITE_USE_CUSTOM_SERVER` | `true` |
    | `VITE_CUSTOM_API_URL` | `/api` |
    | `SMTP_HOST` | `smtp.gmail.com` |
    | `SMTP_PORT` | `465` |
    | `SMTP_USER` | `immanuelgondwe52@gmail.com` |
    | `SMTP_PASS` | *(Paste your 16-character Google App Password)* |
    | `ADMIN_PASSWORD` | *(Choose a strong password for your admin panel)* |
    | `JWT_SECRET` | *(Type a random long string, e.g., `my-super-secret-key-123`)* |

4.  **Deploy:**
    *   Click **"Deploy"**.
    *   Wait ~1-2 minutes.
    *   🎉 **Success!** You will see a screenshot of your website. Click the domain link (e.g., `portfolio-app.vercel.app`) to visit it.

---

## **Phase 4: Final Verification**

1.  **Visit your new Vercel URL.**
2.  **Test Admin Login:** Go to `/admin` and log in with the password you set in Vercel.
3.  **Test Saving:** Add a test project or update your bio. Refresh the page to ensure it saved.
4.  **Test Contact Form:** Send yourself a message. Check if you receive the email.

**You are now live! 🌍**
