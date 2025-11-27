import { useEffect } from 'react';
import { supabaseClient } from '../lib/supabase';

interface AuthCallbackProps {
  onSuccess: (user: any) => void;
}

export default function AuthCallback({ onSuccess }: AuthCallbackProps) {
  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabaseClient) return;

      try {
        const { data, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          return;
        }

        if (data.session?.user) {
          const user = {
            id: data.session.user.id,
            email: data.session.user.email!,
            name: data.session.user.user_metadata?.name || 'User',
            role: data.session.user.user_metadata?.role || 'driver',
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString()
          };

          localStorage.setItem('sky266_current_user', JSON.stringify(user));
          onSuccess(user);
        }
      } catch (error) {
        console.error('Auth callback failed:', error);
      }
    };

    // Handle auth state changes
    if (supabaseClient) {
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const user = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || 'User',
              role: session.user.user_metadata?.role || 'driver',
              created_at: new Date().toISOString(),
              last_active: new Date().toISOString()
            };

            localStorage.setItem('sky266_current_user', JSON.stringify(user));
            onSuccess(user);
          }
        }
      );

      handleAuthCallback();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [onSuccess]);

  return null;
}