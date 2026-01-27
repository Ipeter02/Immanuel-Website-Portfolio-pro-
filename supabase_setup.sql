-- 1. Create the table to store all portfolio data (JSON based for flexibility)
CREATE TABLE IF NOT EXISTS portfolio_data (
  id BIGINT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (Security best practice)
ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies for the Data
-- Allow everyone (public) to READ the portfolio data
CREATE POLICY "Public Read Access" 
ON portfolio_data FOR SELECT 
USING (true);

-- Allow only authenticated users (You/Admin) to UPDATE/INSERT
CREATE POLICY "Admin Write Access" 
ON portfolio_data FOR ALL 
USING (auth.role() = 'authenticated');

-- 4. Set up Storage for Images and Resumes
-- Create a new bucket called 'portfolio-assets'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage Policies
-- Allow public to view images
CREATE POLICY "Public Access to Assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio-assets' );

-- Allow admin to upload/delete images
CREATE POLICY "Admin Asset Management"
ON storage.objects FOR ALL
USING ( bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated' );

-- 6. (Optional) Create a trigger to update the 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_modtime 
BEFORE UPDATE ON portfolio_data 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
