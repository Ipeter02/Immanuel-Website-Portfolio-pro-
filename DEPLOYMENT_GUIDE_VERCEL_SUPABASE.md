# 🚀 Global Deployment Guide: Vercel + Supabase

Follow these steps to deploy your portfolio website globally for free using Vercel (Frontend + API) and Supabase (Database + Storage).

## Phase 1: Supabase Setup (Database & Storage)

1.  **Create Account:** Go to [supabase.com](https://supabase.com) and sign up.
2.  **New Project:** Click "New Project". Give it a name (e.g., `my-portfolio`) and a strong database password. Select a region close to you.
3.  **Get API Keys:**
    *   Once the project is created, go to **Project Settings** (cog icon) -> **API**.
    *   Copy the `Project URL` and `anon public` key. You will need these for Vercel.
4.  **Run Setup Script:**
    *   Go to the **SQL Editor** (terminal icon on the left).
    *   Click "New Query".
    *   Copy the entire content of the `supabase_setup.sql` file from your project code.
    *   Paste it into the SQL Editor and click **Run**.
    *   *Success:* This creates your database table and a public storage bucket for images.

## Phase 2: Vercel Deployment (Hosting)

1.  **Create Account:** Go to [vercel.com](https://vercel.com) and sign up (using GitHub is easiest).
2.  **Install Vercel CLI (Optional but recommended):**
    *   Run `npm i -g vercel` in your terminal.
    *   Run `vercel login`.
3.  **Deploy from Terminal:**
    *   In your project root folder, run:
        ```bash
        vercel
        ```
    *   Follow the prompts:
        *   Set up and deploy? **Y**
        *   Which scope? (Select your account)
        *   Link to existing project? **N**
        *   Project name? (Press Enter or type a name)
        *   In which directory is your code located? **./** (Press Enter)
        *   Want to modify these settings? **N**
    *   Wait for the deployment to complete. You will get a `Production: https://...` URL.

4.  **Configure Environment Variables (CRITICAL):**
    *   Go to your Vercel Dashboard -> Select your project -> **Settings** -> **Environment Variables**.
    *   Add the following variables (Copy values from your Supabase dashboard and Google Account):

    | Variable Name | Value Description |
    | :--- | :--- |
    | `VITE_SUPABASE_URL` | Your Supabase Project URL |
    | `VITE_SUPABASE_ANON_KEY` | Your Supabase `anon public` Key |
    | `VITE_USE_CUSTOM_SERVER` | `true` |
    | `VITE_CUSTOM_API_URL` | `/api` |
    | `SMTP_HOST` | `smtp.gmail.com` (or your provider) |
    | `SMTP_PORT` | `465` (SSL) or `587` (TLS) |
    | `SMTP_USER` | Your email address (e.g., `you@gmail.com`) |
    | `SMTP_PASS` | Your App Password (NOT your login password) |
    | `ADMIN_PASSWORD` | A strong password for the Admin Panel |
    | `JWT_SECRET` | A random long string (e.g., `my-super-secret-jwt-key-123`) |

    *   **Important:** After adding these variables, you must **Redeploy** for them to take effect.
    *   Go to **Deployments** tab -> Click the three dots on the latest deployment -> **Redeploy**.

## Phase 3: Verify & Sync

1.  **Open your Live Website:** Click the domain provided by Vercel (e.g., `https://my-portfolio.vercel.app`).
2.  **Log in to Admin:** Go to `/admin` and log in with the `ADMIN_PASSWORD` you set.
3.  **Check Connection:**
    *   Go to the **Settings** tab.
    *   Look at the **Connection Status**. It should say **SUPABASE** (Green).
    *   If it says **LOCAL** (Yellow), check your Vercel Environment Variables.
4.  **Sync Data:**
    *   If you have data locally that isn't on the live site, click the **"Force Sync"** button in Settings.
    *   This will push your local content to Supabase, making it visible globally.

## Troubleshooting

*   **Images not loading?**
    *   Ensure your Supabase Storage bucket `portfolio-assets` is set to **Public**.
    *   Go to Supabase -> Storage -> Buckets -> Click the three dots next to `portfolio-assets` -> Edit Bucket -> "Public" should be checked.
*   **Emails not sending?**
    *   Check your `SMTP_PASS`. For Gmail, you MUST use an **App Password** (Account -> Security -> 2-Step Verification -> App Passwords).
*   **"Local Mode" Warning?**
    *   This means `VITE_SUPABASE_URL` is missing or incorrect in Vercel. Double-check your environment variables.
