
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { departments, years } from "../register/constants";

type Registration = {
  id: string;
  name: string;
  email: string;
  usn: string;
  department: string;
  year: string;
  event_id: string;
  created_at: string;
  event?: {
    title: string;
  } | null;
};

export const UserManagement = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      // Fetch registrations with event details
      const { data, error } = await supabase
        .from("registrations")
        .select(`
          *,
          event:event_id (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      console.log("Registrations fetched:", data);
      setRegistrations(data || []);
    } catch (error: any) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Failed to Load Registrations",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const getDepartmentName = (code: string) => {
    return departments.find(dept => dept === code) || code;
  };

  const getYearName = (code: string) => {
    return years.find(year => year === code) || code;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Registered Users</h3>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>USN</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading registrations...</TableCell>
                  </TableRow>
                ) : registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">No registrations found.</TableCell>
                  </TableRow>
                ) : (
                  registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.name}</TableCell>
                      <TableCell>{registration.usn}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{getDepartmentName(registration.department)}</TableCell>
                      <TableCell>{getYearName(registration.year)}</TableCell>
                      <TableCell>{registration.event?.title || "Unknown Event"}</TableCell>
                      <TableCell>{formatDate(registration.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
