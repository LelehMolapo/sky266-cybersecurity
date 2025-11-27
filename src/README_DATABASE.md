# Sky266 Security Platform - Database Setup Guide

## Overview
This application uses **Supabase** as the backend database (PostgreSQL). Supabase provides authentication, real-time database, and storage out of the box.

## Why Supabase instead of MongoDB?
- **Built-in Authentication**: Supabase provides secure JWT-based authentication
- **Real-time Capabilities**: Live updates for manager dashboards
- **Row Level Security**: Automatic data protection based on user roles
- **Better Integration**: Works seamlessly in this environment

## Database Schema

### Tables

#### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'manager', 'booking-agent')),
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT
);
```

#### 2. training_progress
```sql
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
```

#### 3. certificates
```sql
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
```

#### 4. video_completions
```sql
CREATE TABLE video_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);
```

#### 5. quiz_results
```sql
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. security_alerts
```sql
CREATE TABLE security_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'info', 'success')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);
```

## Setting Up Supabase

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Save your project URL and anon key

### Step 2: Run the SQL Schema
1. In Supabase Dashboard, go to SQL Editor
2. Copy and paste the SQL schema above
3. Run the queries to create tables

### Step 3: Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
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

CREATE POLICY "Users can update own progress" ON training_progress
  FOR ALL USING (user_id = auth.uid());

-- Managers can view all progress
CREATE POLICY "Managers can view all progress" ON training_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Similar policies for other tables...
```

### Step 4: Configure Environment Variables
Create a `.env` file (not tracked in git):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 5: Update the Supabase Client
Replace the mock implementation in `/lib/supabase.ts` with:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Then update all the db functions to use the real Supabase client
```

## Data Flow

### Authentication Flow
1. User signs up/signs in via AuthPage
2. Supabase creates user record with JWT token
3. Token is stored in localStorage
4. All subsequent requests use this token

### Training Progress Flow
1. User completes video/quiz
2. Frontend calls `db.updateTrainingProgress()`
3. Supabase updates the database
4. Manager dashboard shows real-time updates

### Manager Dashboard Flow
1. Manager signs in
2. Dashboard calls `db.getAllUsersProgress()`
3. Supabase returns all non-manager users with their progress
4. Dashboard displays real-time data

## API Endpoints (via Supabase Functions)

All database operations go through Supabase's auto-generated REST API:
- `GET /rest/v1/users` - Get users
- `POST /rest/v1/training_progress` - Update progress
- `GET /rest/v1/certificates?user_id=eq.{id}` - Get certificates
- etc.

## Security Features

1. **Row Level Security**: Users can only access their own data
2. **JWT Authentication**: Secure token-based auth
3. **Role-based Access**: Managers have additional permissions
4. **Encrypted Passwords**: Supabase handles password hashing
5. **HTTPS Only**: All connections are encrypted

## Testing the Database

### Sample Data
```sql
-- Insert sample driver
INSERT INTO users (email, name, role, department) VALUES
('john.driver@sky266.com', 'John Driver', 'driver', 'Fleet Operations');

-- Insert sample progress
INSERT INTO training_progress (user_id, videos_completed, quizzes_passed, overall_progress) VALUES
((SELECT id FROM users WHERE email = 'john.driver@sky266.com'), 10, 7, 65);
```

## Connecting the Frontend

To connect the app to Supabase:

1. Click the "Connect to Supabase" button in the app
2. Enter your Supabase credentials
3. The app will automatically connect and sync data

## Next Steps

1. Set up Supabase project
2. Run the SQL schema
3. Configure RLS policies
4. Add environment variables
5. Replace mock functions with real Supabase calls
6. Test authentication and data flow
7. Deploy to production

## Support

For issues with Supabase setup:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
