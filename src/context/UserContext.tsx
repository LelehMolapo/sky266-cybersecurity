// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TrainingProgress, Certificate as SupabaseCertificate } from '../lib/supabase';
import { toast } from 'sonner';

type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'professional';

interface UserProgress {
  videos_completed: number;
  total_videos: number;
  quizzes_passed: number;
  total_quizzes: number;
  overall_progress: number;
  certificates_earned: number;
  current_level: Level;
  level_progress: { videos: number; quizzes: number };
  recentActivities: Array<{
    title: string;
    status: 'Passed' | 'Completed' | 'Pending';
    time: string;
    type: 'success' | 'info' | 'warning';
  }>;
  certificates: SupabaseCertificate[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  addActivity: (activity: UserProgress['recentActivities'][0]) => void;
  addCertificate: (cert: SupabaseCertificate) => void;
  downloadCertificate: (cert: SupabaseCertificate) => void;
  language: 'en' | 'st';
  toggleLanguage: () => void;
  getCurrentLevel: () => Level;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    videos_completed: 0,
    total_videos: 25,
    quizzes_passed: 0,
    total_quizzes: 25,
    overall_progress: 0,
    certificates_earned: 0,
    current_level: 'beginner',
    level_progress: { videos: 0, quizzes: 0 },
    recentActivities: [],
    certificates: [],
  });
  const [language, setLanguage] = useState<'en' | 'st'>('en');

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('sky266_current_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          
          // Load progress from localStorage or Supabase mock
          const storedProgress = localStorage.getItem(`sky266_progress_${parsedUser.id}`);
          if (storedProgress) {
            const progressData = JSON.parse(storedProgress);
            setProgress(prev => ({
              ...prev,
              ...progressData,
              recentActivities: progressData.recentActivities || [],
              certificates: progressData.certificates || []
            }));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          localStorage.removeItem('sky266_current_user');
        }
      } else {
        setUser(null);
      }
    };

    loadUser(); // Initial load

    // Listen to storage changes for real-time updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sky266_current_user') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (user && progress) {
      localStorage.setItem(`sky266_progress_${user.id}`, JSON.stringify(progress));
    }
  }, [user, progress]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => {
      const newProgress = { ...prev, ...updates };
      
      // Calculate level progression
      const levelVideos = newProgress.level_progress?.videos || 0;
      const levelQuizzes = newProgress.level_progress?.quizzes || 0;
      
      if (levelVideos >= 5 && levelQuizzes >= 5) {
        const levels: Level[] = ['beginner', 'intermediate', 'advanced', 'expert', 'professional'];
        const currentIndex = levels.indexOf(newProgress.current_level);
        if (currentIndex < levels.length - 1) {
          newProgress.current_level = levels[currentIndex + 1];
          newProgress.level_progress = { videos: 0, quizzes: 0 };
          
          // Show level up notification
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              const { toast } = require('sonner');
              toast.success('Level Up!', {
                description: `Congratulations! You've advanced to ${levels[currentIndex + 1]} level!`
              });
            }, 500);
          }
        }
      }
      
      newProgress.overall_progress = Math.round(
        ((newProgress.videos_completed / newProgress.total_videos + 
          newProgress.quizzes_passed / newProgress.total_quizzes) / 2) * 100
      );
      
      if (user) {
        localStorage.setItem(`sky266_progress_${user.id}`, JSON.stringify(newProgress));
        window.dispatchEvent(new CustomEvent('trainingProgressUpdate', { 
          detail: { userId: user.id, progress: newProgress } 
        }));
      }
      
      return newProgress;
    });
  };

  const addActivity = (activity: UserProgress['recentActivities'][0]) => {
    setProgress(prev => ({
      ...prev,
      recentActivities: [activity, ...prev.recentActivities.slice(0, 4)],
    }));
  };

  const addCertificate = (cert: SupabaseCertificate) => {
    setProgress(prev => ({
      ...prev,
      certificates: [cert, ...prev.certificates],
      certificates_earned: prev.certificates_earned + 1,
    }));
  };

  const downloadCertificate = (cert: SupabaseCertificate) => {
    const txtContent = `Sky266 Cybersecurity Certificate\n\nTitle: ${cert.title}\nDescription: ${cert.description}\nDate Earned: ${cert.date_earned}\nScore: ${cert.score}%\nValid Until: ${cert.valid_until}\nCategory: ${cert.category}\n\n---\nThis is to certify that the holder has completed the required training.`;
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.title.replace(/\s+/g, '_')}_certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Certificate Downloaded', { description: 'Saved as TXT file' });
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'st' : 'en');
  const getCurrentLevel = () => progress.current_level;

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      progress, 
      updateProgress, 
      addActivity, 
      addCertificate, 
      downloadCertificate, 
      language, 
      toggleLanguage,
      getCurrentLevel
    }}>
      {children}
    </UserContext.Provider>
  );
};
