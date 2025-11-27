# 🚀 Sky266 Security App - Deployment Guide

This guide will help you deploy your Sky266 Cybersecurity Training App as a live, production-ready web application.

## 📋 Prerequisites

Before deploying, make sure you have:
- A GitHub account (for code hosting)
- A Supabase account (for database) - [Sign up free](https://supabase.com)
- A Vercel/Netlify account (for hosting) - [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

---

## 🗄️ Step 1: Set Up Database (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `sky266-security`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect to start
4. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'manager', 'booking-agent')),
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT
);

-- Training progress table
CREATE TABLE training_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  videos_completed INTEGER DEFAULT 0,
  total_videos INTEGER DEFAULT 16,
  quizzes_passed INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 10,
  overall_progress INTEGER DEFAULT 0,
  certificates_earned INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date_earned TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER,
  valid_until TIMESTAMP WITH TIME ZONE,
  category TEXT,
  certificate_url TEXT
);

-- Video completions table
CREATE TABLE video_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Quiz results table
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security alerts table
CREATE TABLE security_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'info', 'success')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_training_progress_user ON training_progress(user_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_video_completions_user ON video_completions(user_id);
CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);
```

4. Click **"Run"** to execute the SQL

### 1.3 Set Up Row Level Security (RLS)

Run this SQL to secure your data:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Managers can view all users
CREATE POLICY "Managers can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Training progress policies
CREATE POLICY "Users can view own progress" ON training_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress" ON training_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON training_progress
  FOR UPDATE USING (user_id = auth.uid());

-- Managers can view all progress
CREATE POLICY "Managers can view all progress" ON training_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Certificates policies
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create certificates" ON certificates
  FOR INSERT WITH CHECK (true);

-- Video completions policies
CREATE POLICY "Users can view own completions" ON video_completions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can mark videos complete" ON video_completions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Quiz results policies
CREATE POLICY "Users can view own results" ON quiz_results
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can submit quiz results" ON quiz_results
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Security alerts are public (read-only)
CREATE POLICY "Everyone can view active alerts" ON security_alerts
  FOR SELECT USING (active = true);
```

### 1.4 Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - ✅ Enable email confirmations (optional)
   - ✅ Disable email confirmations for faster testing
   - Set **Site URL**: You'll update this after deployment

### 1.5 Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string)
3. Save these for the next step

---

## 🔧 Step 2: Configure Your App

### 2.1 Create Environment File

Create a file named `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual Supabase credentials from Step 1.5.

### 2.2 Install Supabase Client

Run this command in your terminal:

```bash
npm install @supabase/supabase-js
```

### 2.3 Update Supabase Connection

Your `/lib/supabase.ts` file is ready! Just uncomment the real implementation sections after setting up your `.env.local` file.

---

## 🌐 Step 3: Deploy to Vercel (Recommended)

### 3.1 Push Code to GitHub

1. Initialize Git (if not already):
```bash
git init
git add .
git commit -m "Initial commit - Sky266 Security App"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/yourusername/sky266-security.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your `sky266-security` repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click **"Deploy"**
7. Wait 2-3 minutes for deployment

### 3.3 Update Supabase Settings

1. After deployment, copy your Vercel URL (e.g., `https://sky266-security.vercel.app`)
2. Go back to Supabase Dashboard
3. Navigate to **Authentication** → **URL Configuration**
4. Update **Site URL** to your Vercel URL
5. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

---

## 🌍 Alternative: Deploy to Netlify

### 3.1 Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **"Deploy site"**

---

## 🧪 Step 4: Test Your Deployed App

### 4.1 Test Sign Up Flow

1. Visit your deployed URL
2. Click **"Sign Up"** tab
3. Fill in:
   - Name: Test Driver
   - Email: driver@test.com
   - Password: TestPass123
   - Role: Driver
4. Click "Create Account"
5. You should be signed in automatically

### 4.2 Test Sign In Flow

1. Sign out
2. Sign in with the credentials you just created
3. Verify you can access the dashboard

### 4.3 Test Manager Access

1. Create another account with role: Manager
2. Sign in and verify you can see the manager dashboard

