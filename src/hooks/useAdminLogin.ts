
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

    // Try logging in with Supabase
    const { data: userExists, error: checkError } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (checkError) {
      // If login failed, maybe user doesn't exist; try to create account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (signUpError) {
        toast({
          title: "Login Failed",
          description: "Unable to authenticate. Please contact system administrator.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Set admin role if created
      if (data.user) {
        try {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: data.user.id, role: 'admin' });

          if (roleError) throw roleError;
        } catch (error) {
          console.error("Error setting admin role:", error);
        }

        toast({
          title: "Account Created",
          description: "Administrator account has been created and you are now logged in.",
        });
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } else if (userExists?.session?.user) {
      // User exists and login successful
      const userId = userExists.session.user.id;
      // Check if user already has admin role
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!rolesData) {
        // Add admin role if not already present
        try {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: 'admin' });

          if (roleError) throw roleError;
        } catch (error) {
          console.error("Error setting admin role:", error);
        }
      }
      toast({
        title: "Login Successful",
        description: "Redirecting to administrator dashboard.",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
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
