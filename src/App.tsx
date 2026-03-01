import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import MachineDetails from "./pages/MachineDetails";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/machine/:idOrSlug" element={<MachineDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Analytics />
    </Router>
  );
}
