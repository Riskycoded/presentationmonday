import { useState } from "react";
import { Mail, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit message.");
      }

      toast.success("Message sent successfully! You'll receive an email confirmation shortly.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      console.error("❌ Form submit error:", error);
      toast.error(error.message || "Failed to send message. Is the backend running?");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="// contact"
            title="Get In Touch"
            description="Have a project in mind or just want to chat? Feel free to reach out."
          />

          <div className="grid md:grid-cols-5 gap-12">
            {/* Form */}
            <AnimatedSection className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-mono text-xs text-muted-foreground mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted-foreground mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Message"} <Send size={14} />
                </button>
              </form>
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection delay={0.2} className="md:col-span-2 space-y-8">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
                <div className="space-y-3">
                  <a href="mailto:hello@alexchen.dev" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail size={16} className="text-primary" /> adebanjom16@gmail.com
                  </a>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin size={16} className="text-primary" /> Lagos, Nigeria
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Availability</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">Open to opportunities</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Socials</h3>
                <div className="flex gap-4">
                  <a href="https://github.com/riskycoded" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="GitHub">
                    <Github size={18} />
                  </a>
                  <a href="www.linkedin.com/in/adebanjo-michael-2b2b971b5" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                  <a href="https://x.com/markerinemk?s=21" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" aria-label="Twitter">
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
