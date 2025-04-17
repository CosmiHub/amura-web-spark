
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BarChart, BarChart3, Calendar, Edit, FilePlus, History, Key, LayoutDashboard, ListChecks, LogOut, Plus, Settings, Upload, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Admin Dashboard Components (simplified)
const DashboardStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card>
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-amura-purple-light">
          <Users className="h-6 w-6 text-amura-purple" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">254</h3>
          <p className="text-xs text-green-600">+12% from last month</p>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-amura-purple-light">
          <Calendar className="h-6 w-6 text-amura-purple" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Events</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4</h3>
          <p className="text-xs text-gray-500">2 scheduled this week</p>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-amura-purple-light">
          <Award className="h-6 w-6 text-amura-purple" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificates Issued</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">132</h3>
          <p className="text-xs text-gray-500">28 this month</p>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-amura-purple-light">
          <ListChecks className="h-6 w-6 text-amura-purple" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Event Registrations</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">72</h3>
          <p className="text-xs text-green-600">+18% from last event</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Event Management Component
const EventManagement = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
      <Button variant="outline" className="flex items-center gap-2">
        <Plus size={16} /> Add New Event
      </Button>
    </div>
    
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-sm border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Registrations
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Web Development Workshop
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  April 25, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  28 / 50
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm" className="text-amura-purple">
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  AI & Machine Learning Hackathon
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  May 10, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  15 / 30
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm" className="text-amura-purple">
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Mobile App Development Series
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  May 15-16, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  12 / 40
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Planning
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm" className="text-amura-purple">
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// Certificate Management Component
const CertificateManagement = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Certificate Management</h3>
      <Button variant="outline" className="flex items-center gap-2">
        <Upload size={16} /> Upload Certificates
      </Button>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Recent Certificates</CardTitle>
        <CardDescription>Browse and manage certificates for events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Certificates
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Introduction to Cloud Computing
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      March 10, 2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      45 issued
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-amura-purple">
                        Manage
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Data Science Bootcamp
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      February 18, 2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      38 issued
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-amura-purple">
                        Manage
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Blockchain Technology Workshop
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      January 25, 2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      22 issued
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-amura-purple">
                        Manage
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// User Management Component
const UserManagement = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
      <Button variant="outline" className="flex items-center gap-2">
        <UserPlus size={16} /> Add User
      </Button>
    </div>
    
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-sm border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                      RS
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Rahul Sharma</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  rahul@amuratech.org
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Admin
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm" className="text-amura-purple">
                    <Key size={16} className="mr-1" /> Permissions
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                      PS
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Priya Singh</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  priya@amuratech.org
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Editor
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm" className="text-amura-purple">
                    <Key size={16} className="mr-1" /> Permissions
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                      AK
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Ajay Kumar</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  ajay@amuratech.org
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Editor
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" size="sm" className="text-amura-purple">
                    <Key size={16} className="mr-1" /> Permissions
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In a real app, this would handle authentication logout
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen sticky top-0 bg-white dark:bg-gray-800 shadow-md hidden md:block">
          <div className="p-6">
            <h2 className="text-xl font-bold text-amura-purple">AMURA Admin</h2>
          </div>
          
          <div className="mt-4">
            <nav className="px-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "overview"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard Overview
              </button>
              
              <button
                onClick={() => setActiveTab("events")}
                className={`w-full text-left flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "events"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Event Management
              </button>
              
              <button
                onClick={() => setActiveTab("certificates")}
                className={`w-full text-left flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "certificates"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Award className="mr-3 h-5 w-5" />
                Certificate Management
              </button>
              
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full text-left flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "users"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                User Management
              </button>
              
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full text-left flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "settings"
                    ? "bg-amura-purple text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </button>
              
              <div className="mt-8 px-4">
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with AMURA Technical Club.</p>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden mb-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="overview">
                  <LayoutDashboard className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="certificates">
                  <Award className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="users">
                  <Users className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Dashboard Content */}
          <div className="space-y-8">
            {activeTab === "overview" && (
              <>
                <DashboardStats />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Registration Trend</CardTitle>
                      <CardDescription>New registrations over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center">
                        <BarChart3 size={120} className="text-gray-300" />
                        <p className="text-sm text-gray-500">Chart visualization goes here</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activities</CardTitle>
                      <CardDescription>Latest actions and events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex">
                          <div className="mr-4">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <FilePlus size={14} className="text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">New event created</p>
                            <p className="text-xs text-gray-500">Mobile App Development Series</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-4">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <UserPlus size={14} className="text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">New registrations</p>
                            <p className="text-xs text-gray-500">8 new students registered</p>
                            <p className="text-xs text-gray-500">Today</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-4">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                              <Upload size={14} className="text-purple-600 dark:text-purple-400" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Certificates uploaded</p>
                            <p className="text-xs text-gray-500">22 certificates for Blockchain Workshop</p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="mr-4">
                            <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                              <History size={14} className="text-yellow-600 dark:text-yellow-400" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Event completed</p>
                            <p className="text-xs text-gray-500">Data Science Bootcamp</p>
                            <p className="text-xs text-gray-500">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            
            {activeTab === "events" && <EventManagement />}
            {activeTab === "certificates" && <CertificateManagement />}
            {activeTab === "users" && <UserManagement />}
            
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure your admin dashboard preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">Settings panel content would go here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
