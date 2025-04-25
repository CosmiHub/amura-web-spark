
import { Certificate } from "@/types/certificate";
import { jsPDF } from "jspdf";

export const generateCertificatePDF = (certificate: Certificate) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  // Set background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 297, 210, "F");

  // Add border
  doc.setDrawColor(44, 62, 80);
  doc.setLineWidth(1);
  doc.rect(10, 10, 277, 190);

  // Add certificate title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(44, 62, 80);
  doc.text("Certificate of Completion", 148.5, 40, { align: "center" });

  // Add content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text("This is to certify that", 148.5, 70, { align: "center" });
  
  // Add name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(certificate.studentName, 148.5, 85, { align: "center" });

  // Add description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text("has successfully completed", 148.5, 100, { align: "center" });
  
  // Add event name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(certificate.eventName, 148.5, 115, { align: "center" });

  // Add date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`Issued on: ${certificate.date}`, 148.5, 140, { align: "center" });

  // Add USN
  doc.setFontSize(12);
  doc.text(`USN: ${certificate.usn}`, 148.5, 150, { align: "center" });

  return doc;
};
