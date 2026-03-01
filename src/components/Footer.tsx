import { Link } from "react-router-dom";
import { Settings, Mail, Phone, MapPin } from "lucide-react";
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
              installing, and maintaining industrial machines across India.
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
                  Printing Machines
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Cutting"
                  className="hover:text-blue-400 transition-colors"
                >
                  Cutting Machines
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Moulding"
                  className="hover:text-blue-400 transition-colors"
                >
                  Moulding Machines
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Graphic"
                  className="hover:text-blue-400 transition-colors"
                >
                  Graphic Machines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                <span>
                  {CONTACT_INFO.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <span>{CONTACT_INFO.email}</span>
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
