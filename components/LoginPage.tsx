import React from 'react';
import { supabase } from '../services/supabaseClient';
import { ShieldCheckIcon } from './IconComponents';

const LoginPage: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error logging in:', error.message);
      setError('Failed to log in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md text-center animate-fade-in">
        <div className="flex items-center justify-center mb-6">
            <ShieldCheckIcon className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold ml-3 text-gray-800">CyberGuard AI</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Sign in to access your security dashboard.</p>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
              <path fill="#FF3D00" d="M6.306 14.691L11.961 18.235C13.248 14.331 16.275 12 20 12c1.865 0 3.593 0.601 5.021 1.639l5.657-5.657C28.253 6.643 24.32 6 20 6C13.438 6 7.892 9.615 6.306 14.691z"></path>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
              <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-0.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.853 44 30.222 44 24c0-1.341-0.138-2.65-0.389-3.917z"></path>
            </svg>
          )}
          {loading ? 'Redirecting...' : 'Sign In with Google'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