### 4.4 Check Database

1. Go to Supabase Dashboard → **Table Editor**
2. Check the `users` table - you should see your test users
3. Check `training_progress` - should have entries for your users

---

## 📱 Step 5: Add Sample Data (Optional)

To make the app look more complete with sample data:

```sql
-- Insert sample security alerts
INSERT INTO security_alerts (type, title, description) VALUES
('critical', 'Package Fraud Alert', 'Scammers are impersonating Sky266 drivers to gain access to buildings. Always verify driver identity through the official app.'),
('warning', 'Phishing Campaign Targeting Drivers', 'Multiple drivers reported phishing emails claiming to be delivery route updates. Delete these emails and report to security@sky266.com'),
('info', 'Security Training Update', 'New mobile device security module now available. Complete by end of month.'),
('warning', 'Mobile Device Security Update Required', 'All driver and booking agent devices must install the latest security update by November 15th.');

-- Add sample certificates for a user (replace user_id)
INSERT INTO certificates (user_id, title, description, score, category, valid_until) VALUES
('your-user-uuid-here', 'Phishing Prevention Certified', 'Successfully completed advanced phishing detection training', 95, 'Email Security', NOW() + INTERVAL '1 year'),
('your-user-uuid-here', 'Data Protection Specialist', 'Mastered customer data protection protocols', 88, 'Data Security', NOW() + INTERVAL '1 year');
```

---

## 🔒 Step 6: Security Best Practices

### 6.1 Enable Additional Security Features

1. In Supabase, go to **Authentication** → **Policies**
2. Enable **Email confirmations** for production
3. Set up **Password requirements** (minimum 8 characters)
4. Enable **Multi-factor authentication** (optional)

### 6.2 Monitor Usage

1. Supabase Dashboard → **Database** → **Usage**
2. Monitor API calls and storage
3. Set up alerts for unusual activity

### 6.3 Backup Strategy

1. Supabase automatically backs up your database
2. For additional safety, schedule manual backups:
   - **Database** → **Backups** → **Schedule backup**

---

## 📊 Step 7: Custom Domain (Optional)

### 7.1 On Vercel

1. Go to your project → **Settings** → **Domains**
2. Add your custom domain (e.g., `security.sky266.com`)
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificate

### 7.2 Update Supabase

1. Update **Site URL** in Supabase to your custom domain
2. Update **Redirect URLs** accordingly

---

## 🎉 You're Live!

Your app is now deployed and accessible at:
- **Vercel**: `https://your-app.vercel.app`
- **Netlify**: `https://your-app.netlify.app`
- **Custom Domain**: `https://security.sky266.com` (if configured)

### Share with Your Team

Users can now:
1. Visit the app URL
2. Sign up with their work email
3. Start security training immediately

---

## 🛠️ Ongoing Maintenance

### Updating the App

1. Make changes to your code locally
2. Test locally with `npm run dev`
3. Commit and push to GitHub:
```bash
git add .
git commit -m "Description of changes"
git push
```
4. Vercel/Netlify automatically redeploys!

### Monitoring

- **Supabase Dashboard**: Monitor database usage and API calls
- **Vercel Analytics**: Track page views and performance
- **Error Tracking**: Set up Sentry for error monitoring (optional)

---

## 🆘 Troubleshooting

### Issue: "Invalid API key"
- **Solution**: Check that environment variables are set correctly in Vercel/Netlify

### Issue: "User not found" after sign up
- **Solution**: Verify RLS policies are enabled and correct

### Issue: "CORS error"
- **Solution**: Add your domain to Supabase allowed origins

### Issue: Build fails on Vercel
- **Solution**: Check that all dependencies are in `package.json`

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

---

## 💡 Next Steps

1. ✅ Set up custom domain
2. ✅ Enable email confirmations
3. ✅ Add more training content
4. ✅ Set up analytics
5. ✅ Create admin dashboard
6. ✅ Add real video content
7. ✅ Integrate with HR systems

---

**Need Help?** 
- Check the troubleshooting section
- Visit Supabase Discord
- Contact Sky266 IT support

**Congratulations on deploying your app! 🎊**
