
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ALLOWED_ADMINS } from "@/constants/admins";

type State = {
  email: string;
  password: string;
};

type ErrorState = {
  email: string;
  password: string;
};

export function useAdminLogin() {
  const [credentials, setCredentials] = useState<State>({ email: "", password: "" });
  const [errors, setErrors] = useState<ErrorState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!credentials.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim())) {
      newErrors.email = "Email format not valid";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm() || loading) return;
    setLoading(true);

    // Restrict login to allowed admins
    const foundAdmin = ALLOWED_ADMINS.find(
      (admin) => admin.email === credentials.email.trim() && admin.password === credentials.password
    );

    if (!foundAdmin) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials or not authorized.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    console.log("Admin found in allowed list:", foundAdmin.email);

    // Try logging in with Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        toast({
          title: "Login Failed",
          description: "Unable to authenticate. Please contact system administrator.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Check admin role
      if (data?.user) {
        console.log("User authenticated with Supabase:", data.user.id);
        
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (rolesError) {
          console.error("Error checking admin role:", rolesError);
        }

        console.log("Admin role check result:", rolesData);

        if (!rolesData) {
          // Try to add admin role
          const { error: insertError } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role: "admin" });
            
          if (insertError) {
            console.error("Error setting admin role:", insertError);
            toast({
              title: "Access Denied",
              description: "Failed to set administrator privileges.",
              variant: "destructive"
            });
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
        }

        toast({
          title: "Login Successful",
          description: "Redirecting to administrator dashboard.",
        });
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  return {
    credentials,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
}
