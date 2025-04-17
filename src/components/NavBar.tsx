
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  name: string;
  path: string;
  adminOnly?: boolean;
};

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  // Mock authentication - in a real app you would have proper authentication
  const [isAdmin] = useState(false);

  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Events & Workshops", path: "/events" },
    { name: "Register", path: "/register" },
    { name: "Certificate Download", path: "/certificates" },
    { name: "Achievements", path: "/achievements" },
    { name: "About Us", path: "/about" },
    { name: "Login", path: "/login", adminOnly: false }, // Set to true to hide when admin is logged in
    { name: "Dashboard", path: "/dashboard", adminOnly: true }
  ];

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-white dark:bg-gray-900 shadow-md glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-amura-purple">AMURA</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              if (!item.adminOnly || (item.adminOnly && isAdmin)) {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? "text-amura-purple border-b-2 border-amura-purple"
                        : "text-gray-700 dark:text-gray-300 hover:text-amura-purple dark:hover:text-amura-purple"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }
              return null;
            })}
            <div className="pl-4">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={toggleNav}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-amura-purple hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              if (!item.adminOnly || (item.adminOnly && isAdmin)) {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
                        ? "text-amura-purple bg-amura-purple-light"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
