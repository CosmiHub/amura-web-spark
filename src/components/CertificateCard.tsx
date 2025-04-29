
import { Certificate } from "@/types/certificate";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";
import { generateCertificatePDF } from "@/utils/certificateUtils";
import { toast } from "@/components/ui/use-toast";

interface CertificateCardProps {
  certificate: Certificate;
}

export const CertificateCard = ({ certificate }: CertificateCardProps) => {
  const handleDownload = () => {
    try {
      const doc = generateCertificatePDF(certificate);
      doc.save(`${certificate.eventName}-certificate.pdf`);
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast({
        title: "Error",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
      <div className="flex-1">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-amura-purple mr-2" />
          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
            {certificate.eventName}
          </h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{certificate.date}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          Awarded to: <span className="font-medium">{certificate.studentName}</span>
        </p>
      </div>
      <Button onClick={handleDownload} className="btn-primary">
        <Download size={18} className="mr-2" /> Download Certificate
      </Button>
    </div>
  );
};
