// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Define interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'driver' | 'manager' | 'booking-agent';
  department?: string;
  created_at: string;
  last_active?: string;
}

export interface TrainingProgress {
  user_id: string;
  videos_completed: number;
  total_videos: number;
  quizzes_passed: number;
  total_quizzes: number;
  overall_progress: number;
  certificates_earned: number;
  last_updated: string;
  recentActivities?: Array<{
    title: string;
    status: string;
    time: string;
    type: 'success' | 'info' | 'warning';
  }>;
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date_earned: string;
  score: number;
  valid_until: string;
  category: string;
}

export interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  date: string;
  time: string;
}

// Safe environment variable access with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    // TypeScript should now recognize import.meta.env
    return (import.meta.env as any)[key] || fallback;
  } catch (error) {
    console.warn(`Failed to access ${key}:`, error);
    return fallback;
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Check if we have valid Supabase credentials
const hasValidSupabaseConfig = supabaseUrl && supabaseAnonKey && 
                              !supabaseUrl.includes('mock') && 
                              supabaseUrl.startsWith('http');

console.log('Supabase Config:', {
  hasValidSupabaseConfig,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
  hasKey: !!supabaseAnonKey
});

// Create Supabase client only if we have valid config
export const supabaseClient = hasValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock implementations (same as before)
async function mockSignUp(email: string, password: string, name: string, role: 'driver' | 'manager' | 'booking-agent') {
  const existingUser = localStorage.getItem(`sky266_user_${email}`);
  if (existingUser) {
    return { user: null, error: 'An account with this email already exists. Please sign in instead.' };
  }
  
  let managerCount = parseInt(localStorage.getItem('sky266_manager_count') || '0');
  if (role === 'manager' && managerCount >= 3) {
    return { user: null, error: 'Maximum 3 manager accounts allowed.' };
  }
  
  if (role === 'manager') {
    managerCount++;
    localStorage.setItem('sky266_manager_count', managerCount.toString());
  }
  
  const newUser: User = {
    id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    role,
    created_at: new Date().toISOString(),
    last_active: new Date().toISOString()
  };
  
  localStorage.setItem(`sky266_user_${email}`, JSON.stringify(newUser));
  localStorage.setItem('sky266_current_user', JSON.stringify(newUser));
  
  const mockProgress: TrainingProgress = {
    user_id: newUser.id,
    videos_completed: 0,
    total_videos: 25,
    quizzes_passed: 0,
    total_quizzes: 25,
    overall_progress: 0,
    certificates_earned: 0,
    last_updated: new Date().toISOString(),
  };
  
  localStorage.setItem(`sky266_progress_${newUser.id}`, JSON.stringify(mockProgress));
  console.log('Mock signup successful:', newUser);
  return { user: newUser, error: null };
}

async function mockSignIn(email: string, password: string) {
  const userJson = localStorage.getItem(`sky266_user_${email}`);
  if (!userJson) {
    return { user: null, error: 'User not found. Please sign up.' };
  }
  
  const user: User = JSON.parse(userJson);
  user.last_active = new Date().toISOString();
  localStorage.setItem(`sky266_user_${email}`, JSON.stringify(user));
  localStorage.setItem('sky266_current_user', JSON.stringify(user));
  console.log('Mock signin successful:', user);
  return { user, error: null };
}

// Keep all your other mock functions exactly as you had them...
async function mockGetUser(userId: string) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('sky266_user_')) {
      const user = JSON.parse(localStorage.getItem(key)!);
      if (user.id === userId) {
        return { data: user, error: null };
      }
    }
  }
  return { data: null, error: 'User not found' };
}

async function mockUpdateUser(userId: string, updates: Partial<User>) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('sky266_user_')) {
      const user = JSON.parse(localStorage.getItem(key)!);
      if (user.id === userId) {
        const updatedUser = { ...user, ...updates, last_active: new Date().toISOString() };
        localStorage.setItem(key, JSON.stringify(updatedUser));
        localStorage.setItem('sky266_current_user', JSON.stringify(updatedUser));
        return { data: updatedUser, error: null };
      }
    }
  }
  return { data: null, error: 'User not found' };
}

async function mockGetTrainingProgress(userId: string) {
  const progressJson = localStorage.getItem(`sky266_progress_${userId}`);
  if (progressJson) {
    return { data: JSON.parse(progressJson), error: null };
  }
  const defaultProgress: TrainingProgress = {
    user_id: userId,
    videos_completed: 0,
    total_videos: 25,
    quizzes_passed: 0,
    total_quizzes: 25,
    overall_progress: 0,
    certificates_earned: 0,
    last_updated: new Date().toISOString(),
  };
  localStorage.setItem(`sky266_progress_${userId}`, JSON.stringify(defaultProgress));
  return { data: defaultProgress, error: null };
}

// ... include all your other mock functions exactly as you had them

