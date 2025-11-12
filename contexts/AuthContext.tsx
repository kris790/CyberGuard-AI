import { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';

export const AuthContext = createContext<{ session: Session | null }>({ session: null });

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
