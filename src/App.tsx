// src/App.tsx
import './index.css';
import { useState, useEffect } from 'react';
import { 
  Shield, 
  Video, 
  Brain, 
  Bell, 
  Home, 
  User as UserIcon, 
  Award, 
  LogOut, 
  Languages 
} from 'lucide-react';

import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './components/ui/dropdown-menu';
import DashboardOverview from './components/DashboardOverview';
import VideoSection from './components/VideoSection';
import QuizSection from './components/QuizSection';
import UpdatesDialog from './components/UpdatesDialog';
import AuthPage from './components/AuthPage';

import { ErrorBoundary } from './components/ErrorBoundary';
import { trackPageView } from './lib/analytics';
import ManagerDashboard from './components/ManagerDashboard';
import ProfileSettings from './components/ProfileSettings';
import MyCertificates from './components/MyCertificates';
import AIAssistant from './components/AIAssistant';
import EducationalNotifications from './components/EducationalNotifications';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { supabaseDb, type User } from './lib/supabase';
import { UserProvider, useUser } from './context/UserContext';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch(() => console.log('SW registration failed'));
  });
}

// Company logo
import logoImage from './assets/306db3fa21b8d8b2a0c691c532450ecff9e58822.png';

type ViewType = 'dashboard' | 'profile' | 'certificates';

