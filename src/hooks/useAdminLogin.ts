
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
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
    
    // Clear error when user starts typing
    if (errors[name as keyof ErrorState]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
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

    // Clear any previous admin session
    localStorage.removeItem("adminUser");

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

    try {
      // Store admin info in localStorage for session persistence
      const adminUser = {
        email: foundAdmin.email,
        username: foundAdmin.username,
        isAdmin: true,
        id: `admin-${Date.now()}` // Add unique ID to admin user
      };
      
      localStorage.setItem("adminUser", JSON.stringify(adminUser));
      
      toast({
        title: "Login Successful",
        description: "Redirecting to administrator dashboard.",
      });
      
      // Navigate to dashboard after a slight delay to show the toast
      setTimeout(() => navigate("/dashboard"), 500);
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
