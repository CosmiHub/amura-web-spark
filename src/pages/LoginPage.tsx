
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  
  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would call an API to authenticate
      // For demo purposes, we'll just navigate to the dashboard if email ends with admin
      if (credentials.email.endsWith('@admin.org')) {
        // Mock successful login
        toast({
          title: "Login Successful",
          description: "Redirecting to administrator dashboard.",
        });
        
        // Simulate a short delay for the toast to be visible
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast({
          title: "Access Denied",
          description: "Only administrators can access this area.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
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
            <CardDescription>Please sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@amuratech.org"
                  value={credentials.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
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
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full btn-primary" onClick={handleSubmit}>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Forgot your password? Please contact the system administrator.
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
