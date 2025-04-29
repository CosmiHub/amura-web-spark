
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CertificateCard } from "@/components/CertificateCard";
import { Certificate } from "@/types/certificate";
import { toast } from "@/components/ui/use-toast";

export default function CertificatePage() {
  const [usn, setUsn] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const { data: certificates, refetch, isLoading, isError } = useQuery({
    queryKey: ['certificates', usn],
    queryFn: async () => {
      try {
        console.log("Searching for certificates with USN:", usn);
        
        // Check if any certificates exist for this USN
        const { data: existingCerts, error: certsError } = await supabase
          .from('certificates')
          .select(`
            id,
            student_name,
            usn,
            certificate_url,
            issued_at,
            event_id,
            events (
              title,
              date
            )
          `)
          .eq('usn', usn);

        if (certsError) {
          console.error("Error fetching certificates:", certsError);
          throw new Error("Failed to fetch certificates");
        }

        console.log("Existing certificates found:", existingCerts?.length || 0);

        // If certificates exist, return them
        if (existingCerts && existingCerts.length > 0) {
          return existingCerts.map(cert => ({
            id: cert.id,
            eventName: cert.events?.title || "Unknown Event",
            date: new Date(cert.events?.date || cert.issued_at).toLocaleDateString(),
            studentName: cert.student_name,
            usn: cert.usn,
            certificateUrl: cert.certificate_url
          }));
        }

        // If no certificates exist, check if user has registrations and generate certificates
        const { data: registrations, error: regError } = await supabase
          .from('registrations')
          .select(`
            id,
            name, 
            usn,
            event_id,
            events (
              id,
              title,
              date,
              status
            )
          `)
          .eq('usn', usn);

        if (regError) {
          console.error("Error fetching registrations:", regError);
          throw new Error("Failed to fetch registrations");
        }

        console.log("Registrations found:", registrations?.length || 0);

        // If no registrations, return empty array
        if (!registrations || registrations.length === 0) {
          return [];
        }

        // For each registration for completed events, create a certificate if one doesn't exist
        const newCertificates: Certificate[] = [];

        for (const reg of registrations) {
          // Only create certificates for completed events
          if (reg.events?.status !== 'completed') {
            console.log(`Skipping certificate creation for event ${reg.events?.title} as status is ${reg.events?.status}`);
            continue;
          }

          // Generate a unique certificate ID
          const certificateId = crypto.randomUUID();
          const certificateUrl = `certificate-${certificateId}.pdf`;

          console.log(`Creating certificate for ${reg.name} for event ${reg.events.title}`);

          // Insert the certificate
          const { data: newCert, error: insertError } = await supabase
            .from('certificates')
            .insert({
              student_name: reg.name,
              usn: reg.usn,
              event_id: reg.event_id,
              certificate_url: certificateUrl,
              issued_at: new Date().toISOString()
            })
            .select('*, events(title, date)')
            .single();

          if (insertError) {
            console.error("Error creating certificate:", insertError);
            continue;
          }

          // Add to our list of certificates to return
          newCertificates.push({
            id: newCert.id,
            eventName: newCert.events?.title || "Unknown Event",
            date: new Date(newCert.events?.date || newCert.issued_at).toLocaleDateString(),
            studentName: newCert.student_name,
            usn: newCert.usn,
            certificateUrl: newCert.certificate_url
          });
        }

        return newCertificates;
      } catch (error) {
        console.error("Error in certificate query:", error);
        throw error;
      }
    },
    enabled: false,
    retry: 1
  });

  const handleSearch = () => {
    if (!usn) return;
    setSearchPerformed(true);
    refetch().then(() => {
      console.log("Certificate search completed");
    }).catch(error => {
      console.error("Certificate search failed:", error);
      toast({
        title: "Error",
        description: "Failed to fetch certificates. Please try again.",
        variant: "destructive"
      });
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Certificate Download
          </h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Enter your University Seat Number (USN) to download certificates for events and workshops you've attended.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="usn">University Seat Number (USN)</Label>
                    <Input 
                      id="usn"
                      placeholder="e.g., 1AB21CS045"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleSearch}
                      className="btn-primary w-full md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" /> Searching...
                        </>
                      ) : (
                        <>
                          <Search size={18} className="mr-2" /> Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {searchPerformed && (
                  <div className="space-y-4 mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Search Results
                    </h3>
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Loading certificates...</span>
                      </div>
                    ) : isError ? (
                      <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-lg shadow-card animate-fade-in">
                        <div className="text-red-500 text-lg font-medium">
                          Error loading certificates
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Please try again or contact support if the problem persists.
                        </p>
                      </div>
                    ) : certificates && certificates.length > 0 ? (
                      <div className="space-y-4">
                        {certificates.map((cert) => (
                          <CertificateCard key={cert.id} certificate={cert} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-lg shadow-card animate-fade-in">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">
                          No certificates found for USN: <span className="font-semibold">{usn}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Please check your USN and try again, or contact support if you believe this is an error.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">I can't find my certificate</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Certificates are typically available 7-10 days after the event. If it's been longer, please contact us.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">My name is incorrect on the certificate</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Please email us at certificates@amuratech.org with your correct details for a replacement.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Can I get a physical copy?</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  We provide digital certificates only, but you can print a high-quality version from the PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
