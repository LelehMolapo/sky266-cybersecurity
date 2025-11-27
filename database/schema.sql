-- Supabase Database Schema for Sky266 Cybersecurity App

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'manager', 'booking-agent')),
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_progress table
CREATE TABLE IF NOT EXISTS training_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  videos_completed INTEGER DEFAULT 0,
  total_videos INTEGER DEFAULT 16,
  quizzes_passed INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 10,
  overall_progress INTEGER DEFAULT 0,
  certificates_earned INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date_earned TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER,
  valid_until TIMESTAMP WITH TIME ZONE,
  category TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Managers can view all profiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager'));

CREATE POLICY "Users can view own progress" ON training_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON training_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Managers can view all progress" ON training_progress FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager'));

CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own certificates" ON certificates FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function for new user signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role, department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'driver'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'driver') = 'driver' THEN 'Operations'
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'driver') = 'booking-agent' THEN 'Customer Service'
      ELSE 'Management'
    END
  );
  
  INSERT INTO training_progress (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();