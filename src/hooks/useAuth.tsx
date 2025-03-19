import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isGuestMode: boolean;
  setGuestMode: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setGuestMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: 'Login gagal',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      navigate('/');
      toast({
        title: 'Login berhasil',
        description: 'Selamat datang kembali!',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        toast({
          title: 'Pendaftaran gagal',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      toast({
        title: 'Pendaftaran berhasil',
        description: 'Silakan cek email Anda untuk verifikasi.',
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth'
        }
      });
      
      if (error) {
        toast({
          title: 'Google login gagal',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setGuestMode(false);
      navigate('/auth');
      toast({
        title: 'Logout berhasil',
        description: 'Sampai jumpa kembali!',
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      signInWithGoogle,
      isGuestMode,
      setGuestMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, isGuestMode, setGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if coming from auth page with skipAuth flag
    if (location.state && location.state.skipAuth) {
      setGuestMode(true);
      // Clear the state so refreshing doesn't keep the skipAuth flag
      window.history.replaceState({}, document.title);
    } else if (!loading && !user && !isGuestMode) {
      navigate('/auth');
    }
  }, [user, loading, navigate, location, isGuestMode, setGuestMode]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  return (user || isGuestMode) ? <>{children}</> : null;
}
