
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
    const { data: userExists, error: loginError } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (loginError) {
      toast({
        title: "Login Failed",
        description: "Unable to authenticate. Please contact system administrator.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Check admin role
    if (userExists?.session?.user) {
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userExists.session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!rolesData) {
        toast({
          title: "Access Denied",
          description: "You do not have administrator privileges.",
          variant: "destructive"
        });
        await supabase.auth.signOut();
        setLoading(false);
        return;
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
