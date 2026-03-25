import { jsPDF } from "jspdf/dist/jspdf.es.min.js";
import { CONTACT_INFO } from "../constants";

export const svgToDataUrl = (svgString: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, 64, 64);
        resolve(canvas.toDataURL("image/png"));
      } else {
        resolve("");
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgString);
  });
};

export const settingsSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

export const phoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;

export const mailSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`;

export const applyPdfBranding = async (doc: jsPDF, title: string) => {
  const companyName = CONTACT_INFO.companyName;
  
  // Header
  const logoDataUrl = await svgToDataUrl(settingsSvg);
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 14, 15, 10, 10);
  }
  
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFont("helvetica", "bold");
  doc.text(companyName, 28, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.text(`${title} (bmimachinery.com)`, 28, 30);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 28, 37);
  
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(14, 42, 196, 42);
};

export const applyPdfFooter = async (doc: jsPDF, machineName?: string) => {
  const pageCount = (doc as any).internal.getNumberOfPages();
  
  const phoneDataUrl = await svgToDataUrl(phoneSvg);
  const mailDataUrl = await svgToDataUrl(mailSvg);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    
    // Prominent Contact Block
    doc.setFillColor(30, 41, 59); // slate-800
    doc.roundedRect(14, pageHeight - 45, pageWidth - 28, 30, 3, 3, 'F');
    
    // Phone Section
    if (phoneDataUrl) {
      doc.addImage(phoneDataUrl, 'PNG', 20, pageHeight - 38, 6, 6);
    }
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Call Us:", 28, pageHeight - 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.textWithLink(CONTACT_INFO.phones[0], 28, pageHeight - 28, { url: CONTACT_INFO.whatsappLink });
    doc.textWithLink(CONTACT_INFO.phones[1], 28, pageHeight - 23, { url: "tel:+4915679748887" });
    
    // Email Section
    if (mailDataUrl) {
      doc.addImage(mailDataUrl, 'PNG', pageWidth / 2, pageHeight - 38, 6, 6);
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Email Us:", pageWidth / 2 + 8, pageHeight - 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const subject = machineName ? `?subject=Inquiry%20about%20${encodeURIComponent(machineName)}` : '?subject=Inquiry%20from%20Catalogue';
    doc.textWithLink(CONTACT_INFO.emails[0], pageWidth / 2 + 8, pageHeight - 28, { url: `mailto:${CONTACT_INFO.emails[0]}${subject}` });
    doc.textWithLink(CONTACT_INFO.emails[1], pageWidth / 2 + 8, pageHeight - 23, { url: `mailto:${CONTACT_INFO.emails[1]}${subject}` });
    
    // Page Number
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 5);
  }
};

export const writeTextWithPageBreaks = async (
  doc: jsPDF,
  text: string | string[],
  x: number,
  startY: number,
  lineHeight: number,
  title: string
): Promise<number> => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 55; // 45 for footer + 10 padding
  let currentY = startY;

  // If text is an array, join it with spaces or newlines depending on original intent.
  // Actually, if it's already split by splitTextToSize, it might be better to just print it.
  // But since splitTextToSize is causing issues, let's let doc.text handle the wrapping.
  // Wait, if we change the signature, we might break things.
  // Let's just iterate over the lines, but use doc.text with maxWidth.
  
  const lines = Array.isArray(text) ? text : [text];

  for (const line of lines) {
    if (currentY > pageHeight - bottomMargin) {
      doc.addPage();
      await applyPdfBranding(doc, title);
      currentY = 55; // start below header
    }
    
    // Use doc.text with maxWidth to ensure it never overflows
    doc.text(line, x, currentY, { maxWidth: 180 });
    
    // Calculate how much height this line actually took
    const dims = doc.getTextDimensions(line, { maxWidth: 180 });
    currentY += Math.max(dims.h, lineHeight);
  }

  return currentY;
};
