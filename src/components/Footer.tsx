import { Link } from "react-router-dom";
import { Settings, Mail, Phone } from "lucide-react";
import { CONTACT_INFO } from "../constants";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Settings className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl tracking-tight text-white">
                {CONTACT_INFO.companyName}
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Your trusted partner for finding, buying, shipping, importing,
              installing, and maintaining used machines from Germany to India.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue"
                  className="hover:text-blue-400 transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/catalogue?category=Printing"
                  className="hover:text-blue-400 transition-colors"
                >
                  Printing
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Packaging"
                  className="hover:text-blue-400 transition-colors"
                >
                  Packaging
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Die+Cutting"
                  className="hover:text-blue-400 transition-colors"
                >
                  Die Cutting
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Binding"
                  className="hover:text-blue-400 transition-colors"
                >
                  Binding
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Finishing"
                  className="hover:text-blue-400 transition-colors"
                >
                  Finishing
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Injection+Moulding"
                  className="hover:text-blue-400 transition-colors"
                >
                  Injection Moulding
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Metalworking"
                  className="hover:text-blue-400 transition-colors"
                >
                  Metalworking
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Forklifts+%2F+Handling"
                  className="hover:text-blue-400 transition-colors"
                >
                  Forklifts / Handling
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  {CONTACT_INFO.phones[0]}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <a href="tel:+4915679748887" className="hover:text-blue-400 transition-colors">
                  {CONTACT_INFO.phones[1]}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <a href={`mailto:${CONTACT_INFO.emails[0]}`} className="hover:text-blue-400 transition-colors">
                  {CONTACT_INFO.emails[0]}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <a href={`mailto:${CONTACT_INFO.emails[1]}`} className="hover:text-blue-400 transition-colors">
                  {CONTACT_INFO.emails[1]}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-sm flex flex-col md:flex-row justify-between items-center text-slate-500">
          <div>&copy; {new Date().getFullYear()} {CONTACT_INFO.companyName}. All rights reserved.</div>
          <div className="mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-slate-400 transition-colors opacity-50">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
