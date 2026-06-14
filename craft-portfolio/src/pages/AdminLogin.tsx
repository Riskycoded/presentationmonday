import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, Mail, ShieldAlert } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle callback errors from Google OAuth (e.g. ?error=unauthorized)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "unauthorized") {
      toast.error("Google Login Rejected: Account is not authorized as Admin.");
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both your admin email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Access Denied: Invalid credentials.");
      }

      localStorage.setItem("adminToken", data.token);
      toast.success("Welcome back, Admin! Session authenticated securely.");
      navigate("/admin");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      toast.error(error.message || "Failed to log in. Ensure your server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-[90vh] flex items-center justify-center bg-background/50">
      <div className="w-full max-w-[450px] px-6 mx-auto">
        <AnimatedSection>
          {/* Custom Elegant Header */}
          <div className="text-center mb-8">
            <span className="font-mono text-xs text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              // secure portal
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
              Administrator Login
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Verify your administrator credentials to access the console dashboard.
            </p>
          </div>

          {/* Glassmorphic Clean Card */}
          <div className="bg-card/45 backdrop-blur-md border border-border/80 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Subtle Top Ambient Gradient */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input Field */}
              <div className="space-y-2">
                <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background/50 border border-border/70 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-sans"
                    placeholder="e.g. adebanjom16@gmail.com"
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div className="space-y-2">
                <label className="block font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Admin Security Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/60">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background/50 border border-border/70 rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-sans"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground/75 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mt-4 shadow-md font-semibold"
              >
                {loading ? "Decrypting Key..." : "Unlock Console Dashboard"} <ArrowRight size={15} />
              </button>

              {/* Separator */}
              <div className="relative flex items-center justify-center py-2">
                <span className="absolute bg-card px-3 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
                  or authenticate via
                </span>
                <div className="w-full border-t border-border/70"></div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = `${API_URL}/auth/google`;
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-background border border-border/60 hover:bg-secondary/40 text-muted-foreground hover:text-foreground text-xs py-2.5 rounded-xl transition-all hover:scale-[1.005]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default AdminLogin;
