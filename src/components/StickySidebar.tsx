import { Link } from "react-router-dom";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { CONTACT_INFO } from "../constants";

export default function StickySidebar() {
  return (
    <aside className="sticky top-24 space-y-8">
      {/* Lead Gen Widget */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-600 opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-400 opacity-20 blur-2xl"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-extrabold mb-4 leading-tight">
            Looking for a specific machine?
          </h3>
          <p className="text-slate-300 mb-6 text-sm leading-relaxed">
            Get a free consultation on importing high-quality used industrial machinery from Europe to India. We handle everything from inspection to installation.
          </p>
          
          <Link
            to="/contact"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 group"
          >
            Send Inquiry
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
            <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
              <div className="bg-slate-800 p-2 rounded-lg">
                <Phone className="w-4 h-4 text-blue-400" />
              </div>
              {CONTACT_INFO.phones[0]}
            </a>
            <a href="tel:+4915679748887" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
              <div className="bg-slate-800 p-2 rounded-lg">
                <Phone className="w-4 h-4 text-blue-400" />
              </div>
              {CONTACT_INFO.phones[1]}
            </a>
            <a href={`mailto:${CONTACT_INFO.emails[0]}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
              <div className="bg-slate-800 p-2 rounded-lg">
                <Mail className="w-4 h-4 text-blue-400" />
              </div>
              {CONTACT_INFO.emails[0]}
            </a>
            <a href={`mailto:${CONTACT_INFO.emails[1]}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
              <div className="bg-slate-800 p-2 rounded-lg">
                <Mail className="w-4 h-4 text-blue-400" />
              </div>
              {CONTACT_INFO.emails[1]}
            </a>
          </div>
        </div>
      </div>

      {/* Quick Links Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hidden lg:block">
        <h4 className="font-bold text-slate-900 mb-4">Popular Categories</h4>
        <ul className="space-y-3">
          <li>
            <Link to="/catalogue?category=Printing" className="text-slate-600 hover:text-blue-600 text-sm font-medium flex items-center justify-between group">
              Printing Machinery
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
          <li>
            <Link to="/catalogue?category=Packaging" className="text-slate-600 hover:text-blue-600 text-sm font-medium flex items-center justify-between group">
              Packaging Equipment
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
          <li>
            <Link to="/catalogue?category=Injection+Moulding" className="text-slate-600 hover:text-blue-600 text-sm font-medium flex items-center justify-between group">
              Injection Moulding
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
