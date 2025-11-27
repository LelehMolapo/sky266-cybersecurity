# EmailJS Setup for Real Email Sending

## 1. Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for free account
3. Verify your email

## 2. Create Email Service
1. Go to **Email Services** → **Add New Service**
2. Choose **Gmail** (or your preferred provider)
3. Service ID: `service_sky266otp`
4. Connect your Gmail account
5. Save service

## 3. Create Email Template
1. Go to **Email Templates** → **Create New Template**
2. Template ID: `template_sky266`
3. Template content:
```
Subject: Sky266 Verification Code

Hello {{to_name}},

Your Sky266 Cybersecurity Training verification code is:

{{otp_code}}

This code expires in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
{{company_name}}
```

## 4. Get Your Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key**
3. Replace `mKqgJYJhEQJhEhJhE` in the code with your actual key

## 5. Update Environment Variables
Add to `.env.local`:
```
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=service_sky266otp
VITE_EMAILJS_TEMPLATE_ID=template_sky266
```

## 6. Test Email Sending
1. Run `npm run dev`
2. Try registering with your email
3. Check your inbox for the OTP code

## 7. Deploy to Vercel
1. Add environment variables in Vercel dashboard
2. Redeploy your app
3. Test on live site

## Troubleshooting
- Check EmailJS dashboard for send logs
- Verify Gmail allows less secure apps (if using Gmail)
- Check spam folder for emails
- Ensure template variables match code