
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { departments, years } from "../register/constants";
import { Award, Check, Download, RefreshCw } from "lucide-react";
import { generateCertificatePDF } from "@/utils/certificateUtils";

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
  verified?: boolean;
};

export const UserManagement = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      // Check if each registration has a certificate
      if (data && data.length > 0) {
        const registrationsWithVerification = await Promise.all(
          data.map(async (registration) => {
            const { data: certificates } = await supabase
              .from("certificates")
              .select("*")
              .eq("usn", registration.usn)
              .eq("event_id", registration.event_id)
              .single();
            
            return { 
              ...registration, 
              verified: !!certificates 
            };
          })
        );
        
        setRegistrations(registrationsWithVerification);
      } else {
        setRegistrations([]);
        console.log("No registrations found in database");
      }
    } catch (error: any) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Failed to Load Registrations",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
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

  const handleVerifyUser = async (registration: Registration) => {
    try {
      // Generate a unique certificate ID
      const certificateId = crypto.randomUUID();
      const certificateUrl = `certificate-${certificateId}.pdf`;

      // Insert the certificate into the database
      const { data, error } = await supabase
        .from("certificates")
        .insert({
          student_name: registration.name,
          usn: registration.usn,
          event_id: registration.event_id,
          certificate_url: certificateUrl,
          issued_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      toast({
        title: "User Verified",
        description: `Certificate has been issued to ${registration.name}`,
      });

      // Refresh the data
      fetchRegistrations();
    } catch (error: any) {
      console.error("Error verifying user:", error);
      toast({
        title: "Verification Failed",
        description: "Could not verify user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCertificate = async (registration: Registration) => {
    try {
      // Get event details for certificate
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("title, date")
        .eq("id", registration.event_id)
        .single();

      if (eventError) throw eventError;

      // Generate and download certificate
      const certificate = {
        id: crypto.randomUUID(),
        eventName: eventData?.title || "Event",
        date: new Date(eventData?.date || new Date()).toLocaleDateString(),
        studentName: registration.name,
        usn: registration.usn,
        certificateUrl: null
      };

      const doc = generateCertificatePDF(certificate);
      doc.save(`${registration.name}-${eventData?.title}-certificate.pdf`);

      toast({
        title: "Certificate Downloaded",
        description: "The certificate has been downloaded successfully."
      });
    } catch (error: any) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Download Failed",
        description: "Could not download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRegistrations();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Registered Users</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">Loading registrations...</TableCell>
                  </TableRow>
                ) : registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">No registrations found. Users need to register for events first.</TableCell>
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
                      <TableCell>
                        {registration.verified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {!registration.verified ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVerifyUser(registration)}
                            className="text-green-600 border-green-600"
                          >
                            <Check className="w-4 h-4 mr-1" /> Verify
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadCertificate(registration)}
                            className="text-amura-purple"
                          >
                            <Download className="w-4 h-4 mr-1" /> Certificate
                          </Button>
                        )}
                      </TableCell>
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
