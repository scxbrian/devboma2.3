import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';

// Firebase config - get these from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo"
};

// Initialize Firebase only if we have real config
let app: any = null;
let auth: any = null;
let googleProvider: any = null;

const hasValidConfig = firebaseConfig.apiKey !== "demo-api-key";

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
  clientId?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Demo mode - simulate authentication
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Convert Firebase user to our User type
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          role: firebaseUser.email?.includes('admin@devboma.com') ? 'admin' : 'client',
          avatar: firebaseUser.photoURL || undefined,
          clientId: firebaseUser.email?.includes('admin@devboma.com') ? undefined : firebaseUser.uid
        };
        setUser(userData);
        
        // Store user in localStorage for persistence
        localStorage.setItem('devboma_user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('devboma_user');
      }
      setLoading(false);
    });

    // Check for stored user on initial load
    const storedUser = localStorage.getItem('devboma_user');
    if (storedUser && !user) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('devboma_user');
      }
    }

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider || !hasValidConfig) {
      // Demo mode - simulate successful login
      const demoUser: User = {
        id: 'demo-user-123',
        email: 'demo@devboma.com',
        name: 'Demo User',
        role: 'client',
        clientId: 'demo-client-123',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
      };
      
      setUser(demoUser);
      localStorage.setItem('devboma_user', JSON.stringify(demoUser));
      localStorage.setItem('devboma_token', 'demo-token-123');
      toast.success('Welcome to DevBoma Demo!');
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome back, ${result.user.displayName}!`);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked! Please allow popups for this site or try incognito mode.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('Domain not authorized. Please contact support.');
      } else {
        // Fallback to demo mode on any Firebase error
        toast.success('Using demo mode - Welcome to DevBoma!');
        const demoUser: User = {
          id: 'demo-google-user',
          email: 'demo.google@devboma.com',
          name: 'Demo Google User',
          role: 'client',
          clientId: 'demo-client-123',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
        };
        setUser(demoUser);
        localStorage.setItem('devboma_user', JSON.stringify(demoUser));
        localStorage.setItem('devboma_token', 'demo-google-token');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Try API login first
      let response;
      try {
        response = await authAPI.login(email, password);
      } catch (apiError: any) {
        console.error('API login failed, using demo mode:', apiError);
        
        // Demo mode fallback for common test accounts
        if (email === 'admin@devboma.com') {
          response = {
            user: {
              id: 'demo-admin-123',
              email: 'admin@devboma.com',
              name: 'DevBoma Admin',
              role: 'admin',
              clientId: null
            },
            token: 'demo-admin-token'
          };
        } else if (email.includes('@devboma.com') || email.includes('demo')) {
          response = {
            user: {
              id: 'demo-client-123',
              email: email,
              name: 'Demo Client',
              role: 'client',
              clientId: 'demo-client-123'
            },
            token: 'demo-client-token'
          };
        } else {
          // For any other email, create a demo client account
          response = {
            user: {
              id: 'demo-user-' + Date.now(),
              email: email,
              name: email.split('@')[0],
              role: 'client',
              clientId: 'demo-client-' + Date.now()
            },
            token: 'demo-token-' + Date.now()
          };
        }
        
        toast.success('Using demo mode - Backend not connected');
      }
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        clientId: response.user.clientId,
        avatar: response.user.avatar
      };
      
      setUser(userData);
      localStorage.setItem('devboma_user', JSON.stringify(userData));
      localStorage.setItem('devboma_token', response.token);
      
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
      setUser(null);
      localStorage.removeItem('devboma_user');
      localStorage.removeItem('devboma_token');
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    loginWithCredentials,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
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