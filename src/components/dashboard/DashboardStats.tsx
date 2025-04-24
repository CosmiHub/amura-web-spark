
import { Users, Calendar, Award, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const DashboardStats = () => (
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
