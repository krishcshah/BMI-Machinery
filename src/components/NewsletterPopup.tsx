import { useState, useEffect } from "react";
import { Mail, ArrowRight, CheckCircle2, XCircle, X } from "lucide-react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("newsletter_popup_seen");
    if (hasSeenPopup) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletter_popup_seen", "true");
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
      } else {
        setError(data.error || "Failed to subscribe");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("success");
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="bg-blue-600 p-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[150%] rounded-full bg-blue-500/30 blur-[50px]"></div>
          </div>
          <h2 className="text-2xl font-bold relative z-10">Stay Updated!</h2>
          <p className="text-blue-100 mt-2 relative z-10">Get notified when new machines arrive.</p>
        </div>

        <div className="p-6">
          {step === "email" && (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label htmlFor="popup-email" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="popup-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              {error && (
                <div className="flex items-center text-red-600 text-sm mt-2">
                  <XCircle className="h-4 w-4 mr-1" /> {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Sending Code..." : "Get Verification Code"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-slate-500 text-sm mb-4 text-center">We've sent a 4-digit code to <strong>{email}</strong>.</p>
              
              <div>
                <label htmlFor="popup-otp" className="sr-only">Verification Code</label>
                <input
                  type="text"
                  id="popup-otp"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="block w-full px-4 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-[0.5em] font-mono transition-colors"
                  placeholder="••••"
                />
              </div>
              
              {error && (
                <div className="flex items-center text-red-600 text-sm mt-2">
                  <XCircle className="h-4 w-4 mr-1" /> {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || otp.length !== 4}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Verifying..." : "Verify & Subscribe"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-sm text-slate-500 hover:text-slate-700 mt-2"
              >
                Change email address
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">You're Subscribed!</h3>
              <p className="text-slate-600 text-sm">
                Thank you for subscribing. You'll now receive updates when we add new premium machinery.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
