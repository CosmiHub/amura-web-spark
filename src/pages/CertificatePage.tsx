
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Download, Award } from "lucide-react";

type Certificate = {
  id: string;
  eventName: string;
  date: string;
  studentName: string;
  usn: string;
  certificateUrl: string;
};

// Mock certificates data
const mockCertificates: Certificate[] = [
  {
    id: "cert-001",
    eventName: "Introduction to Cloud Computing",
    date: "March 10, 2025",
    studentName: "John Doe",
    usn: "1AB21CS045",
    certificateUrl: "#"
  },
  {
    id: "cert-002",
    eventName: "Data Science Bootcamp",
    date: "February 18, 2025",
    studentName: "Jane Smith",
    usn: "1AB21CS045",
    certificateUrl: "#"
  },
  {
    id: "cert-003",
    eventName: "Blockchain Technology Workshop",
    date: "January 25, 2025",
    studentName: "John Doe",
    usn: "1AB21CS045",
    certificateUrl: "#"
  }
];

export default function CertificatePage() {
  const [usn, setUsn] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [results, setResults] = useState<Certificate[]>([]);
  
  const handleSearch = () => {
    if (!usn) return;
    
    // In a real application, this would call an API to fetch certificates
    const filteredCertificates = mockCertificates.filter(
      cert => cert.usn.toLowerCase() === usn.toLowerCase()
    );
    
    setResults(filteredCertificates);
    setSearchPerformed(true);
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Certificate Download</h1>
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
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleSearch}
                      className="btn-primary w-full md:w-auto"
                    >
                      <Search size={18} className="mr-2" /> Search
                    </Button>
                  </div>
                </div>
                
                {searchPerformed && (
                  <div className="space-y-4 mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Search Results
                    </h3>
                    
                    {results.length > 0 ? (
                      <div className="space-y-4">
                        {results.map((cert) => (
                          <div key={cert.id} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <Award className="h-5 w-5 text-amura-purple mr-2" />
                                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                                  {cert.eventName}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{cert.date}</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                Awarded to: <span className="font-medium">{cert.studentName}</span>
                              </p>
                            </div>
                            <Button className="btn-primary">
                              <Download size={18} className="mr-2" /> Download Certificate
                            </Button>
                          </div>
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
