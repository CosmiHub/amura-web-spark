
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { supabase } from "@/integrations/supabase/client";

// Handles auto-redirect if a user is already an admin
export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user) {
        // Check if user is admin
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (rolesData?.role === "admin") {
          navigate("/dashboard");
        }
      }
    }
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });
    return () => { listener?.subscription?.unsubscribe(); };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access restricted to AMURA administrators only
          </p>
        </div>
        <AdminLoginForm />
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Forgot your password? Please contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
