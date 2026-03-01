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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "BMI Machinery | Industrial Printing Machines Import & Service in India";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Leading importer of industrial printing and manufacturing machinery in India. We provide end-to-end solutions for Indian businesses looking to buy high-quality printing machines from global brands.");
    }
  }, []);

  const features = [
    {
      icon: <Factory className="h-8 w-8 text-blue-600" />,
      title: "Global Sourcing & Procurement",
      description:
        "We specialize in sourcing high-end printing and industrial machinery from Europe, Japan, and the USA, tailored to the specific production requirements of Indian factories.",
    },
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Hassle-Free Import & Logistics",
      description:
        "Our team manages the entire import process, including customs documentation, international shipping, and local transport, ensuring your machinery arrives safely at your facility.",
    },
    {
      icon: <Wrench className="h-8 w-8 text-blue-600" />,
      title: "Expert Installation & Training",
      description:
        "Certified engineers handle the complete setup, calibration, and staff training, ensuring your team is fully equipped to operate your new printing technology from day one.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
      title: "Comprehensive After-Sales Support",
      description:
        "We provide 24/7 technical assistance, genuine spare parts, and preventative maintenance contracts to maximize the uptime of your manufacturing lines across India.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://www.heidelberg.com/global/media/global_media/products___sheetfed_offset/current_pictures/xl_106_2024_generation/xl_106_packaging/HEIDELBERG_Speedmaster_XL_106_7_perfecting-feeder-inkstardetail-stage.jpg"
            alt="Advanced Printing Machinery"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Premium <span className="text-blue-500">Printing Machines</span> for Indian Businesses
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              BMI Machinery is India's premier partner for sourcing, importing, and maintaining world-class industrial equipment. We help Indian manufacturers scale with cutting-edge global technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                View Machine Catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
              >
                Request a Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">15+</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">500+</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Machines Installed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Technical Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Genuine Spares</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Complete Solutions for Printing & Packaging
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We bridge the gap between international machinery manufacturers and the Indian market, providing a seamless experience for businesses looking to upgrade their production lines with the latest technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://www.heidelberg.com/global/media/global_media/products___sheetfed_offset/current_pictures/xl_106_2024_generation/xl_106_packaging/HEIDELBERG_Speedmaster_XL_106_7_perfecting-feeder-inkstardetail-stage.jpg"
                  alt="Heidelberg Speedmaster XL 106"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quality Assured</div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "BMI Machinery transformed our production capacity with their expert sourcing and installation of our new offset press."
                </p>
                <div className="mt-4 text-xs font-bold text-slate-400">— Leading Packaging Firm, Mumbai</div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                Why Partner with BMI Machinery for Your Factory?
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                With over a decade of experience in the industrial sector, we understand the unique challenges faced by Indian businesses when importing heavy machinery. Our mission is to simplify this complexity and provide a turnkey solution.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Direct Manufacturer Partnerships", desc: "We work directly with top-tier global brands to ensure you get the best pricing and authentic equipment." },
                  { title: "Transparent Import Process", desc: "No hidden fees. We handle all customs, duties, and logistics with complete transparency." },
                  { title: "Local Technical Expertise", desc: "Our India-based engineers are trained by the manufacturers to provide world-class service locally." },
                  { title: "Customized Financial Solutions", desc: "We offer flexible leasing and financing options to help manage your capital expenditure." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1 bg-emerald-100 p-1 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12">
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 group"
                >
                  Learn more about our process
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Global Reach</h3>
              <p className="text-slate-600">Sourcing from Germany, Japan, USA, and beyond to bring the world's best technology to India.</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Rapid Deployment</h3>
              <p className="text-slate-600">Optimized logistics and pre-clearance processes to minimize lead times for your critical machinery.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Dedicated Support</h3>
              <p className="text-slate-600">Local service centers across major Indian industrial hubs for immediate on-site assistance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            Ready to Modernize Your Indian Manufacturing Facility?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join hundreds of successful Indian businesses that have upgraded their production lines with BMI Machinery. Get a free consultation with our import experts today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-xl text-blue-600 bg-white hover:bg-slate-50 transition-all shadow-2xl hover:scale-105"
            >
              Get a Free Consultation
            </Link>
            <Link
              to="/catalogue"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-xl text-white border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              Browse Machines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
