
import { FilePlus, UserPlus, Upload, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ActivityLog = () => (
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
        {/* Add more activity items as needed */}
      </div>
    </CardContent>
  </Card>
);
