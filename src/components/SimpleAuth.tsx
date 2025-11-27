import { useState } from 'react';
import { toast } from 'sonner';
import { supabaseDb, type User as AuthUser } from '../lib/supabase';
import { validateEmail, validatePassword } from '../lib/validation';

interface SimpleAuthProps {
  onLogin: (user: AuthUser | null) => void;
  onSignUp: (user: AuthUser | null) => void;
}

export default function SimpleAuth({ onLogin, onSignUp }: SimpleAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'driver' | 'manager' | 'booking-agent'>('driver');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSubmit = async () => {
    console.log('Submit clicked! isLogin:', isLogin);
    console.log('Form data:', { name, email, password, confirmPassword, role });
    
    if (isLogin) {
      console.log('Processing login...');
      if (!email || !password) {
        console.log('Login validation failed: missing fields');
        toast.error('Please fill all fields');
        return;
      }
      
      setIsLoading(true);
      const result = await supabaseDb.signIn(email, password);
      setIsLoading(false);
      
      if (result.error) {
        toast.error(result.error);
      } else if (result.user) {
        toast.success('Login successful!');
        onLogin(result.user);
      }
    } else {
      console.log('Processing signup...');
      
      // Basic validation
      if (!name || !email || !password || !confirmPassword) {
        console.log('Signup validation failed: missing fields');
        toast.error('Please fill all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        console.log('Signup validation failed: passwords do not match');
        toast.error('Passwords do not match');
        return;
      }
      
      // Skip password validation for now to test
      console.log('All validations passed, calling signUp...');
      
      setIsLoading(true);
      
      try {
        const result = await supabaseDb.signUp(email, password, name, role);
        console.log('SignUp function returned:', result);
        
        setIsLoading(false);
        
        if (result.error) {
          console.log('Signup error:', result.error);
          toast.error(result.error);
        } else if (result.message) {
          console.log('Signup message - showing OTP:', result.message);
          toast.success('Check your email for verification code');
          setShowOTP(true);
        } else if (result.user) {
          console.log('Signup user created:', result.user);
          toast.success('Account created!');
          onSignUp(result.user);
        } else {
          console.log('Unexpected signup result, forcing OTP screen:', result);
          toast.success('Proceeding to verification');
          setShowOTP(true);
        }
      } catch (error) {
        console.error('SignUp function threw error:', error);
        setIsLoading(false);
        toast.error('Signup failed: ' + error);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Please enter 6-digit code');
      return;
    }
    
    setIsLoading(true);
    const result = await supabaseDb.verifyOTP(email, otpCode);
    setIsLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.user) {
      toast.success('Account verified!');
      onSignUp(result.user);
    }
  };

  if (showOTP) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>Enter Verification Code</h2>
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            We sent a 6-digit code to {email}
          </p>
          
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '4px'
            }}
            maxLength={6}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowOTP(false)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              onClick={handleVerifyOTP}
              disabled={isLoading || otpCode.length !== 6}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading || otpCode.length !== 6 ? 'not-allowed' : 'pointer',
                opacity: isLoading || otpCode.length !== 6 ? 0.5 : 1
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#0ea5e9', marginBottom: '10px' }}>Sky266 Security Portal</h1>
          <p style={{ color: '#6b7280' }}>Cybersecurity Training</p>
        </div>

        <div style={{ display: 'flex', marginBottom: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: isLogin ? '#0ea5e9' : 'transparent',
              color: isLogin ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: !isLogin ? '#0ea5e9' : 'transparent',
              color: !isLogin ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          
          {!isLogin && (
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
              
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'driver' | 'manager' | 'booking-agent')}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                <option value="driver">Driver</option>
                <option value="booking-agent">Booking Agent</option>
                <option value="manager">Manager</option>
              </select>
            </>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginBottom: '10px'
            }}
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
          
          {!isLogin && (
            <button
              onClick={() => {
                console.log('Test button clicked - forcing OTP screen');
                setEmail('test@example.com');
                setShowOTP(true);
                toast.success('Test: Going to verification screen');
              }}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              TEST: Skip to Verification
            </button>
          )}
        </div>
      </div>
    </div>
  );
}