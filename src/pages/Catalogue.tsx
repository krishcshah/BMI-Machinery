import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, ArrowRight, Download, FileText, Loader2, ChevronDown } from "lucide-react";
import { jsPDF } from "jspdf/dist/jspdf.es.min.js";
import autoTable from "jspdf-autotable";
import { CONTACT_INFO } from "../constants";
import { applyPdfBranding, applyPdfFooter, writeTextWithPageBreaks } from "../utils/pdfUtils";

interface Machine {
  id: number;
  name: string;
  category: string;
  image_urls: string[];
  short_description: string;
  specifications_md?: string;
  slug: string;
}

export default function Catalogue() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categoryFilter = searchParams.get("category") || "All";
  const categories = [
    "All",
    "Printing",
    "Packaging",
    "Die Cutting",
    "Binding",
    "Finishing",
    "Injection Moulding",
    "Metalworking",
    "Forklifts / Handling"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const url =
          categoryFilter === "All"
            ? "/api/machines"
            : `/api/machines?category=${categoryFilter}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();
        console.log("Fetched machines:", data);
        if (Array.isArray(data)) {
          setMachines(data);
          setFilteredMachines(data);
        } else {
          console.error("Expected array from API, got:", data);
          setMachines([]);
          setFilteredMachines([]);
        }
      } catch (error) {
        console.error("Failed to fetch machines:", error);
        setMachines([]);
        setFilteredMachines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, [categoryFilter]);

  useEffect(() => {
    const filtered = machines.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.short_description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMachines(filtered);
  }, [searchQuery, machines]);

  const handleCategoryChange = (cat: string) => {
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const downloadCatalogue = async () => {
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const companyName = CONTACT_INFO.companyName;
      
      await applyPdfBranding(doc, "Product Catalogue");

      const tableData = machines.map((m) => [
        m.name,
        m.category,
        m.short_description
      ]);

      autoTable(doc, {
        startY: 50,
        head: [['Machine Name', 'Category', 'Description']],
        body: tableData,
        headStyles: { fillColor: [37, 99, 235] }, // blue-600
        alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
        margin: { top: 50, bottom: 50 },
      });

      // Add detailed pages for each machine
      for (const machine of machines) {
        doc.addPage();
        await applyPdfBranding(doc, "Machine Details");
        
        doc.setFontSize(20);
        doc.setTextColor(30, 41, 59);
        let currentY = await writeTextWithPageBreaks(doc, machine.name, 14, 55, 8, "Machine Details");
        
        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text(`Category: ${machine.category}`, 14, currentY + 5);
        currentY += 15;
        
        // Try to add image
        if (machine.image_urls && machine.image_urls.length > 0) {
          try {
            const imgUrl = machine.image_urls[0].startsWith('http') 
              ? machine.image_urls[0] 
              : `${window.location.origin}${machine.image_urls[0]}`;
            
            // We use a canvas to convert image to base64
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
              
              const maxWidth = 180;
              const maxHeight = 120;
              const imgRatio = img.width / img.height;
              let printWidth = maxWidth;
              let printHeight = maxWidth / imgRatio;
              
              if (printHeight > maxHeight) {
                printHeight = maxHeight;
                printWidth = maxHeight * imgRatio;
              }
              
              // Center the image horizontally
              const xOffset = 14 + (maxWidth - printWidth) / 2;
              
              if (currentY + printHeight > doc.internal.pageSize.getHeight() - 55) {
                doc.addPage();
                await applyPdfBranding(doc, "Machine Details");
                currentY = 55;
              }
              
              doc.addImage(dataUrl, "JPEG", xOffset, currentY, printWidth, printHeight);
              currentY += printHeight + 10;
            }
          } catch (e) {
            console.error("Error adding image to PDF:", e);
          }
        }

        if (currentY + 20 > doc.internal.pageSize.getHeight() - 55) {
          doc.addPage();
          await applyPdfBranding(doc, "Machine Details");
          currentY = 55;
        }

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text("Description", 14, currentY);
        currentY += 8;
        
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105); // slate-600
        currentY = await writeTextWithPageBreaks(doc, machine.short_description, 14, currentY, 6, "Machine Details");

        // Fetch full details for specifications
        try {
          const res = await fetch(`/api/machines/${machine.id}`);
          if (res.ok) {
            const fullData = await res.json();
            if (fullData.specifications_md) {
              if (currentY + 20 > doc.internal.pageSize.getHeight() - 55) {
                doc.addPage();
                await applyPdfBranding(doc, "Machine Details");
                currentY = 55;
              } else {
                currentY += 15;
              }
              
              doc.setFontSize(14);
              doc.setTextColor(30, 41, 59);
              doc.text("Specifications", 14, currentY);
              currentY += 8;
              
              doc.setFontSize(10);
              doc.setTextColor(71, 85, 105);
              const specs = fullData.specifications_md.replace(/#/g, '').replace(/\*/g, '');
              await writeTextWithPageBreaks(doc, specs, 14, currentY, 5, "Machine Details");
            }
          }
        } catch (e) {
          console.error("Error fetching specs for PDF:", e);
        }
      }

      await applyPdfFooter(doc);
      doc.save(`${companyName.replace(/\s+/g, '_')}_Catalogue.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mb-6 md:mb-12 gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
              Machinery Catalogue
            </h1>
            
            {/* Search Bar - Full width on mobile, fixed width on desktop */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search machines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Action Row: Download and Filter Dropdown (Mobile Only) */}
          <div className="flex items-center justify-between gap-3 w-full md:hidden">
            <button
              onClick={downloadCatalogue}
              disabled={downloading || loading}
              className="flex-[1.2] flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 text-sm font-bold"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Download</span>
            </button>

            <div className="relative flex-1" ref={dropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-sm font-bold"
              >
                <Filter className="h-4 w-4" />
                <span>{categoryFilter === "All" ? "Filter" : categoryFilter}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategoryChange(cat);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                        categoryFilter === cat
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Action Row (Hidden on Mobile) */}
          <div className="hidden md:flex items-center justify-end">
            <button
              onClick={downloadCatalogue}
              disabled={downloading || loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Download Catalogue</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Hidden on Mobile) */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-900 font-semibold">
                <Filter className="h-5 w-5" />
                <h2>Categories</h2>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categoryFilter === cat
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Machine Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse"
                  >
                    <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-16 bg-slate-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-slate-200 rounded w-full mt-auto"></div>
                  </div>
                ))}
              </div>
            ) : filteredMachines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMachines.map((machine) => (
                  <Link
                    key={machine.id}
                    to={`/machine/${machine.slug || machine.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={machine.image_urls[0]}
                        alt={machine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                        {machine.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {machine.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                        {machine.short_description}
                      </p>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-semibold text-sm">
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No machines found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your filters or search query to find what you're
                  looking for.
                </p>
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
