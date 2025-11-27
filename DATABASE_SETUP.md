# Database Setup for Email Verification and Real-time Updates

## Supabase Configuration

### 1. Email Authentication Setup

In your Supabase dashboard:

1. Go to **Authentication > Settings**
2. Enable **Email confirmations**
3. Set **Site URL** to your domain (e.g., `https://yourdomain.com`)
4. Add **Redirect URLs**: `https://yourdomain.com/auth/callback`

### 2. Database Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'manager', 'booking-agent')),
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create training_progress table
CREATE TABLE IF NOT EXISTS public.training_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  videos_completed INTEGER DEFAULT 0,
  total_videos INTEGER DEFAULT 16,
  quizzes_passed INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 10,
  overall_progress INTEGER DEFAULT 0,
  certificates_earned INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date_earned TIMESTAMPTZ DEFAULT NOW(),
  score INTEGER,
  valid_until TIMESTAMPTZ,
  category TEXT
);

-- Row Level Security Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON public.training_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.training_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.training_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can view all progress" ON public.training_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'manager'
    )
  );

CREATE POLICY "Users can view own certificates" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates" ON public.certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'driver'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Operations')
  );
  
  INSERT INTO public.training_progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update overall progress
CREATE OR REPLACE FUNCTION public.update_overall_progress()
RETURNS TRIGGER AS $$
BEGIN
  NEW.overall_progress = ROUND(
    ((NEW.videos_completed::FLOAT / NEW.total_videos) + 
     (NEW.quizzes_passed::FLOAT / NEW.total_quizzes)) / 2 * 100
  );
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate overall progress
CREATE TRIGGER calculate_progress
  BEFORE UPDATE ON public.training_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_overall_progress();
```

### 3. Email Templates (Optional)

You can customize email templates in Supabase:

1. Go to **Authentication > Email Templates**
2. Customize the **Confirm signup** template
3. Use variables like `{{ .ConfirmationURL }}` and `{{ .SiteURL }}`

### 4. Environment Variables

Make sure your `.env.local` file has:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features Implemented

### Email Verification
- ✅ Real email verification on signup
- ✅ Resend verification email functionality
- ✅ Callback handling for email confirmation
- ✅ Prevents login without email verification

### Real-time Dashboard Updates
- ✅ Progress updates broadcast to manager dashboard
- ✅ Video completion tracking
- ✅ Quiz completion tracking
- ✅ Certificate generation
- ✅ Live progress bars and statistics

### Fallback Support
- ✅ Falls back to localStorage if Supabase unavailable
- ✅ Maintains functionality in demo mode
- ✅ Graceful error handling

## Testing

1. **Email Verification**: Sign up with a real email address and check your inbox
2. **Real-time Updates**: Have a manager account open while users complete training
3. **Fallback Mode**: Disable internet to test localStorage fallback

## Production Deployment

1. Set up custom domain in Supabase
2. Configure SMTP settings for custom email domain
3. Set up proper redirect URLs for your production domain
4. Enable database backups
5. Monitor email delivery rates