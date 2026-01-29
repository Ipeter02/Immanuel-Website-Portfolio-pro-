# 🚀 Global Deployment Guide (Free & Permanent)

This guide will help you deploy your portfolio so it is accessible worldwide, completely free, and stores your images/data permanently.

We will use **Vercel** (Hosting) + **Supabase** (Database & Storage).

---

## Step 1: Set up the Database (Supabase)

1.  Go to [Supabase.com](https://supabase.com) and click **"Start your project"**.
2.  Sign in with GitHub.
3.  Click **"New Project"**.
    *   **Name:** `my-portfolio`
    *   **Database Password:** (Create a strong password and save it)
    *   **Region:** Choose one close to you (e.g., US East, London, Singapore).
    *   Click **"Create new project"**.
4.  Wait for the project to finish "Setting up" (takes about 1-2 minutes).

### Run the Setup Script
1.  In your Supabase Dashboard, look at the left sidebar and click on **SQL Editor** (icon looks like a terminal/document).
2.  Click **"New query"**.
3.  Copy the code from the file `supabase_setup.sql` in your project folder.
4.  Paste it into the SQL Editor on the website.
5.  Click **Run** (bottom right of the editor).
    *   *Success:* You should see "Success. No rows returned."

### Get Your API Keys
1.  On the left sidebar, click the **Settings** icon (gear at the bottom).
2.  Click **API**.
3.  Copy these two values (you will need them in Step 3):
    *   **Project URL** (e.g., `https://xyz.supabase.co`)
    *   **anon / public** Key (a long string starting with `ey...`)

---

## Step 2: Push Code to GitHub

1.  Go to [GitHub.com](https://github.com) and create a new repository called `portfolio`.
2.  Open your project folder in your terminal/command prompt.
3.  Run these commands:
    ```bash
    git init
    git add .
    git commit -m "Initial portfolio commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
    git push -u origin main
    ```

---

## Step 3: Deploy to Vercel

1.  Go to [Vercel.com](https://vercel.com) and sign up with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your `portfolio` repository and click **Import**.
4.  **Configure Project:**
    *   **Framework Preset:** It should auto-detect "Vite".
    *   **Root Directory:** `./` (Leave as default).
5.  **Environment Variables (Crucial Step):**
    Click to expand "Environment Variables". Add the keys you copied from Supabase:
    
    | Name | Value |
    | :--- | :--- |
    | `VITE_SUPABASE_URL` | *(Paste your Project URL)* |
    | `VITE_SUPABASE_ANON_KEY` | *(Paste your anon public Key)* |

6.  Click **Deploy**.

---

## Step 4: Final Setup

1.  Once Vercel finishes, click the domain link (e.g., `portfolio.vercel.app`).
2.  Scroll to the bottom footer.
3.  **Click the copyright text "© 2024 Immanuel Gondwe" 5 times rapidly.**
4.  Click the **"Admin Dashboard"** button that appears.
5.  **Log In:**
    *   Since you haven't set up email auth in Supabase yet, the default won't work perfectly.
    *   **Recommended:** Go back to Supabase Dashboard -> **Authentication** -> **Users**.
    *   Click **"Add User"** and create an admin email/password.
    *   Use those credentials to log in to your Portfolio Admin.

## 🎉 Done!
Your site is now live. Any change you make in the Admin panel (text, images) will be saved to Supabase instantly and will be visible to everyone globally.
