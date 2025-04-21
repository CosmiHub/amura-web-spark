
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    if (mode === "register") {
      if (!confirmPassword) {
        newErrors.password = "Please confirm your password";
        valid = false;
      } else if (credentials.password !== confirmPassword) {
        newErrors.password = "Passwords do not match";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm() || loading) return;
    setLoading(true);

    if (mode === "login") {
      // --- LOGIN FLOW ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (error || !data.session?.user) {
        toast({
          title: "Login Failed",
          description: error ? error.message : "Unable to sign in.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const userId = data.session.user.id;
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (rolesData?.role === "admin") {
        toast({
          title: "Login Successful",
          description: "Redirecting to administrator dashboard.",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "Only administrators can access this area.",
          variant: "destructive"
        });
      }
      setLoading(false);
    } else {
      // --- REGISTER FLOW ---
      try {
        // First create the user with auto confirm enabled
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email.trim(),
          password: credentials.password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });

        if (error || !data.user) {
          throw error || new Error("Unable to register user");
        }

        // If user is created successfully, create the admin role directly
        // We'll use the service role function to insert the role since the user might not be confirmed yet
        const userId = data.user.id;
        
        // Insert directly using the public API
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{ user_id: userId, role: "admin" }]);
        
        if (roleError) {
          console.error("Role assignment failed:", roleError);
          throw new Error("Failed to assign admin role. Please contact system administrator.");
        }

        toast({
          title: "Registration Successful!",
          description: "Admin account created. Please check your email for confirmation link, then sign in.",
        });
        
        setLoading(false);
        setMode("login");
        setCredentials({ email: credentials.email.trim(), password: "" });
        setConfirmPassword("");
      } catch (error: any) {
        toast({
          title: "Sign Up Failed",
          description: error?.message || "Unable to register user.",
          variant: "destructive"
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {mode === "login" ? "Admin Login" : "Admin Registration"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mode === "login"
              ? "Access restricted to AMURA administrators only"
              : "Register a new admin account"}
          </p>
        </div>
        <Card className="shadow-lg animate-fade-in">
          <CardHeader className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amura-purple-light flex items-center justify-center mb-4">
              {mode === "login" ? (
                <Lock className="h-8 w-8 text-amura-purple" />
              ) : (
                <UserPlus className="h-8 w-8 text-amura-purple" />
              )}
            </div>
            <CardTitle>{mode === "login" ? "Administrator Access" : "Create Admin Account"}</CardTitle>
            <CardDescription>
              {mode === "login" ? "Please sign in to continue" : "Fill in the details below"}
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
                  placeholder={mode === "login" ? "admin@amuratech.org" : "Enter email"}
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
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  disabled={loading}
                />
                {mode === "register" && (
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={errors.password ? "border-red-500 mt-2" : "mt-2"}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                )}
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="animate-spin mr-2">⏳</span>
              ) : mode === "login" ? (
                <LogIn className="mr-2 h-4 w-4" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {mode === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </CardFooter>
        </Card>
        <div className="text-center">
          <Button type="button" variant="link" className="text-amura-purple" onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setErrors({ email: "", password: "" });
          }}>
            {mode === "login" ? "Don't have an account? Register as admin" : "Already an admin? Sign In"}
          </Button>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {mode === "login"
              ? "Forgot your password? Please contact the system administrator."
              : "Note: Only use this form for initial admin setup."}
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
