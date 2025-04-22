
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Lock, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Hardcoded admin credentials
const ALLOWED_ADMINS = [
  {
    email: "uvcosmos2@gmail.com", 
    password: "123Sumit_",
    username: "Sumit Raj"
  },
  {
    email: "srsaini2004@gmail.com", 
    password: "123Saini_",
    username: "Saini"
  },
  {
    email: "sumitraj23aiml@rnsit.ac.in", 
    password: "123Sumitraj_",
    username: "Sumit"
  }
];

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user) {
        // Check if user is admin
        const { data: rolesData, error } = await supabase
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
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

    // Restrict login to specific admin emails
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

    // Check if user exists in Supabase
    const { data: userExists, error: checkError } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (checkError) {
      // If login failed, the user might not exist - try to create account
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

      // If successfully created account, set admin role
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
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
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
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
    
    setLoading(false);
  };

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
        <Card className="shadow-lg animate-fade-in">
          <CardHeader className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amura-purple-light flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-amura-purple" />
            </div>
            <CardTitle>Administrator Access</CardTitle>
            <CardDescription>
              Please sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={credentials.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                  autoComplete="email"
                  disabled={loading}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                  autoComplete="current-password"
                  disabled={loading}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              <Button className="w-full btn-primary mt-6" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            {/* Nothing here for now */}
          </CardFooter>
        </Card>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Forgot your password? Please contact the system administrator.
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
