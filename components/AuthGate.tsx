import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { AuthContext } from '../contexts/AuthContext';
import App from '../App';
import LoginPage from './LoginPage';

const AuthGate: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )
  }

  return (
    <AuthContext.Provider value={{ session }}>
      {session ? <App /> : <LoginPage />}
    </AuthContext.Provider>
  );
};

export default AuthGate;
