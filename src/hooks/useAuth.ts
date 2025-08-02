import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is admin - use setTimeout to avoid blocking auth state changes
          setTimeout(async () => {
            try {
              console.log('Checking admin status for user:', session.user.id, session.user.email);
              
              const { data, error } = await supabase
                .from('user_roles' as any)
                .select('role')
                .eq('user_id', session.user.id)
                .eq('role', 'admin')
                .maybeSingle();
              
              console.log('Admin check result:', { data, error });
              
              if (error) {
                console.log('Admin check error:', error);
                setIsAdmin(false);
              } else {
                const isAdminUser = !!data;
                console.log('Setting isAdmin to:', isAdminUser);
                setIsAdmin(isAdminUser);
              }
            } catch (error) {
              console.log('Admin check failed:', error);
              setIsAdmin(false);
            }
          }, 100);
        } else {
          console.log('No session user, setting isAdmin to false');
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName
        }
      }
    });

    if (data.user && !error) {
      // Create profile
      await supabase
        .from('profiles' as any)
        .insert({
          user_id: data.user.id,
          display_name: displayName
        });
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut
  };
};