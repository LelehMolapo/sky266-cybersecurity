# ⚡ Quick Start Guide - Sky266 Security App

Get your app running in production in **under 30 minutes**!

## 🎯 Overview

This guide will help you:
1. ✅ Set up database (10 min)
2. ✅ Deploy app (10 min)  
3. ✅ Test it live (5 min)

**Note:** The app currently runs in mock mode (no database needed for testing). This guide is for deploying to production with a real database.

---

## 🚀 Fast Track Deployment

### Step 1: Database Setup (10 minutes)

1. **Create Supabase Account**
   - Go to: https://supabase.com
   - Click "Start your project" (free)
   - Sign up with GitHub (fastest)

2. **Create New Project**
   - Name: `sky266-security`
   - Password: Create strong password (SAVE THIS!)
   - Region: Choose closest to you
   - Click "Create new project"
   - ⏰ Wait 2 minutes for setup

3. **Run Database Script**
   - In Supabase dashboard, click **"SQL Editor"**
   - Click **"New query"**
   - Copy-paste this entire SQL script:

```sql
-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'manager', 'booking-agent')),
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  videos_completed INT DEFAULT 0,
  total_videos INT DEFAULT 16,
  quizzes_passed INT DEFAULT 0,
  total_quizzes INT DEFAULT 10,
  overall_progress INT DEFAULT 0,
  certificates_earned INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date_earned TIMESTAMPTZ DEFAULT NOW(),
  score INT,
  valid_until TIMESTAMPTZ,
  category TEXT
);

CREATE TABLE security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own progress" ON training_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON training_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (user_id = auth.uid());

-- Manager access
CREATE POLICY "Managers can view all users" ON users FOR SELECT 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'manager'));
CREATE POLICY "Managers can view all progress" ON training_progress FOR SELECT 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'manager'));

-- Insert sample alerts
INSERT INTO security_alerts (type, title, description) VALUES
('critical', 'Package Fraud Alert', 'Scammers impersonating Sky266 drivers. Verify identity through official app.'),
('warning', 'Phishing Campaign Alert', 'Phishing emails targeting drivers. Report to security@sky266.com'),
('info', 'New Training Available', 'Mobile device security module now available.');
```

   - Click **"Run"** (bottom right)
   - ✅ Should say "Success. No rows returned"

4. **Get Your API Keys**
   - Click **Settings** → **API** (left sidebar)
   - Copy these TWO values:
     - ✅ Project URL (looks like: `https://xxxxx.supabase.co`)
     - ✅ `anon` `public` key (long string)
   - Save both in notepad!

5. **Enable Email Auth**
   - Click **Authentication** → **Providers**
   - Find "Email" and toggle ON
   - ✅ Disable "Confirm email" (for faster testing)
   - Click "Save"

---

### Step 2: Deploy App (5 minutes)

#### Option A: Deploy with Vercel (Recommended)

1. **Prepare the app for deployment**
   
   First, uncomment Supabase in `package.json`:
   ```json
   "dependencies": {
     "@supabase/supabase-js": "^2.39.0",  // Uncomment this line
   ```
   
   Then uncomment in `/lib/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js';  // Line 2
   // And uncomment lines 18-20
   if (supabaseUrl && supabaseAnonKey) {
     supabase = createClient(supabaseUrl, supabaseAnonKey);
   }
   ```

2. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Sky266 Security App"
   git branch -M main
   # Create repo on GitHub, then:
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to: https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Add Environment Variables:
     - Name: `VITE_SUPABASE_URL`
     - Value: (paste your Supabase URL)
     - Name: `VITE_SUPABASE_ANON_KEY`
     - Value: (paste your anon key)
   - Click "Deploy"
   - ⏰ Wait 2-3 minutes

4. **Update Supabase with Your URL**
   - Copy your Vercel URL (e.g., `https://sky266-xxxxx.vercel.app`)
   - Go back to Supabase
   - Click **Authentication** → **URL Configuration**
   - Set "Site URL" to your Vercel URL
   - Add to "Redirect URLs": `https://your-url.vercel.app/**`
   - Click "Save"

#### Option B: Deploy with Netlify

1. Go to: https://netlify.com
2. Drag and drop your `dist` folder (after running `npm run build`)
3. Add environment variables in Site Settings
4. Done!

---

### Step 3: Test Your Live App (5 minutes)

1. **Visit Your App**
   - Open your Vercel/Netlify URL
   - Should see Sky266 login page

2. **Create Test Account**
   - Click "Sign Up" tab
   - Fill in:
     - Name: John Driver
     - Email: john@test.com
     - Password: Test123456
     - Role: Driver
   - Click "Create Account"
   - ✅ Should automatically sign in!

3. **Test Features**
   - ✅ See training dashboard
   - ✅ Click on videos
   - ✅ Take a quiz
   - ✅ Check certificates

4. **Test Manager Account**
   - Sign out
   - Sign up as Manager
   - ✅ Should see manager dashboard with your first user!

5. **Check Database**
   - Go to Supabase → **Table Editor**
   - Click on `users` table
   - ✅ See your test users!

---

## 🎉 You're Live!

Your app is now running at:
**🌐 https://your-app.vercel.app**

Share this URL with your team!

---

## 📱 Share with Team

Send this to Sky266 staff:

```
🚀 New Security Training Platform Live!

Visit: https://your-app.vercel.app

1. Click "Sign Up"
2. Use your work email
3. Create password
4. Select your role
5. Start training!

Need help? Contact IT support.
```

---

## 🔧 Quick Troubleshooting

### Can't sign up?
- Check Supabase authentication is enabled
- Verify environment variables are set in Vercel

### "Invalid API key"?
- Double-check your environment variables
- Make sure no extra spaces in the keys

### Database errors?
- Verify all SQL ran successfully
- Check RLS policies are enabled

### Still stuck?
- Check Supabase logs: **Logs** → **Postgres Logs**
- Check Vercel logs: Your project → **Deployments** → Click deployment → **Function Logs**

---

## 🔄 Making Updates

After initial deployment, updates are automatic:

```bash
# Make changes to your code
git add .
git commit -m "Updated feature X"
git push
# Vercel automatically redeploys! (30 seconds)
```

---

## 🎯 Next Steps

Now that you're live:

1. ✅ Add real employee accounts
2. ✅ Customize training content
3. ✅ Set up custom domain (optional)
4. ✅ Add company branding
5. ✅ Configure email notifications

See **DEPLOYMENT_GUIDE.md** for advanced configuration.

---

## 📊 Monitor Usage

**Supabase Dashboard:**
- View active users
- Check API usage
- Monitor database size

**Vercel Dashboard:**
- Page views
- Load times
- Error rates

---

## 🆘 Need Help?

**Common Issues:**
- [Supabase Discord](https://discord.supabase.com)
- [Vercel Support](https://vercel.com/support)
- Check DEPLOYMENT_GUIDE.md troubleshooting section

**Internal Support:**
- Email: it@sky266.com
- Slack: #it-support

---

**🎊 Congratulations! Your app is live!**

Time to celebrate 🎉 - You now have a production-ready cybersecurity training platform!
