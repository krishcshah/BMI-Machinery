import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found | BMI Machinery";
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-max mx-auto text-center">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-blue-600 sm:text-5xl">404</p>
          <div className="sm:ml-6 sm:border-l sm:border-slate-200 sm:pl-6">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-2 text-base text-slate-500">
              Please check the URL in the address bar and try again.
            </p>
          </div>
        </main>
        <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6 justify-center sm:justify-start">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Go back home
          </Link>
          <Link
            to="/catalogue"
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            View Catalogue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
