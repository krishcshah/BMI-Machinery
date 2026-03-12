import {
  ArrowRight,
  CheckCircle2,
  Factory,
  Wrench,
  Truck,
  ShieldCheck,
  Globe,
  Zap,
  Users,
  Award,
  Star,
  Search,
  FileText,
  Settings,
  Banknote,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Printer,
  Box,
  Layers,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = "High-Quality Used Printing & Industrial Machinery | BMI";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "BMI Machinery is India's leading importer of used German printing, packaging, and moulding machines. We offer turnkey import solutions from Germany to India."
      );
    }

    // Add FAQ Schema
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const faqs = [
    {
      question: "Is it safe to import used machinery from Germany?",
      answer: "Yes, it is completely safe when working with a certified used machinery importer in India like BMI Machinery. We conduct rigorous physical inspections, technical evaluations, and testing in Germany before any machine is shipped, ensuring zero-risk procurement."
    },
    {
      question: "How long does it take to import a used printing machine to India?",
      answer: "Typically, the end-to-end process to import used machinery from Germany takes 4 to 8 weeks. This includes machine sourcing, inspection, dismantling, international shipping, customs clearance in India, and final delivery to your factory."
    },
    {
      question: "What are customs duties on used machinery?",
      answer: "Customs duties on used industrial machines vary based on the specific HS code and machine type. As your turnkey machinery import solution in India, we handle all import documentation and provide a transparent breakdown of all applicable duties and taxes upfront."
    },
    {
      question: "Do you provide installation support?",
      answer: "Absolutely. Our pan-India installation & service support team handles the complete unloading, installation, and commissioning of your used offset printing machine or industrial equipment at your facility."
    },
    {
      question: "Do you offer after sales support?",
      answer: "Yes, we provide one year after sales support on refurbished industrial machinery. We ensure the machine operates exactly as per the technical evaluation report provided during the inspection in Germany."
    },
    {
      question: "How do you inspect machines before purchase?",
      answer: "Our Germany-based inspection network physically visits the seller's site. We run test prints or production cycles, check cylinder conditions, inspect gears, and verify the overall mechanical and electrical health before finalizing any second hand printing machine."
    },
    {
      question: "Can you help with bank financing?",
      answer: "Yes, we provide comprehensive machinery financing India support. We assist with industrial equipment loan support, structured payment plans, and LC (Letter of Credit) documentation to optimize your working capital."
    },
    {
      question: "What brands do you deal with?",
      answer: "We specialize in premium European brands. For printing, we source Heidelberg, Komori, Manroland, and KBA. For packaging and cutting, we source Polar and Bobst. We also source top-tier German used industrial machines for moulding and binding."
    },
    {
      question: "Do you supply spare parts?",
      answer: "Yes, we provide genuine spare parts and comprehensive after-sales service for all machines we import. This ensures the longevity and continuous operation of your used Heidelberg machine in India."
    },
    {
      question: "Can you source machines not listed in catalogue?",
      answer: "Definitely. If you need a specific used packaging machine in India or a specialized moulding machine, our industrial machinery sourcing Germany team will find the exact make, model, and year you require from our global network."
    }
  ];

  const reviews = [
    {
      name: "Rajesh Sharma",
      title: "CEO, Sharma Packaging",
      avatar: "https://picsum.photos/seed/rajesh/100/100",
      text: "BMI Machinery completely transformed our production line. Their expertise in sourcing the right Heidelberg press for our needs was invaluable. The installation was seamless and their ongoing support is top-notch."
    },
    {
      name: "Anita Desai",
      title: "Operations Director, PrintTech India",
      avatar: "https://picsum.photos/seed/anita/100/100",
      text: "We were hesitant about importing heavy machinery, but BMI made the entire process transparent and stress-free. They handled all the customs and logistics perfectly. Highly recommended!"
    },
    {
      name: "Vikram Singh",
      title: "Managing Director, Singh Graphics",
      avatar: "https://picsum.photos/seed/vikram/100/100",
      text: "The level of technical expertise BMI brings is unmatched. Their engineers trained our staff thoroughly and are always available when we need them. A true partner in our growth."
    },
    {
      name: "Priya Patel",
      title: "Founder, Patel Mouldings",
      avatar: "https://picsum.photos/seed/priya/100/100",
      text: "From the initial consultation to the final commissioning, BMI Machinery exceeded our expectations. They helped us secure financing and delivered exactly what they promised, on time."
    },
    {
      name: "Sanjay Gupta",
      title: "Production Head, Gupta Industries",
      avatar: "https://picsum.photos/seed/sanjay/100/100",
      text: "We've purchased three machines through BMI over the last five years. Their consistent quality of service and deep understanding of the Indian market makes them our go-to supplier."
    },
    {
      name: "Meera Reddy",
      title: "CEO, Reddy Print Solutions",
      avatar: "https://picsum.photos/seed/meera/100/100",
      text: "Outstanding service! BMI not only found the perfect cutting machine for our specific requirements but also negotiated a great price. Their after-sales support has been fantastic."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION (H1) */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://i.imgur.com/Bvkgiuo.jpeg"
            alt="High-Quality Used Printing & Industrial Machinery"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              High-Quality Used Printing, Binding & Industrial Machinery from Europe
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-medium">
              Import reliable pre-owned printing, binding, packaging, and industrial machines from Germany and across Europe. We provide complete end-to-end support so you can reduce capital costs without compromising on precision engineering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalogue"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                View Available Machines
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-xl text-slate-900 bg-white hover:bg-slate-50 transition-colors shadow-lg"
              >
                Send Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS SECTION */}
      <section className="bg-blue-600 py-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-blue-500/50">
            <div className="px-4">
              <div className="text-3xl font-extrabold mb-1">20+</div>
              <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">Years Experience</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-extrabold mb-1">500+</div>
              <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">Machines Installed Across India</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-extrabold mb-1"><Globe className="h-8 w-8 mx-auto" /></div>
              <div className="text-sm font-medium text-blue-100 uppercase tracking-wider mt-2">Germany-Based Inspection Network</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-extrabold mb-1"><Wrench className="h-8 w-8 mx-auto" /></div>
              <div className="text-sm font-medium text-blue-100 uppercase tracking-wider mt-2">Pan-India Installation & Service Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT BMI MACHINERY (SEO Optimized) */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                Leading Used Machinery Importer in India
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                BMI Machinery is the most trusted <strong>used machinery importer in India</strong>, dedicated to helping Indian businesses purchase premium used industrial machines directly from Germany and Europe. We offer a seamless, <strong>turnkey import solution India</strong> can rely on.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Expert Sourcing in Germany", desc: "We navigate the European market, negotiate prices, and handle complex logistics for industrial machinery sourcing Germany." },
                  { title: "Rigorous Inspection & Verification", desc: "Every German used printing machine or industrial unit is tested by local experts before shipment to avoid risks and fraud." },
                  { title: "End-to-End Import Process", desc: "We handle everything from dismantling and shipping to customs clearance and installation." },
                  { title: "Higher ROI & Cost Savings", desc: "Reduce capital expenditure by 40–60% compared to new Chinese alternatives while upgrading to world-class equipment." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1 bg-emerald-100 p-1 rounded-full shrink-0 h-fit">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://i.imgur.com/Bvkgiuo.jpeg" 
                  alt="Industrial machinery sourcing Germany" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Trusted by top</div>
                    <div className="text-sm text-slate-500">manufacturers in India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR CORE MACHINE CATEGORIES (SEO Sections) */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Our Expertise
            </h2>
            <p className="text-lg text-slate-600">
              We source, inspect, and import a wide range of premium second-hand industrial equipment tailored for the Indian manufacturing sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Printer className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">1. Used Printing Machines from Germany to India</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Upgrade your press room with a high-quality <strong>used offset printing machine India</strong> trusts. We source premium <strong>refurbished printing machines</strong> directly from European print houses.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Heidelberg Speedmaster & SM series</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Komori offset machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Manroland presses</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> KBA printing machines</li>
              </ul>
              <Link to="/catalogue?category=Printing" className="mt-auto pt-6 border-t border-slate-200 inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 group">
                <span className="leading-snug">View <strong>second hand Heidelberg press</strong> inventory</span> 
                <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Category 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Box className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">2. Used Packaging & Die Cutting Machines</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Enhance your packaging capabilities with reliable <strong>used packaging machinery India</strong>. We help you <strong>import Bobst machine India</strong> safely and efficiently.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Polar cutting machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Bobst die cutting machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Folding carton machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Corrugation machines</li>
              </ul>
              <Link to="/catalogue?category=Die+Cutting" className="mt-auto pt-6 border-t border-slate-200 inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 group">
                <span className="leading-snug">Find a <strong>used die cutting machine</strong></span> 
                <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Category 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">3. Used Binding & Finishing Machines</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Complete your post-press setup with robust <strong>used book binding machines</strong> and a reliable <strong>used lamination machine India</strong>.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Perfect binding machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Stitching machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Lamination machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Folding machines</li>
              </ul>
              <Link to="/catalogue?category=Binding" className="mt-auto pt-6 border-t border-slate-200 inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 group">
                <span className="leading-snug">View binding & finishing equipment</span> 
                <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Category 4 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Factory className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">4. Other Industrial Machinery</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Scale your manufacturing with top-tier <strong>used industrial machines India</strong>. We make it easy to <strong>import machinery from Germany</strong> with full technical validation.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Injection Moulding Machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Metalworking Machines</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> Forklifts / Handling</li>
              </ul>
              <Link to="/catalogue" className="mt-auto pt-6 border-t border-slate-200 inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 group">
                <span className="leading-snug">Browse <strong>other industrial machinery</strong></span> 
                <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OUR END-TO-END IMPORT PROCESS */}
      <section className="py-20 lg:py-28 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Our End-to-End Import Process
            </h2>
            <p className="text-lg text-slate-400">
              As a premier <strong>industrial equipment import consultant</strong>, we provide comprehensive <strong>machinery import services India</strong>. Experience zero-risk procurement, complete transparency, full documentation, and technical validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Requirement Analysis", desc: "We understand your production needs, budget, and technical specifications to find the perfect fit.", icon: <Search className="h-6 w-6 text-blue-400" /> },
              { step: "2", title: "Machine Sourcing in Germany", desc: "We leverage our European network to locate high-quality, well-maintained machines directly from factories.", icon: <Globe className="h-6 w-6 text-blue-400" /> },
              { step: "3", title: "Physical Inspection & Testing", desc: "Our engineers in Germany conduct rigorous physical inspections, run test prints, and provide detailed reports.", icon: <ShieldCheck className="h-6 w-6 text-blue-400" /> },
              { step: "4", title: "Commercial Negotiation", desc: "We negotiate the best possible price on your behalf, ensuring maximum ROI and transparent pricing.", icon: <Banknote className="h-6 w-6 text-blue-400" /> },
              { step: "5", title: "Shipping & Customs Clearance", desc: "We handle dismantling, packing, international freight, and all complex Indian customs clearance procedures.", icon: <Truck className="h-6 w-6 text-blue-400" /> },
              { step: "6", title: "Installation & Commissioning in India", desc: "Our local technical team installs the machine at your site, conducts operator training, and hands it over in production-ready state.", icon: <Settings className="h-6 w-6 text-blue-400" /> },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800 rounded-2xl p-8 border border-slate-700 relative overflow-hidden group hover:border-blue-500 transition-colors">
                <div className="absolute top-0 right-0 text-9xl font-black text-slate-700/20 -mt-8 -mr-4 group-hover:text-blue-900/20 transition-colors">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-slate-700">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">Step {item.step} – {item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BUY USED GERMAN MACHINERY? */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Why Buy Used German Machinery?
            </h2>
            <p className="text-lg text-slate-600">
              A direct comparison: German Used Machine vs Cheap New Machine
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl mx-auto">
            <div className="grid grid-cols-3 bg-slate-900 text-white p-6 font-bold text-sm md:text-base">
              <div className="col-span-1">Feature</div>
              <div className="col-span-1 text-center text-blue-400">Used German Machine</div>
              <div className="col-span-1 text-center text-slate-400">Cheap New Machine (Asian)</div>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { feature: "Build Quality & Precision", german: "Exceptional (Heavy-duty cast iron, precise engineering)", new: "Average (Lighter materials, lower tolerances)" },
                { feature: "Longevity", german: "20-30+ Years with proper maintenance", new: "5-7 Years before major overhauls needed" },
                { feature: "Spare Availability", german: "Globally available, highly standardized", new: "Often difficult to source after a few years" },
                { feature: "Resale Value", german: "High retention value in the secondary market", new: "Depreciates rapidly, very low resale value" },
                { feature: "Return on Investment (ROI)", german: "Excellent (Lower initial cost, long lifespan)", new: "Poor (Frequent breakdowns, short lifespan)" },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 p-6 items-center text-sm md:text-base hover:bg-slate-50 transition-colors">
                  <div className="col-span-1 font-semibold text-slate-900">{row.feature}</div>
                  <div className="col-span-1 text-center text-emerald-600 font-medium flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{row.german}</span>
                  </div>
                  <div className="col-span-1 text-center text-slate-500 flex flex-col items-center gap-2">
                    <span>{row.new}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MACHINE VERIFICATION & RISK PROTECTION */}
      <section className="py-20 bg-blue-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Machine Verification & Risk Protection
              </h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Importing used industrial machinery from Europe can be risky without local expertise. BMI Machinery eliminates that risk through a structured verification process designed specifically for Indian manufacturers.
              </p>
              <ul className="space-y-6 mb-8">
                <li className="flex items-start gap-4">
                  <div className="bg-blue-500/30 p-2 rounded-lg shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <strong className="block text-lg mb-1">Detailed Technical Inspection Reports</strong>
                    <span className="text-blue-100 text-sm leading-relaxed">Every machine undergoes physical inspection in Germany. We provide high-resolution images, running condition videos, electrical panel checks, and wear-part analysis before final approval.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-blue-500/30 p-2 rounded-lg shrink-0">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <strong className="block text-lg mb-1">Performance Validation</strong>
                    <span className="text-blue-100 text-sm leading-relaxed">Where applicable, we conduct live test runs to verify print quality, mechanical accuracy, and operational stability.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-blue-500/30 p-2 rounded-lg shrink-0">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <strong className="block text-lg mb-1">Transparent Machine History</strong>
                    <span className="text-blue-100 text-sm leading-relaxed">We verify machine year, usage hours (if available), configuration, upgrades, and maintenance background to ensure authenticity.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-blue-500/30 p-2 rounded-lg shrink-0">
                    <Banknote className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <strong className="block text-lg mb-1">Clear Cost Breakdown</strong>
                    <span className="text-blue-100 text-sm leading-relaxed">You receive a complete landed cost estimate — machine price, dismantling, freight, customs duty, and local transport — with no hidden charges.</span>
                  </div>
                </li>
              </ul>
              <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-6 py-4 backdrop-blur-sm">
                <p className="font-semibold text-lg">
                  With BMI Machinery, you are not buying blind. You are investing with clarity.
                </p>
              </div>
            </div>
            <div className="hidden md:flex relative justify-center items-center min-h-[500px]">
              <ShieldCheck className="absolute w-[150%] h-[150%] text-white opacity-5 right-[-25%] top-1/2 -translate-y-1/2" />
              <div className="relative z-10 w-full max-w-sm space-y-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl transform translate-x-4 hover:translate-x-2 transition-transform">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-emerald-400/20 p-2 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-bold text-lg">100% Verified</h4>
                  </div>
                  <p className="text-blue-100 text-sm">Every machine passes a rigorous 50-point technical inspection.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl transform -translate-x-4 hover:-translate-x-2 transition-transform">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-blue-400/20 p-2 rounded-full">
                      <Globe className="h-6 w-6 text-blue-300" />
                    </div>
                    <h4 className="text-white font-bold text-lg">European Standards</h4>
                  </div>
                  <p className="text-blue-100 text-sm">Sourced directly from top-tier facilities in Germany and the EU.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES SECTION */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-slate-600">
              See how we've helped Indian manufacturers scale their operations with premium used machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Case Study 1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Mumbai packaging firm imported Heidelberg Speedmaster</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                A leading carton manufacturer in Mumbai needed to increase capacity. We sourced a 2012 Heidelberg Speedmaster CD 102-6+L from Germany.
              </p>
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <div className="text-sm font-semibold text-slate-900">Result:</div>
                <div className="text-emerald-600 font-bold text-lg mt-1">45% increase in production capacity</div>
                <div className="text-xs text-slate-500 mt-1">Saved 60% compared to a new machine.</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Case Study 2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Ahmedabad moulding company upgraded production line</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                An automotive parts supplier required high-tonnage injection moulding. We imported two KraussMaffei machines with full technical validation.
              </p>
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <div className="text-sm font-semibold text-slate-900">Result:</div>
                <div className="text-emerald-600 font-bold text-lg mt-1">Zero rejection rate achieved</div>
                <div className="text-xs text-slate-500 mt-1">Installed and commissioned within 6 weeks.</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Case Study 3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Delhi printing unit reduced downtime by 35%</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                A commercial printer was struggling with an aging Asian press. We replaced it with a fully refurbished Komori Lithrone sourced from Europe.
              </p>
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <div className="text-sm font-semibold text-slate-900">Result:</div>
                <div className="text-emerald-600 font-bold text-lg mt-1">35% reduction in machine downtime</div>
                <div className="text-xs text-slate-500 mt-1">ROI achieved in just 14 months.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what industry leaders have to say about partnering with BMI Machinery.
          </p>
        </div>

        <div className="relative flex flex-col gap-6 overflow-x-hidden group">
          <div className="animate-marquee w-max flex gap-6 whitespace-nowrap group-hover:[animation-play-state:paused] px-3">
            {[...reviews, ...reviews, ...reviews, ...reviews].map((review, index) => (
              <div key={`row1-${index}`} className="w-[350px] shrink-0 bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col whitespace-normal shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-600" />
                  <div>
                    <h4 className="font-bold text-lg text-white">{review.name}</h4>
                    <p className="text-sm text-slate-400">{review.title}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 italic leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
          <div className="animate-marquee-reverse w-max flex gap-6 whitespace-nowrap group-hover:[animation-play-state:paused] px-3">
            {[...[...reviews].reverse(), ...[...reviews].reverse(), ...[...reviews].reverse(), ...[...reviews].reverse()].map((review, index) => (
              <div key={`row2-${index}`} className="w-[350px] shrink-0 bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col whitespace-normal shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-600" />
                  <div>
                    <h4 className="font-bold text-lg text-white">{review.name}</h4>
                    <p className="text-sm text-slate-400">{review.title}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 italic leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION (IMPORTANT FOR SEO) */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about importing used industrial machinery to India.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-slate-900 pr-8">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRONG FINAL CTA SECTION */}
      <section className="py-20 lg:py-32 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
            Ready to Import High-Quality Used Machinery from Germany?
          </h2>
          <p className="text-xl text-slate-400 mb-12">
            Partner with India's most trusted industrial equipment import consultant. Let us handle the complexity while you focus on production.
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact"
              className="inline-flex justify-center items-center px-10 py-4 text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
