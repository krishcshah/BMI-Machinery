import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <section className="bg-blue-600 py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[150%] rounded-full bg-blue-500/30 blur-[100px]"></div>
        <div className="absolute -bottom-[50%] -left-[10%] w-[50%] h-[100%] rounded-full bg-blue-700/50 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-blue-500/30 border border-blue-400/30">
                <span className="text-sm font-bold text-blue-50 uppercase tracking-wider">Stay Updated</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Want to stay updated with our inventory?
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                Subscribe to get the latest updates on our premium second-hand industrial machinery. Be the first to know when high-quality equipment arrives.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-blue-50"><CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" /> Exclusive early access to new arrivals</li>
                <li className="flex items-center text-blue-50"><CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" /> Monthly catalogue highlights</li>
                <li className="flex items-center text-blue-50"><CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" /> No spam, unsubscribe anytime</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
              {step === "email" && (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Subscribe to our Newsletter</h3>
                  <p className="text-slate-500 text-sm mb-6">Enter your email address to receive a 4-digit verification code.</p>
                  
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
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Sending Code..." : "Get Verification Code"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </button>
                </form>
              )}

              {step === "otp" && (
                <form onSubmit={handleVerify} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Verify your Email</h3>
                  <p className="text-slate-500 text-sm mb-6">We've sent a 4-digit code to <strong>{email}</strong>.</p>
                  
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
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Verifying..." : "Verify & Subscribe"}
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
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">You're Subscribed!</h3>
                  <p className="text-slate-600">
                    Thank you for subscribing. You'll now receive updates when we add new premium machinery to our inventory.
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
