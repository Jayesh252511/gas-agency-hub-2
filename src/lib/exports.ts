import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export interface CompanyBranding {
  companyName?: string;
  subTitle?: string;
  phone?: string;
  email?: string;
  logoUrl?: string | null;
}

const DEFAULT_BRANDING: CompanyBranding = {
  companyName: "LPG AGENCY ERP",
  subTitle: "AUTHORIZED LPG DISTRIBUTORSHIP PLATFORM",
  phone: "+91 8605601801",
  email: "jayeshneo07@gmail.com",
};

/**
 * Draws a sharp vector flame logo badge at top-left of the PDF document
 */
function drawCompanyLogoBadge(doc: any, x: number, y: number) {
  // Orange emblem square background
  doc.setFillColor(255, 122, 0); // #FF7A00
  doc.roundedRect(x, y, 12, 12, 2.5, 2.5, "F");

  // Flame inner icon vector shape
  doc.setFillColor(255, 255, 255);
  doc.circle(x + 6, y + 7.5, 2.8, "F");

  doc.setFillColor(255, 122, 0);
  doc.circle(x + 6, y + 6.8, 1.8, "F");

  doc.setFillColor(255, 179, 71); // Amber flame center
  doc.circle(x + 6, y + 7.8, 1.0, "F");
}

export function exportToExcel(
  data: any[],
  fileName: string,
  sheetName = "Sheet1",
  branding: CompanyBranding = DEFAULT_BRANDING
) {
  const company = branding.companyName || DEFAULT_BRANDING.companyName;
  const sub = branding.subTitle || DEFAULT_BRANDING.subTitle;
  const timestamp = `${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString("en-IN")}`;

  // Build professional header block
  const headerRows = [
    [company],
    [sub],
    [`REPORT: ${fileName.toUpperCase().replace(/_/g, " ")} | GENERATED: ${timestamp}`],
    [], // Blank separator line
  ];

  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, headerRows, { origin: "A1" });
  XLSX.utils.sheet_add_json(worksheet, data, { origin: "A5" });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-fit column widths
  const maxProps = data.reduce((acc, row) => {
    Object.keys(row).forEach((key) => {
      const val = row[key] ? String(row[key]) : "";
      acc[key] = Math.max(acc[key] || 0, val.length, key.length);
    });
    return acc;
  }, {} as Record<string, number>);

  worksheet["!cols"] = Object.keys(maxProps).map((key) => ({
    wch: Math.min(Math.max(maxProps[key] + 2, 10), 45),
  }));

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToPDF(
  title: string,
  headers: string[],
  rows: any[][],
  fileName: string,
  branding: CompanyBranding = DEFAULT_BRANDING
) {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const company = branding.companyName || DEFAULT_BRANDING.companyName;
  const sub = branding.subTitle || DEFAULT_BRANDING.subTitle;
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  // 1. Draw Company Logo (Custom uploaded logo or vector emblem fallback)
  let logoDrawn = false;
  if (branding.logoUrl) {
    try {
      const format = branding.logoUrl.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(branding.logoUrl, format, 14, 10, 13, 13);
      logoDrawn = true;
    } catch (e) {
      try {
        doc.addImage(branding.logoUrl, "PNG", 14, 10, 13, 13);
        logoDrawn = true;
      } catch (e2) {}
    }
  }

  if (!logoDrawn) {
    drawCompanyLogoBadge(doc, 14, 11);
  }

  // 2. Company Title & Subtitle (Left Header block next to logo)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Dark slate #0F172A
  doc.text(company!, 30, 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 122, 0); // Orange accent #FF7A00
  doc.text(sub!, 30, 22);

  // 3. Right Header Metadata block (Right aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), pageWidth - 14, 16, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${dateStr}  |  Time: ${timeStr}`, pageWidth - 14, 22, { align: "right" });

  // 4. Header Separator Line (Crisp double border line)
  doc.setDrawColor(255, 122, 0);
  doc.setLineWidth(0.75);
  doc.line(14, 26, pageWidth - 14, 26);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(14, 27.2, pageWidth - 14, 27.2);

  // 5. Table Rendering with autotable
  doc.autoTable({
    startY: 31,
    head: [headers],
    body: rows,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42], // Deep Dark Slate #0F172A
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3.5,
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didDrawPage: () => {
      // Professional Footer on every page
      const pageNum = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);

      // Bottom border line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

      doc.text(`${company} — Official Distributorship Record | Confidential`, 14, pageHeight - 8);
      doc.text(`Page ${pageNum}`, pageWidth - 14, pageHeight - 8, { align: "right" });
    },
  });

  doc.save(`${fileName}.pdf`);
}
