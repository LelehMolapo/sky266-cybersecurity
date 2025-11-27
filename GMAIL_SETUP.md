# Gmail Setup for Real Email Sending

## 1. Enable Gmail App Password
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** → **2-Step Verification** (enable if not already)
3. Click **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Name it: "Sky266 App"
6. Copy the 16-character password (like: `abcd efgh ijkl mnop`)

## 2. Add Environment Variables to Vercel
1. Go to your Vercel dashboard
2. Select your project → **Settings** → **Environment Variables**
3. Add these:
   - `GMAIL_USER` = `your-email@gmail.com`
   - `GMAIL_APP_PASSWORD` = `abcd efgh ijkl mnop` (the 16-char password)

## 3. Deploy and Test
```bash
git add .
git commit -m "Add real Gmail email sending"
git push origin main
```

## 4. How It Works
- User registers → OTP generated
- Vercel API calls Gmail SMTP
- Real email sent to user's inbox
- User enters OTP → Account created

## 5. Test It
1. Go to your live Vercel site
2. Register with your real email
3. Check your Gmail inbox for OTP
4. Enter the code to complete signup

## Troubleshooting
- Check Gmail spam folder
- Verify App Password is correct
- Ensure 2FA is enabled on Gmail
- Check Vercel function logs for errors