// Main app content component
function AppContent() {
  const { user, setUser, language, toggleLanguage } = useUser();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthCallback, setShowAuthCallback] = useState(false);

  // Track page views
  useEffect(() => {
    trackPageView('app_load');
  }, []);

  // Load user from localStorage on initial render and check for auth callback
  useEffect(() => {
    // Check if this is an auth callback
    const urlParams = new URLSearchParams(window.location.search);
    if (window.location.pathname === '/auth/callback' || urlParams.has('code')) {
      setShowAuthCallback(true);
      return;
    }

    const storedUser = localStorage.getItem('sky266_current_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as User;
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('sky266_current_user');
      }
    }
  }, [setUser]);

  // Welcome messages and notifications
  useEffect(() => {
    if (!user) return;

    const welcomeTimer = setTimeout(() => {
      const descriptions = language === 'en' ? {
        driver: 'You have 2 pending training modules on mobile device security',
        'booking-agent': 'Complete your customer data protection training',
        manager: 'Your team has 15 active staff in security training',
      } : {
        driver: 'O na le lithuto tse 2 tse emetseng ka tsamaiso ea tsamaiso ea mobile',
        'booking-agent': 'Qeta thuto ea hao ea tsamaiso ea data ea morekisi',
        manager: 'Sehlopha sa hau se na le basebetsi ba 15 ba sebetsang ka thata thutong ea tsamaiso',
      };
      
      toast.info(
        language === 'en' 
          ? `Welcome back, ${user.name.split(' ')[0]}!` 
          : `Rea u amohela hape, ${user.name.split(' ')[0]}!`, 
        {
          description: descriptions[user.role],
        }
      );
    }, 1000);

    if (user.role !== 'manager') {
      const tipTimer = setTimeout(() => {
        const tips = language === 'en' ? {
          driver: 'Never share delivery codes or customer information with unauthorized persons',
          'booking-agent': 'Always verify customer identity before sharing shipment details',
          manager: 'Always verify sender email addresses before clicking links',
        } : {
          driver: 'Le ka mohla u se ke ua arolelana likhoutu tsa thepa kapa tlhaiso ea morekisi le batho ba sa lumelloang',
          'booking-agent': 'Kamehla netefatse boitsebiso ba morekisi pele u arolelana lintlha tsa thepa',
          manager: 'Kamehla netefatse liaterese tsa lengolo-tsoibila la motho ea romileng pele u tobetsa lihokelo',
        };
        
        toast('Security Tip', {
          description: tips[user.role] || 
            (language === 'en' 
              ? 'Always verify sender email addresses before clicking links' 
              : 'Kamehla netefatse liaterese tsa lengolo-tsoibila la motho ea romileng pele u tobetsa lihokelo'),
          icon: '🔒',
        });
      }, 3000);

      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(tipTimer);
      };
    }

    return () => clearTimeout(welcomeTimer);
  }, [user, language]);

  const handleNotificationClick = () => {
    setShowUpdateDialog(true);
    setHasNewNotifications(false);
  };

  const handleLogin = async (userData: User | null) => {
    if (userData) {
      setUser(userData);
      toast.success('Sign in successful', {
        description: `Welcome to Sky266 Courier Security, ${userData.name}!`,
      });
    } else {
      toast.error('Sign in failed', { 
        description: 'Invalid credentials. Please try again.' 
      });
    }
  };

  const handleSignUp = async (userData: User | null) => {
    if (userData) {
      setUser(userData);
      toast.success('Account created successfully', {
        description: `Welcome to Sky266, ${userData.name}! Let's get you started with security training.`,
      });
    } else {
      // Don't show error for email verification case
      // The AuthPage will handle showing the verification message
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    setShowAuthCallback(false);
    if (success) {
      toast.success('Email verified!', {
        description: 'You can now sign in with your credentials.'
      });
    }
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabaseDb.signOut();
      setUser(null);
      setCurrentView('dashboard');
      setActiveTab('dashboard');
      toast.info('Signed out', { 
        description: 'You have been successfully signed out' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Sign out failed', {
        description: 'There was an issue signing out. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = (name: string, email: string) => {
    if (user) {
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      toast.success('Profile updated', {
        description: 'Your profile information has been updated successfully.'
      });
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'manager':
        return 'bg-purple-600';
      case 'driver':
        return 'bg-blue-600';
      case 'booking-agent':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'manager':
        return 'Manager';
      case 'driver':
        return 'Driver';
      case 'booking-agent':
        return 'Booking Agent';
      default:
        return role;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth callback if needed
  if (showAuthCallback) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  // Show auth page if no user
  if (!user) {
    return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Toaster theme="light" position="top-right" />
      
      {/* Header */}
      <header className="navbar bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="Sky266 Logo"
                className="h-12 w-auto object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-white text-lg font-bold">Security Portal</h1>
                <p className="text-sky-100 text-xs">Cybersecurity Awareness</p>
              </div>
            </div>
            
            {/* User Controls */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="relative text-white hover:bg-gray-700 transition-colors"
                title={language === 'en' ? 'Switch to Sesotho' : 'Switch to English'}
              >
                <Languages className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotificationClick}
                className="relative text-white hover:bg-gray-700 transition-colors"
                title="View notifications"
              >
                <Bell className="w-5 h-5" />
                {hasNewNotifications && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
                  </>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-gray-700 transition-colors"
                    aria-label="User menu"
                  >
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className={getRoleBadgeColor(user.role) + " text-white"}>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-sky-100 capitalize">
                        {getRoleDisplayName(user.role)}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-gray-900 border-gray-800 text-white w-56"
                  align="end"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                      <Badge className={`mt-1 ${getRoleBadgeColor(user.role)} self-start`}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem 
                    className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer"
                    onClick={() => setCurrentView('profile')}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  {user.role !== 'manager' && (
                    <DropdownMenuItem 
                      className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer"
                      onClick={() => setCurrentView('certificates')}
                    >
                      <Award className="w-4 h-4 mr-2" />
                      My Certificates
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem 
                    className="text-red-400 focus:bg-gray-800 focus:text-red-400 cursor-pointer"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoading ? 'Signing Out...' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'profile' ? (
          <ProfileSettings 
            user={user} 
            onBack={() => setCurrentView('dashboard')}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : currentView === 'certificates' && user.role !== 'manager' ? (
          <MyCertificates onBack={() => setCurrentView('dashboard')} />
        ) : user.role === 'manager' ? (
          <ManagerDashboard />
        ) : (
          <>
            {/* Navigation Bar */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-2 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'videos' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'videos' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                >
                  <Video className="w-4 h-4" />
                  Videos
                </Button>
                <Button
                  variant={activeTab === 'quizzes' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('quizzes')}
                  className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'quizzes' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                >
                  <Brain className="w-4 h-4" />
                  Quizzes
                </Button>
                <Button
                  variant={activeTab === 'assistant' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('assistant')}
                  className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'assistant' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                >
                  <Shield className="w-4 h-4" />
                  AI Help
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="w-full">

              {activeTab === 'dashboard' && <DashboardOverview onNavigate={setActiveTab} />}
              {activeTab === 'videos' && <VideoSection />}
              {activeTab === 'quizzes' && <QuizSection />}
              {activeTab === 'assistant' && <AIAssistant />}
            </div>
          </>
        )}
      </main>

      {/* Updates Dialog */}
      {user.role !== 'manager' && (
        <UpdatesDialog 
          open={showUpdateDialog} 
          onOpenChange={setShowUpdateDialog} 
        />
      )}

      {/* Educational Notifications */}
      <EducationalNotifications />

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <p>&copy; 2025 Sky266 Courier Services. All rights reserved.</p>
            <div className="flex gap-4">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Security Guidelines</button>
              <button className="hover:text-white transition-colors">Help Center</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Root App component
export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ErrorBoundary>
  );
}
