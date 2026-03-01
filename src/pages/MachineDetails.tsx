import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Markdown from "react-markdown";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  PhoneCall,
  ShieldCheck,
  Truck,
  Wrench,
  Loader2,
} from "lucide-react";
import { jsPDF } from "jspdf/dist/jspdf.es.min.js";
import autoTable from "jspdf-autotable";
import { CONTACT_INFO } from "../constants";

interface Machine {
  id: number;
  name: string;
  category: string;
  image_urls: string[];
  short_description: string;
  specifications_md: string;
}

export default function MachineDetails() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await fetch(`/api/machines/${idOrSlug}`);
        if (res.ok) {
          const data = await res.json();
          setMachine(data);
        } else {
          setMachine(null);
        }
      } catch (error) {
        console.error("Failed to fetch machine:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [idOrSlug]);

  const downloadBrochure = async () => {
    if (!machine) return;
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const companyName = CONTACT_INFO.companyName;
      
      const addFooter = (pdf: jsPDF) => {
        const pageCount = (pdf as any).internal.getNumberOfPages();
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          const footerText = `${CONTACT_INFO.address} | ${CONTACT_INFO.phone} | ${CONTACT_INFO.email}`;
          const pageSize = pdf.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          
          pdf.setDrawColor(226, 232, 240);
          pdf.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
          
          const textWidth = pdf.getTextWidth(footerText);
          pdf.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
          pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
        }
      };

      // Header
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59);
      doc.text(companyName, 14, 22);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text("Product Brochure", 14, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 37);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 42, 196, 42);

      // Title
      doc.setFontSize(24);
      doc.setTextColor(30, 41, 59);
      doc.text(machine.name, 14, 55);
      
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text(`Category: ${machine.category}`, 14, 65);

      // Main Image
      if (machine.image_urls && machine.image_urls.length > 0) {
        try {
          const imgUrl = machine.image_urls[0].startsWith('http') 
            ? machine.image_urls[0] 
            : `${window.location.origin}${machine.image_urls[0]}`;
          
          const img = new Image();
          img.crossOrigin = "Anonymous";
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imgUrl;
          });
          
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
            doc.addImage(dataUrl, "JPEG", 14, 75, 180, 100);
          }
        } catch (e) {
          console.error("Error adding image to PDF:", e);
        }
      }

      // Description
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text("Overview", 14, 185);
      
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      const splitDescription = doc.splitTextToSize(machine.short_description, 180);
      doc.text(splitDescription, 14, 192);

      // Specifications on new page
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.text("Technical Specifications", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const specs = machine.specifications_md.replace(/#/g, '').replace(/\*/g, '');
      const splitSpecs = doc.splitTextToSize(specs, 180);
      doc.text(splitSpecs, 14, 32);

      addFooter(doc);
      doc.save(`${machine.name.replace(/\s+/g, '_')}_Brochure.pdf`);
    } catch (error) {
      console.error("Brochure generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const nextImage = () => {
    if (machine) {
      setCurrentImageIndex((prev) => (prev + 1) % machine.image_urls.length);
    }
  };

  const prevImage = () => {
    if (machine) {
      setCurrentImageIndex((prev) => (prev - 1 + machine.image_urls.length) % machine.image_urls.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Machine Not Found
        </h2>
        <p className="text-slate-600 mb-8">
          The machine you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/catalogue"
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/catalogue"
          className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalogue
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section with Carousel */}
            <div className="relative aspect-video lg:aspect-auto lg:h-[500px] bg-slate-100 group overflow-hidden">
              <img
                src={machine.image_urls[currentImageIndex]}
                alt={`${machine.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              
              {machine.image_urls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6 text-slate-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6 text-slate-900" />
                  </button>
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {machine.image_urls.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === currentImageIndex ? "bg-blue-600 w-6" : "bg-white/60 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-slate-700 shadow-sm">
                {machine.category}
              </div>
            </div>

            {/* Quick Info Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                {machine.name}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {machine.short_description}
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-slate-700">
                  <Truck className="h-5 w-5 text-blue-500 shrink-0" />
                  <span className="font-medium">
                    Import & Shipping handled by BMI
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Wrench className="h-5 w-5 text-blue-500 shrink-0" />
                  <span className="font-medium">
                    Installation & Training included
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0" />
                  <span className="font-medium">
                    1 Year Comprehensive Warranty
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <PhoneCall className="mr-2 h-5 w-5" />
                  Request Quote
                </Link>
                <button 
                  onClick={downloadBrochure}
                  disabled={downloading}
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-70"
                >
                  {downloading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-5 w-5" />
                  )}
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 lg:p-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
            Technical Specifications
          </h2>

          <div className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-li:marker:text-blue-500">
            <Markdown>{machine.specifications_md}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}
