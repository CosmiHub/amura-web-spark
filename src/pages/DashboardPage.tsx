
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { NavBar } from "@/components/NavBar";
import { toast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user exists
    if (!user) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Check if user has admin privileges
    if (!isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You don't have administrator privileges.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  }, [user, isAdmin, navigate]);

  // Don't render anything until we've checked permissions
  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {('username' in user) ? user.username : 'Administrator'}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is your administration dashboard. Here you can manage events, users, and site content.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Events Management</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage upcoming and past events, registrations, and certificates.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage user accounts, permissions, and access control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
