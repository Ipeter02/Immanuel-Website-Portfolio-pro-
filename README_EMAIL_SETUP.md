# How to Set Up Real Email (Gmail)

To make your contact form send real emails, you need to connect it to your Gmail account.

**Security Note:** You will NOT use your normal Gmail password. You will generate a special "App Password" just for this website. This is much safer.

## Step 1: Enable 2-Step Verification (If not already on)
1. Go to your [Google Account Settings](https://myaccount.google.com/).
2. Click on **Security** on the left.
3. Under "How you sign in to Google", make sure **2-Step Verification** is turned **ON**.

## Step 2: Generate an App Password
1. Go back to the **Security** page.
2. In the search bar at the top, type **"App passwords"** and click the result.
   - *Note: If you don't see this option, 2-Step Verification is not on.*
3. It might ask you to sign in again.
4. Under "Select app and device", choose:
   - **App:** "Other (Custom name)" -> Type "Portfolio Website"
   - Click **Generate**.
5. Google will show you a 16-character password in a yellow box (like `abcd efgh ijkl mnop`).
6. **Copy this password.** You won't see it again.

## Step 3: Add to Your Website

### For Local Testing (Right Now)
1. Open the file named `.env` in your project files.
2. Find the line `SMTP_USER=your-email@gmail.com` and replace it with your actual Gmail address.
3. Find the line `SMTP_PASS=your-app-password` and paste the 16-character code you just copied.
   - *Example:* `SMTP_PASS=abcdefghijklmnop` (no spaces needed)
4. Save the file.
5. **Restart the Server** for changes to take effect.

### For Deployment (When you put the site online)
When you deploy to Render, Vercel, or Heroku, look for a section called **"Environment Variables"** or **"Config Vars"** in your dashboard. Add these:

- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_USER`: `your-email@gmail.com`
- `SMTP_PASS`: `your-16-char-app-password`