// Main database operations with real Supabase fallback to mock
export const supabaseDb = {
  async signUp(email: string, password: string, name: string, role: 'driver' | 'manager' | 'booking-agent') {
    // Check if user already exists
    const existingUser = localStorage.getItem(`sky266_user_${email}`);
    if (existingUser) {
      return { user: null, error: 'An account with this email already exists. Please sign in instead.' };
    }

    // Check manager limit
    let managerCount = parseInt(localStorage.getItem('sky266_manager_count') || '0');
    if (role === 'manager' && managerCount >= 3) {
      return { user: null, error: 'Maximum 3 manager accounts allowed.' };
    }
    
    if (role === 'manager') {
      managerCount++;
      localStorage.setItem('sky266_manager_count', managerCount.toString());
    }
    
    // Create user directly
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      role,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    };
    
    localStorage.setItem(`sky266_user_${email}`, JSON.stringify(newUser));
    localStorage.setItem('sky266_current_user', JSON.stringify(newUser));
    
    const mockProgress: TrainingProgress = {
      user_id: newUser.id,
      videos_completed: 0,
      total_videos: 25,
      quizzes_passed: 0,
      total_quizzes: 25,
      overall_progress: 0,
      certificates_earned: 0,
      last_updated: new Date().toISOString(),
    };
    
    localStorage.setItem(`sky266_progress_${newUser.id}`, JSON.stringify(mockProgress));
    console.log('Direct signup successful:', newUser);
    return { user: newUser, error: null };
  },

  async signIn(email: string, password: string) {
    try {
      // Try real Supabase if available
      if (supabaseClient) {
        console.log('Attempting real Supabase signin...');
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            return { user: null, error: 'Please verify your email before signing in. Check your inbox for the verification link.' };
          }
          console.warn('Supabase signin error:', error);
          throw error;
        }

        if (data.user && data.user.email_confirmed_at) {
          let user: User;
          
          // Try to get profile
          try {
            const { data: profile, error: profileError } = await supabaseClient
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) throw profileError;

            user = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role,
              department: profile.department,
              created_at: profile.created_at,
              last_active: new Date().toISOString()
            };
          } catch (profileError) {
            console.warn('Profile fetch failed, using auth data:', profileError);
            user = {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || 'User',
              role: data.user.user_metadata?.role || 'driver',
              created_at: new Date().toISOString(),
              last_active: new Date().toISOString()
            };
          }

          localStorage.setItem('sky266_current_user', JSON.stringify(user));
          console.log('Real Supabase signin successful');
          return { user, error: null };
        } else if (data.user && !data.user.email_confirmed_at) {
          return { user: null, error: 'Please verify your email before signing in.' };
        }
      }
    } catch (error) {
      console.warn('Real Supabase signin failed, falling back to mock:', error);
    }

    // Fallback to mock implementation
    console.log('Using mock signin');
    return await mockSignIn(email, password);
  },

  async signOut() {
    try {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
    } catch (error) {
      console.warn('Supabase signout error:', error);
    }

    localStorage.removeItem('sky266_current_user');
    return { error: null };
  },

  // For now, use mock implementations for other methods
  async getUser(userId: string) {
    return await mockGetUser(userId);
  },

  async updateUser(userId: string, updates: Partial<User>) {
    return await mockUpdateUser(userId, updates);
  },

  async getTrainingProgress(userId: string) {
    return await mockGetTrainingProgress(userId);
  },

  async updateTrainingProgress(userId: string, updates: Partial<TrainingProgress>) {
    try {
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from('training_progress')
          .upsert({
            user_id: userId,
            videos_completed: updates.videos_completed,
            quizzes_passed: updates.quizzes_passed,
            certificates_earned: updates.certificates_earned,
            last_updated: new Date().toISOString()
          })
          .select()
          .single();

        if (!error && data) {
          localStorage.setItem(`sky266_progress_${userId}`, JSON.stringify(data));
          window.dispatchEvent(new CustomEvent('trainingProgressUpdate', { 
            detail: { userId, progress: data } 
          }));
          return { data, error: null };
        }
      }
    } catch (error) {
      console.warn('Supabase progress update failed, using mock:', error);
    }

    // Fallback to mock
    const progressJson = localStorage.getItem(`sky266_progress_${userId}`);
    if (!progressJson) {
      return { data: null, error: 'Progress not found' };
    }
    const progress: TrainingProgress = JSON.parse(progressJson);
    const updatedProgress = { ...progress, ...updates, last_updated: new Date().toISOString() };
    updatedProgress.overall_progress = Math.round(
      ((updatedProgress.videos_completed / updatedProgress.total_videos +
        updatedProgress.quizzes_passed / updatedProgress.total_quizzes) / 2) * 100
    );
    localStorage.setItem(`sky266_progress_${userId}`, JSON.stringify(updatedProgress));
    window.dispatchEvent(new CustomEvent('trainingProgressUpdate', { 
      detail: { userId, progress: updatedProgress } 
    }));
    return { data: updatedProgress, error: null };
  },

  async getCertificates(userId: string) {
    const certsJson = localStorage.getItem(`sky266_certs_${userId}`);
    return { data: certsJson ? JSON.parse(certsJson) : [], error: null };
  },

  async addCertificate(certificate: Omit<Certificate, 'id'>) {
    try {
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from('certificates')
          .insert(certificate)
          .select()
          .single();

        if (!error && data) {
          // Update certificates count in progress
          const { data: certCount } = await supabaseClient
            .from('certificates')
            .select('id', { count: 'exact' })
            .eq('user_id', certificate.user_id);

          await supabaseClient
            .from('training_progress')
            .update({ certificates_earned: certCount?.length || 0 })
            .eq('user_id', certificate.user_id);

          return { data, error: null };
        }
      }
    } catch (error) {
      console.warn('Supabase certificate add failed, using mock:', error);
    }

    // Fallback to mock
    const certsJson = localStorage.getItem(`sky266_certs_${certificate.user_id}`);
    const certs = certsJson ? JSON.parse(certsJson) : [];
    const newCert: Certificate = {
      ...certificate,
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    certs.unshift(newCert);
    localStorage.setItem(`sky266_certs_${certificate.user_id}`, JSON.stringify(certs));
    
    const progressJson = localStorage.getItem(`sky266_progress_${certificate.user_id}`);
    if (progressJson) {
      const progress = JSON.parse(progressJson);
      progress.certificates_earned = certs.length;
      localStorage.setItem(`sky266_progress_${certificate.user_id}`, JSON.stringify(progress));
    }
    return { data: newCert, error: null };
  },

  async getSecurityAlerts() {
    return { data: [], error: null };
  },

  async getAllUsersProgress() {
    try {
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from('profiles')
          .select(`
            *,
            training_progress(*)
          `)
          .neq('role', 'manager');

        if (!error && data) {
          return { data, error: null };
        }
      }
    } catch (error) {
      console.warn('Supabase users progress fetch failed, using mock:', error);
    }

    // Fallback to mock
    const users: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sky266_user_') && !key.includes('manager')) {
        const user = JSON.parse(localStorage.getItem(key)!);
        const progressJson = localStorage.getItem(`sky266_progress_${user.id}`);
        const progress = progressJson ? JSON.parse(progressJson) : null;
        users.push({ ...user, training_progress: progress });
      }
    }
    return { data: users, error: null };
  },

  async getManagerCount() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sky266_user_')) {
        const user = JSON.parse(localStorage.getItem(key)!);
        if (user.role === 'manager') count++;
      }
    }
    return { count, error: null };
  },

  async getAllUsers() {
    const users: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sky266_user_')) {
        users.push(JSON.parse(localStorage.getItem(key)!));
      }
    }
    return { data: users, error: null };
  },

  async deleteAllUsers() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sky266_user_') || key.startsWith('sky266_progress_') || key.startsWith('sky266_certs_'))) {
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem('sky266_manager_count');
    localStorage.removeItem('sky266_current_user');
    return { success: true, error: null };
  },

  async deleteUserById(userId: string) {
    let deleted = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sky266_user_')) {
        const user = JSON.parse(localStorage.getItem(key)!);
        if (user.id === userId) {
          if (user.role === 'manager') {
            let managerCount = parseInt(localStorage.getItem('sky266_manager_count') || '0');
            managerCount = Math.max(0, managerCount - 1);
            localStorage.setItem('sky266_manager_count', managerCount.toString());
          }
          localStorage.removeItem(key);
          localStorage.removeItem(`sky266_progress_${userId}`);
          localStorage.removeItem(`sky266_certs_${userId}`);
          if (localStorage.getItem('sky266_current_user')?.includes(userId)) {
            localStorage.removeItem('sky266_current_user');
          }
          deleted = true;
          break;
        }
      }
    }
    return { success: deleted, error: deleted ? null : 'User not found' };
  },

  // Real-time progress tracking functions
  async recordVideoCompletion(userId: string, videoId: string) {
    const { data: progress } = await this.getTrainingProgress(userId);
    if (progress) {
      const newVideosCompleted = Math.min(progress.videos_completed + 1, progress.total_videos);
      return await this.updateTrainingProgress(userId, {
        videos_completed: newVideosCompleted
      });
    }
    return { data: null, error: 'Progress not found' };
  },

  async recordQuizCompletion(userId: string, quizId: string, passed: boolean) {
    const { data: progress } = await this.getTrainingProgress(userId);
    if (progress && passed) {
      const newQuizzesPassed = Math.min(progress.quizzes_passed + 1, progress.total_quizzes);
      return await this.updateTrainingProgress(userId, {
        quizzes_passed: newQuizzesPassed
      });
    }
    return { data: null, error: 'Progress not found' };
  },
  



};