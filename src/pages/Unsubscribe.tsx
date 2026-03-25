import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter/unsubscribe-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
      } else {
        setError(data.error || "Failed to process request");
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
      const res = await fetch("/api/newsletter/unsubscribe-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("success");
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Unsubscribe</h2>
          <p className="mt-2 text-sm text-slate-600">
            We're sorry to see you go.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100">
          {step === "email" && (
            <form onSubmit={handleRequest} className="space-y-4">
              <p className="text-slate-500 text-sm mb-6">
                Enter your email address to receive a 4-digit verification code to confirm your unsubscription.
              </p>
              
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
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
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Sending Code..." : "Get Verification Code"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-slate-500 text-sm mb-6 text-center">
                We've sent a 4-digit code to <strong>{email}</strong>.
              </p>
              
              <div>
                <label htmlFor="otp" className="sr-only">Verification Code</label>
                <input
                  type="text"
                  id="otp"
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
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Verifying..." : "Confirm Unsubscribe"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-sm text-slate-500 hover:text-slate-700 mt-4"
              >
                Change email address
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Unsubscribed Successfully</h3>
              <p className="text-slate-600 mb-8">
                Your email has been removed from our mailing list. You will no longer receive updates from us.
              </p>
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
