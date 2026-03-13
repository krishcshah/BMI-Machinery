import { useState, useEffect, useRef, useCallback } from "react";
import { PlusCircle, Save, LogIn, Image as ImageIcon, X, Loader2, Trash2, Sparkles, Check, RefreshCw, Edit2, Lock } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds in milliseconds

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sessionTimedOut, setSessionTimedOut] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);
  
  const [machines, setMachines] = useState<any[]>([]);
  const [fetchingMachines, setFetchingMachines] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Printing",
    short_description: "",
    specifications_md: "",
    slug: "",
  });
  const [previews, setPreviews] = useState<{ url: string; file?: File; isExisting?: boolean }[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const formRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_last_activity");
    setIsLoggedIn(false);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  }, []);

  const handleTimeout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_last_activity");
    setIsLoggedIn(false);
    setSessionTimedOut(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (isLoggedIn) {
      inactivityTimerRef.current = setTimeout(() => {
        handleTimeout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [isLoggedIn, handleTimeout]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const lastActivity = localStorage.getItem("admin_last_activity");
    
    if (token) {
      if (lastActivity && Date.now() - parseInt(lastActivity, 10) > INACTIVITY_TIMEOUT) {
        handleTimeout();
      } else {
        setIsLoggedIn(true);
        fetchMachines();
        localStorage.setItem("admin_last_activity", Date.now().toString());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up event listeners for user activity
  useEffect(() => {
    if (isLoggedIn) {
      resetInactivityTimer();

      let lastUpdate = Date.now();
      const handleActivity = () => {
        resetInactivityTimer();
        const now = Date.now();
        if (now - lastUpdate > 60000) { // Update localStorage at most once a minute
          localStorage.setItem("admin_last_activity", now.toString());
          lastUpdate = now;
        }
      };

      const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
      
      events.forEach(event => {
        document.addEventListener(event, handleActivity);
      });

      // Also listen for storage events to sync logout across tabs
      const handleStorage = (e: StorageEvent) => {
        if (e.key === "admin_token" && !e.newValue) {
          handleLogout();
        }
      };
      window.addEventListener("storage", handleStorage);

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
        window.removeEventListener("storage", handleStorage);
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, [isLoggedIn, resetInactivityTimer, handleLogout]);

  const handleEdit = (machine: any) => {
    setEditingId(machine.id);
    setFormData({
      name: machine.name,
      category: machine.category,
      short_description: machine.short_description,
      specifications_md: machine.specifications_md || "",
      slug: machine.slug || "",
    });
    
    // Initialize previews with existing images
    const existingPreviews = (machine.image_urls || []).map((url: string) => ({
      url,
      isExisting: true
    }));
    setPreviews(existingPreviews);
    
    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    setMessage({ type: "", text: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: "Printing",
      short_description: "",
      specifications_md: "",
      slug: "",
    });
    setPreviews([]);
    setMessage({ type: "", text: "" });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newPreviews = [...previews];
    const [draggedItem] = newPreviews.splice(draggedIndex, 1);
    newPreviews.splice(dropIndex, 0, draggedItem);
    setPreviews(newPreviews);
    setDraggedIndex(null);
  };

  const fetchMachines = async () => {
    setFetchingMachines(true);
    try {
      const res = await fetch("/api/machines");
      if (res.ok) {
        const data = await res.json();
        setMachines(data);
      }
    } catch (error) {
      console.error("Failed to fetch machines:", error);
    } finally {
      setFetchingMachines(false);
    }
  };

  const deleteMachine = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this machine? This will also delete its images.")) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/machines/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Machine deleted successfully!" });
        fetchMachines();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to delete machine" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while deleting." });
    }
  };

  const refineWithAI = async () => {
    if (!formData.name && !formData.specifications_md) {
      setMessage({ type: "error", text: "Please enter a name or specifications to refine." });
      return;
    }

    setAiLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("Gemini API key not configured. Please set GEMINI_API_KEY in the Secrets panel.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a product copywriter for an industrial machinery company called BMI Machinery.
        Refine the following machine details to be more professional, elaborate, and well-formatted.
        
        Machine Name: ${formData.name}
        Short Description: ${formData.short_description}
        Specifications (Markdown): ${formData.specifications_md}
        
        Please return a JSON object with the following fields:
        - refinedName: Properly capitalized and formatted machine name.
        - refinedShortDescription: A more professional and engaging short description.
        - refinedSpecifications: Elaborated and beautified markdown specifications.
        
        Ensure the markdown is clean and uses professional terminology.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "{}");
      
      if (result.refinedName) {
        setFormData(prev => ({
          ...prev,
          name: result.refinedName,
          short_description: result.refinedShortDescription || prev.short_description,
          specifications_md: result.refinedSpecifications || prev.specifications_md,
          slug: generateSlug(result.refinedName)
        }));
        setMessage({ type: "success", text: "AI refinement complete! Review the changes below." });
      }
    } catch (error: any) {
      console.error("AI Refinement error:", error);
      setMessage({ type: "error", text: error.message || "AI refinement failed. Please try again." });
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsAuthenticating(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.requireOtp) {
          setShowOtpInput(true);
          setCooldown(30);
        } else {
          localStorage.setItem("admin_token", data.token);
          localStorage.setItem("admin_last_activity", Date.now().toString());
          setIsLoggedIn(true);
          setShowLoginModal(false);
          fetchMachines();
        }
      } else {
        const data = await res.json();
        setLoginError(data.error || "Invalid Admin Key");
        if (res.status === 429) {
          if (data.error.includes("minutes")) {
            const match = data.error.match(/in (\d+) minutes/);
            if (match) {
              setCooldown(parseInt(match[1]) * 60);
            }
          } else if (data.error.includes("30 seconds")) {
            setCooldown(30);
          }
        }
      }
    } catch (err) {
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleResendOtp = async () => {
    setLoginError("");
    setIsResendingOtp(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setCooldown(30);
        setOtp("");
      } else {
        const data = await res.json();
        setLoginError(data.error || "Failed to resend OTP");
        if (res.status === 429) {
          if (data.error.includes("minutes")) {
            const match = data.error.match(/in (\d+) minutes/);
            if (match) {
              setCooldown(parseInt(match[1]) * 60);
            }
          } else if (data.error.includes("30 seconds")) {
            setCooldown(30);
          }
        }
      }
    } catch (err) {
      setLoginError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsAuthenticating(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_last_activity", Date.now().toString());
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setShowOtpInput(false);
        setOtp("");
        fetchMachines();
      } else {
        const data = await res.json();
        setLoginError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setLoginError("Verification failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const categories = [
    "Printing",
    "Packaging",
    "Die Cutting",
    "Binding",
    "Finishing",
    "Injection Moulding",
    "Metalworking",
    "Forklifts / Handling"
  ];

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData({
        ...formData,
        [name]: value,
        slug: generateSlug(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        file,
        isExisting: false
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setPreviews(prev => {
      const item = prev[index];
      if (!item.isExisting && item.url.startsWith('blob:')) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (previews.length === 0) {
      setMessage({ type: "error", text: "Please upload at least one image." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("admin_token");
      
      // 1. Identify and upload new images
      const newFilesToUpload = previews
        .filter(p => !p.isExisting && p.file)
        .map(p => p.file as File);

      // Check total file size (Vercel has a 4.5MB limit for serverless functions)
      const totalSize = newFilesToUpload.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > 4.5 * 1024 * 1024) {
        throw new Error("Total image size exceeds 4.5MB. Please upload smaller images or fewer images at once to comply with Vercel's limits.");
      }

      let uploadedUrls: string[] = [];
      if (newFilesToUpload.length > 0) {
        const uploadFormData = new FormData();
        newFilesToUpload.forEach(file => uploadFormData.append("images", file));
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          let errorMsg = "Failed to upload images";
          try {
            const errorData = await uploadRes.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            if (uploadRes.status === 413) {
              errorMsg = "File too large. Vercel limits uploads to 4.5MB total.";
            } else {
              errorMsg = `Upload failed with status ${uploadRes.status}`;
            }
          }
          throw new Error(errorMsg);
        }

        const data = await uploadRes.json();
        uploadedUrls = data.urls;
      }

      // 2. Construct final image URLs array in the correct order
      let uploadIdx = 0;
      const finalImageUrls = previews.map(p => {
        if (p.isExisting) return p.url;
        return uploadedUrls[uploadIdx++];
      });

      // 3. Create or Update machine
      const url = editingId ? `/api/machines/${editingId}` : "/api/machines";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          image_urls: finalImageUrls
        }),
      });

      if (res.ok) {
        setMessage({ 
          type: "success", 
          text: editingId ? "Machine updated successfully!" : "Machine added successfully!" 
        });
        
        if (!editingId) {
          setFormData({
            name: "",
            category: "Printing",
            short_description: "",
            specifications_md: "",
            slug: "",
          });
          setPreviews([]);
        } else {
          cancelEdit();
        }
        fetchMachines();
      } else {
        const data = await res.json();
        setMessage({
          type: "error",
          text: data.error || "Failed to save machine",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn && !sessionTimedOut) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 lg:p-12 text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Lock className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Protected Area</h1>
          <p className="text-slate-500 mb-8">This section is restricted to BMI Machinery administrators only.</p>
          
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Enter Admin Key
          </button>

          {showLoginModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Admin Authentication</h2>
                  <button onClick={() => { setShowLoginModal(false); setShowOtpInput(false); setOtp(""); setPassword(""); setLoginError(""); setIsAuthenticating(false); }} className="text-slate-400 hover:text-slate-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={showOtpInput ? handleVerifyOtp : handleLogin} className="space-y-6">
                  {!showOtpInput ? (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 text-left">Admin Key</label>
                      <input
                        type="password"
                        required
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                        placeholder="Enter your key"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-slate-700 text-left">Enter OTP</label>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={cooldown > 0 || isAuthenticating || isResendingOtp}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:text-slate-400 transition-colors"
                        >
                          {isResendingOtp ? "Resending..." : cooldown > 0 ? `Resend in ${Math.floor(cooldown / 60)}:${(cooldown % 60).toString().padStart(2, '0')}` : "Resend OTP"}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 text-left">A 6-digit code has been sent to the admin emails.</p>
                      <input
                        type="text"
                        required
                        autoFocus
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-center tracking-widest text-lg font-mono"
                        placeholder="000000"
                      />
                    </div>
                  )}
                  {loginError && <p className="text-red-500 text-sm font-medium">{loginError}</p>}
                  <button
                    type="submit"
                    disabled={isAuthenticating || isResendingOtp}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        {showOtpInput ? "Verifying..." : "Sending OTP..."}
                      </>
                    ) : (
                      showOtpInput ? "Verify OTP" : "Verify Key"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`bg-slate-50 min-h-screen py-12 ${sessionTimedOut ? 'blur-md pointer-events-none select-none' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              {editingId ? <Edit2 className="h-8 w-8 text-blue-600" /> : <PlusCircle className="h-8 w-8 text-blue-600" />}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {editingId ? "Edit Machine" : "Add New Machine"}
              </h1>
              <p className="text-slate-600">
                {editingId ? `Updating details for ${formData.name}` : "Enter the details to add a new machine to the catalogue."}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors"
          >
            Logout
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-8 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div ref={formRef} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Machine Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="e.g., Heidelberg Speedmaster"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
                  URL Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="e.g., heidelberg-speedmaster"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">
                Machine Images {editingId ? "(Add More or Reorder)" : "(Upload Multiple)"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {previews.map((item, index) => (
                  <div 
                    key={index} 
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group cursor-move ${draggedIndex === index ? 'border-blue-500 opacity-50' : 'border-slate-200'}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
                      {index === 0 ? "Thumbnail" : `Image ${index + 1}`}
                    </div>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all text-slate-400 hover:text-blue-500">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <span className="text-xs font-bold">Add Image</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-slate-500">
                Upload high-quality images of the machine. You can drag and drop the images to reorder them. The first image will be used as the thumbnail.
              </p>
            </div>

            <div>
              <label
                htmlFor="short_description"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Short Description
              </label>
              <textarea
                id="short_description"
                name="short_description"
                required
                rows={3}
                value={formData.short_description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors resize-none"
                placeholder="A brief overview of the machine's capabilities..."
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="specifications_md"
                className="block text-sm font-bold text-slate-700 mb-2"
              >
                Specifications (Markdown)
              </label>
              <textarea
                id="specifications_md"
                name="specifications_md"
                required
                rows={10}
                value={formData.specifications_md}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors font-mono text-sm"
                placeholder="## Specifications\n\n- **Max Speed:** 10,000 units/hr\n- **Power:** 50kW\n\n### Features\n- Auto-calibration\n- Touchscreen interface"
              ></textarea>
              <p className="mt-2 text-sm text-slate-500">
                Use Markdown formatting for headings, lists, and bold text.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={refineWithAI}
                  disabled={aiLoading || loading}
                  className="inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {aiLoading ? (
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  Refine with AI
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || aiLoading}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    {editingId ? "Updating..." : "Saving..."}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-5 w-5" />
                    {editingId ? "Update Machine" : "Save Machine"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Machine List Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Existing Machines</h2>
            <button 
              onClick={fetchMachines}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Refresh List
            </button>
          </div>

          {fetchingMachines ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : machines.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Machine</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Category</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Slug</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {machines.map((machine) => (
                      <tr key={machine.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              <img 
                                src={machine.image_urls[0]} 
                                alt={machine.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="font-bold text-slate-900">{machine.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                            {machine.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                          {machine.slug}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(machine)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Machine"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteMachine(machine.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Machine"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
              <p className="text-slate-500">No machines found in the database.</p>
            </div>
          )}
        </div>
      </div>
      </div>

      {sessionTimedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-4 animate-in fade-in zoom-in">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Expired</h2>
            <p className="text-slate-600 mb-8">Your session timed out due to inactivity. Please log in again to continue.</p>
            <button
              onClick={() => {
                setSessionTimedOut(false);
                setIsLoggedIn(false);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Go back to login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

