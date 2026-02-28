# Database Setup Guide

This project is configured to use **Supabase** as its primary database and file storage solution.

## 1. Create a Supabase Project
1. Go to [Supabase.com](https://supabase.com) and create a new project.
2. Once created, go to **Settings > API**.
3. Copy the **Project URL** and **anon public key**.

## 2. Configure Environment Variables
1. Create a `.env` file in the root of your project (or update `.env.local`).
2. Add the following variables:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Run the Setup Script
To create the necessary tables and storage buckets:

1. Go to the **SQL Editor** in your Supabase Dashboard.
2. Click **New Query**.
3. Copy the contents of `supabase_setup.sql` (located in the root of this project).
4. Paste it into the SQL Editor and click **Run**.

## 4. Verify Connection
1. Restart your development server (`npm run dev` or `npm start`).
2. Go to the Admin Dashboard (`/admin`).
3. Look for the "Supabase" indicator in the sidebar (green dot).
4. Try uploading an image or saving changes.

## Troubleshooting
- If you see "Supabase fetch error", ensure you ran the SQL script.
- If images don't load, check if the `portfolio-assets` bucket is set to **Public** in Supabase Storage settings.
- If you cannot save changes, ensure you are logged in as an authenticated user (via Supabase Auth) or check RLS policies.
