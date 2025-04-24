
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AdminUser {
  email: string;
  username: string;
  isAdmin: boolean;
  id: string; // Make sure id is always defined
}

interface AuthContextProps {
  session: Session | null;
  user: User | AdminUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin user in localStorage first
    const adminUserStr = localStorage.getItem("adminUser");
    if (adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr) as AdminUser;
        setUser(adminUser);
        setLoading(false);
        return;
      } catch (error) {
        // If parsing fails, continue with regular auth
        localStorage.removeItem("adminUser");
      }
    }
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    // Check if we have an admin user stored
    const adminUserStr = localStorage.getItem("adminUser");
    if (adminUserStr) {
      localStorage.removeItem("adminUser");
      setUser(null);
      return;
    }
    
    // Otherwise sign out from Supabase
    await supabase.auth.signOut();
  };

  const isAdmin = (): boolean => {
    if (!user) return false;
    
    // Admin user from localStorage has isAdmin flag
    if ('isAdmin' in user) {
      return user.isAdmin;
    }
    
    // For future use, could check Supabase roles if needed
    return false;
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
