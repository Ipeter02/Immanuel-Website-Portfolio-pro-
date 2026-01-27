# Deployment Guide

This portfolio supports two main deployment strategies:
1.  **Supabase** (Frontend Only, serverless database)
2.  **MERN Stack** (Frontend + Custom Node.js/MongoDB Backend)

---

## Option 1: Supabase Deployment (Recommended)

This is the easiest method. The frontend talks directly to Supabase cloud.

### Phase 1: Database Setup (Supabase)

1.  Go to [Supabase.com](https://supabase.com) and sign up/log in.
2.  Click **"New Project"**.
3.  Give it a name and password.
4.  Wait for the project to initialize.
5.  **Run the Setup Script**:
    *   In Supabase dashboard -> **SQL Editor**.
    *   Copy content from `supabase_setup.sql`.
    *   Paste and click **RUN**.
6.  **Get API Keys**:
    *   Settings -> API.
    *   Copy **Project URL** and **anon public** Key.

### Phase 2: Deploy to Vercel

1.  Go to [Vercel.com](https://vercel.com).
2.  Add New Project -> Import from GitHub.
3.  **Environment Variables**:
    *   `VITE_SUPABASE_URL`: Your Project URL.
    *   `VITE_SUPABASE_ANON_KEY`: Your anon key.
4.  Deploy.

---

## Option 2: MERN Stack Deployment (MongoDB)

Use this if you want to run the custom `server/` with MongoDB.

### Step 1: Deploy Backend (e.g., Render.com)

1.  Create a separate Git repository for the content inside the `server/` folder (or configure Root Directory in Render).
2.  Create a **Web Service** on Render.
3.  **Environment Variables** on Render:
    *   `MONGO_URI`: Your MongoDB Connection String (from MongoDB Atlas).
    *   `PORT`: `3001` (or let Render assign one).
4.  Deploy. Render will give you a URL (e.g., `https://my-portfolio-api.onrender.com`).

### Step 2: Deploy Frontend (Vercel)

1.  Deploy the frontend code to Vercel.
2.  **Environment Variables** on Vercel:
    *   `VITE_USE_CUSTOM_SERVER`: `true`
    *   `VITE_CUSTOM_API_URL`: `https://my-portfolio-api.onrender.com/api` (The URL from Step 1 + `/api`)
3.  Redeploy the frontend.

*Note: For the MERN stack, images uploaded via the admin panel are stored in the server's `uploads/` folder. On free hosting tiers (like Render Free), these files may be deleted when the server restarts. For production MERN apps, it is recommended to update the backend to upload images to Cloudinary or AWS S3.*
