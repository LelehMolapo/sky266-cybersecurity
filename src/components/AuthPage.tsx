// src/components/AuthPage.tsx - NO OTP VERIFICATION - DIRECT SIGNUP TO DASHBOARD
import '../styles/auth.css';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Truck, UserCog, Headphones, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { supabaseDb, type User as AuthUser } from '../lib/supabase';
import { validateEmail, validatePassword, validateName, sanitizeInput } from '../lib/validation';
import { loginRateLimiter } from '../lib/rateLimiter';

const logoImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="24" font-weight="bold" fill="%230ea5e9"%3ESky266%3C/text%3E%3C/svg%3E';

interface AuthPageProps {
  onLogin: (user: AuthUser | null) => void;
  onSignUp: (user: AuthUser | null) => void;
}

export default function AuthPage({ onLogin, onSignUp }: AuthPageProps) {
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [signupName, setSignupName] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<'driver' | 'manager' | 'booking-agent'>('driver');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState<boolean>(false);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Error', { description: 'Please fill in all fields' });
      return;
    }

    if (!validateEmail(loginEmail)) {
      toast.error('Error', { description: 'Please enter a valid email address' });
      return;
    }

    if (!loginRateLimiter.isAllowed(loginEmail)) {
      const remainingTime = Math.ceil(loginRateLimiter.getRemainingTime(loginEmail) / 60000);
      toast.error('Too many attempts', { 
        description: `Please wait ${remainingTime} minutes before trying again` 
      });
      return;
    }

    setIsLoading(true);
    const result = await supabaseDb.signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (result.error) {
      toast.error('Login Failed', { description: result.error });
      return;
    }

    if (result.user) {
      toast.success('Welcome back!', { description: `Hello, ${result.user.name}!` });
      onLogin(result.user);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Creating account...');
    
    if (!signupName?.trim() || !signupEmail?.trim() || !signupPassword || !confirmPassword) {
      toast.error('Error', { description: 'Please fill in all fields' });
      return;
    }

    // Allow any email format - no validation needed

    if (signupPassword !== confirmPassword) {
      toast.error('Error', { description: 'Passwords do not match' });
      return;
    }

    const passwordValidation = validatePassword(signupPassword);
    if (!passwordValidation.valid) {
      toast.error('Password Requirements Not Met', { 
        description: passwordValidation.message,
        duration: 5000
      });
      setShowPasswordHelp(true);
      return;
    }
    setIsLoading(true);
    
    try {
      const result = await supabaseDb.signUp(signupEmail.trim(), signupPassword, signupName.trim(), role);
      console.log('SignUp result:', result);
      
      console.log('Signup result received:', result);
      
      if (result.error) {
        console.log('Signup error:', result.error);
        toast.error('Signup Failed', { description: result.error });
      } else if (result.user) {
        console.log('Signup successful, calling onSignUp with user:', result.user);
        toast.success('Account Created!', { description: `Welcome to Sky266, ${result.user.name}!` });
        onSignUp(result.user);
      } else {
        console.log('Unexpected signup result - no user and no error:', result);
        toast.error('Unexpected error', { description: 'Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Error', { description: 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-pattern" />

      <Card className="auth-card">
        <CardHeader className="card-header">
          <div className="flex" style={{ display: 'block', textAlign: 'center' }}>
            <ImageWithFallback 
              src={logoImage}
              alt="Sky266 Courier Logo"
              className="auth-logo"
            />
          </div>
          <div>
            <CardTitle className="card-title">Sky266 Security Portal v2.0</CardTitle>
            <CardDescription className="card-description">
              Cybersecurity Training for Courier Operations
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="card-content">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="tabs-list">
              <TabsTrigger value="login" className="tab-trigger">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="tab-trigger">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="form">
                <div>
                  <Label htmlFor="login-email" className="field-label">Email Address</Label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@sky266.com"
                      value={loginEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="field-label">Password</Label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="row-between" style={{ marginTop: '0.4rem' }}>
                  <label className="small-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" className="checkbox" />
                    Remember me
                  </label>
                  <button 
                    type="button" 
                    className="small-muted" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sky)' }}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" disabled={isLoading} className="btn-primary">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="form">
                <div>
                  <Label htmlFor="signup-name" className="field-label">Full Name</Label>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Full Names"
                      value={signupName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignupName(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="field-label">Email Address</Label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@sky266.com"
                      value={signupEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignupEmail(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-password" className="field-label">Password</Label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignupPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="field-label">Confirm Password</Label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="role-group">
                  <Label className="field-label">Select Your Role</Label>
                  <RadioGroup value={role} onValueChange={(value: 'driver' | 'manager' | 'booking-agent') => setRole(value)}>
                    <div className={`role-card ${role === 'driver' ? 'selected' : ''}`}>
                      <RadioGroupItem value="driver" id="signup-driver" />
                      <Label htmlFor="signup-driver" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', cursor: 'pointer' }}>
                        <Truck className="role-icon" />
                        <span style={{ color: '#fff', fontSize: '0.95rem' }}>Driver</span>
                      </Label>
                    </div>

                    <div className={`role-card ${role === 'booking-agent' ? 'selected' : ''}`}>
                      <RadioGroupItem value="booking-agent" id="signup-booking" />
                      <Label htmlFor="signup-booking" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', cursor: 'pointer' }}>
                        <Headphones className="role-icon" />
                        <span style={{ color: '#fff', fontSize: '0.95rem' }}>Booking Agent</span>
                      </Label>
                    </div>

                    <div className={`role-card ${role === 'manager' ? 'selected' : ''}`}>
                      <RadioGroupItem value="manager" id="signup-manager" />
                      <Label htmlFor="signup-manager" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', cursor: 'pointer' }}>
                        <UserCog className="role-icon" />
                        <span style={{ color: '#fff', fontSize: '0.95rem' }}>Manager</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                {showPasswordHelp && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                    <h4 className="text-yellow-400 font-medium mb-2">Password Requirements:</h4>
                    <ul className="text-yellow-300 text-sm space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• At least one uppercase letter (A-Z)</li>
                      <li>• At least one lowercase letter (a-z)</li>
                      <li>• At least one number (0-9)</li>
                      <li>• At least one special character (!@#$%^&*)</li>
                    </ul>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPasswordHelp(false)}
                      className="text-yellow-400 hover:text-yellow-300 mt-2 p-0 h-auto"
                    >
                      Got it ✓
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>

          <p className="auth-footer">
            By continuing, you agree to Sky266's Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
