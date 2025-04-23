
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Lock, LogIn } from "lucide-react";
import { useAdminLogin } from "@/hooks/useAdminLogin";

export function AdminLoginForm() {
  const { credentials, errors, loading, handleChange, handleSubmit } = useAdminLogin();

  return (
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
      <Toaster />
    </Card>
  );
}
