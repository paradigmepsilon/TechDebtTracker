import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TechDebtPDF } from "./tech-debt-pdf";
import { pdf } from '@react-pdf/renderer';
import { TechDebtItem } from "@shared/schema";

interface ExportPDFButtonProps {
  items: TechDebtItem[];
}

export function ExportPDFButton({ items }: ExportPDFButtonProps) {
  const handleExport = async () => {
    try {
      const blob = await pdf(<TechDebtPDF items={items} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tech-debt-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Export PDF
    </Button>
  );
}
