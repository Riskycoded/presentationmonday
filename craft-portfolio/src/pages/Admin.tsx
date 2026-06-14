import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit2, LogOut, MessageSquare, Mail, User, Clock, Check } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { toast } from "sonner";

interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  category: string;
  role: string;
  outcome: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Admin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "messages">("projects");
  const navigate = useNavigate();

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    tagsString: "",
    github: "",
    live: "",
    category: "frontend",
    role: "",
    outcome: ""
  });

  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 2.5MB max for reliable MongoDB document transfers
    if (file.size > 2.5 * 1024 * 1024) {
      toast.error("Image is too large. Please select an image under 2.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result as string }));
      toast.success("Image uploaded & encoded successfully!");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    // Intercept Google OAuth redirection token
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("adminToken", urlToken);
      toast.success("Successfully logged in via Google SSO!");
      // Flush query params to clean URL
      navigate("/admin", { replace: true });
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Access unauthorized. Please log in.");
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch Projects
        const projRes = await fetch(`${API_URL}/projects`);
        if (!projRes.ok) throw new Error("Could not load projects.");
        const projData = await projRes.json();
        setProjects(projData);

        // Fetch Messages
        const msgRes = await fetch(`${API_URL}/contacts`, {
          headers: getHeaders()
        });
        if (!msgRes.ok) throw new Error("Could not load messages.");
        const msgData = await msgRes.json();
        setMessages(msgData);
      } catch (error: any) {
        console.error("❌ Data load error:", error);
        toast.error("Failed to sync backend data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: getHeaders()
      });
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
    localStorage.removeItem("adminToken");
    toast.success("Admin session terminated securely.");
    navigate("/");
  };

  const handleEditClick = (project: Project) => {
    setIsEditing(true);
    setEditingId(project._id || null);
    setForm({
      title: project.title,
      description: project.description,
      image: project.image,
      tagsString: project.tags.join(", "),
      github: project.github || "",
      live: project.live || "",
      category: project.category,
      role: project.role || "",
      outcome: project.outcome || ""
    });
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      image: "",
      tagsString: "",
      github: "",
      live: "",
      category: "frontend",
      role: "",
      outcome: ""
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tagsString
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      tags,
      github: form.github,
      live: form.live,
      category: form.category,
      role: form.role,
      outcome: form.outcome
    };

    try {
      if (isEditing && editingId) {
        // PUT Update CRUD Operation
        const response = await fetch(`${API_URL}/projects/${editingId}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to update project.");
        
        toast.success("Project updated successfully!");
        
        setProjects(projects.map(p => p._id === editingId ? { _id: editingId, ...payload } : p));
      } else {
        // POST Create CRUD Operation
        const response = await fetch(`${API_URL}/projects`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to insert project.");
        const result = await response.json();
        
        toast.success("New project created successfully!");
        setProjects([result.data, ...projects]);
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to commit operation.");
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project permanently?")) return;

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });

      if (!response.ok) throw new Error("Failed to delete project.");

      toast.success("Project deleted successfully.");
      setProjects(projects.filter(p => p._id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project.");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/contacts/${id}/read`, {
        method: "PUT",
        headers: getHeaders()
      });

      if (!response.ok) throw new Error("Could not update status.");
      
      toast.success("Message status updated.");
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3" />
        <span className="font-mono text-sm">Syncing console dashboard...</span>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen pb-16">
      <section className="max-w-6xl mx-auto px-4">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-border pb-6">
          <div>
            <SectionHeading
              label="// administrator"
              title="Console Dashboard"
              description="Manage projects and analyze visitor messages securely from the admin console."
            />
            <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                Active Session ID
              </span>
              <span className="bg-secondary px-2.5 py-0.5 rounded border border-border/80 font-mono text-[11px] max-w-[280px] md:max-w-md block truncate select-all" title={localStorage.getItem("adminToken") || ""}>
                {localStorage.getItem("adminToken") || "No active session"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-mono text-xs text-red-500 hover:text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={14} /> Terminate Session
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("projects")}
            className={`font-mono text-sm px-6 py-3 border-b-2 transition-all ${
              activeTab === "projects"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            📁 Projects Directory ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`font-mono text-sm px-6 py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "messages"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare size={14} /> Messages Log ({messages.filter(m => !m.read).length} new)
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-1">
              <AnimatedSection>
                <div className="bg-card border border-border rounded-xl p-5 shadow-lg">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    {isEditing ? <Edit2 size={16} className="text-primary" /> : <Plus size={16} className="text-primary" />}
                    {isEditing ? "Modify Project" : "Add New Project"}
                  </h3>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block font-mono text-xs text-muted-foreground mb-1">Project Title</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        placeholder="e.g. JEROPATH Web App"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-muted-foreground mb-1">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                        placeholder="Brief summary..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-xs text-muted-foreground mb-1">Category</label>
                        <select
                          value={form.category}
                          onChange={e => setForm({ ...form, category: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        >
                          <option value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="fullstack">Full-Stack</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-muted-foreground mb-1">My Role</label>
                        <input
                          type="text"
                          required
                          value={form.role}
                          onChange={e => setForm({ ...form, role: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                          placeholder="e.g. Lead Architect"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-muted-foreground mb-1">Outcome</label>
                      <input
                        type="text"
                        value={form.outcome}
                        onChange={e => setForm({ ...form, outcome: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        placeholder="e.g. Reduced loading speed by 40%..."
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-muted-foreground mb-1.5">Project Banner Image</label>
                      {form.image ? (
                        <div className="relative rounded-lg overflow-hidden border border-border bg-background group h-28">
                          <img
                            src={form.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label
                              htmlFor="project-image-upload"
                              className="cursor-pointer bg-primary text-primary-foreground font-mono text-[10px] px-3 py-1.5 rounded hover:opacity-90 transition-opacity font-semibold"
                            >
                              Change Image
                            </label>
                            <button
                              type="button"
                              onClick={() => setForm(prev => ({ ...prev, image: "" }))}
                              className="bg-red-500 text-white font-mono text-[10px] px-3 py-1.5 rounded hover:bg-red-600 transition-colors font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="project-image-upload"
                          className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-4 cursor-pointer hover:bg-secondary/20 transition-all text-center h-28"
                        >
                          <svg className="w-6 h-6 text-muted-foreground mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-mono text-[11px] text-muted-foreground">Click to upload banner image</span>
                          <span className="text-[9px] text-muted-foreground/50 mt-0.5">JPEG, PNG, WEBP (Max 2.5MB)</span>
                        </label>
                      )}
                      <input
                        type="file"
                        id="project-image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-muted-foreground mb-1">Tags (Comma-Separated)</label>
                      <input
                        type="text"
                        value={form.tagsString}
                        onChange={e => setForm({ ...form, tagsString: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        placeholder="React, TypeScript, Native MongoDB"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-xs text-muted-foreground mb-1">GitHub Link</label>
                        <input
                          type="text"
                          value={form.github}
                          onChange={e => setForm({ ...form, github: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                          placeholder="#"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-muted-foreground mb-1">Live Demo Link</label>
                        <input
                          type="text"
                          value={form.live}
                          onChange={e => setForm({ ...form, live: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                          placeholder="#"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-primary text-primary-foreground font-mono text-xs py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        {isEditing ? "Apply Changes" : "Publish Project"}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="bg-secondary text-muted-foreground font-mono text-xs px-3 py-2.5 rounded-lg hover:text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </AnimatedSection>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.1}>
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                  <div className="p-5 border-b border-border bg-card/50">
                    <h3 className="font-semibold text-foreground">Projects Directory</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {projects.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground font-mono text-sm">
                        No projects found in the directory. Use the editor to add new projects!
                      </div>
                    ) : (
                      projects.map((project) => (
                        <div key={project._id} className="p-5 flex items-center justify-between hover:bg-secondary/35 transition-colors gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-16 h-10 object-cover rounded border border-border"
                            />
                            <div>
                              <h4 className="font-semibold text-sm text-foreground">{project.title}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">{project.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                  {project.category}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  Role: {project.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(project)}
                              className="p-2 bg-secondary/80 border border-border text-muted-foreground hover:text-primary rounded-lg transition-colors"
                              aria-label="Edit project"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(project._id!)}
                              className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
                              aria-label="Delete project"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <AnimatedSection>
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto">
              <div className="p-5 border-b border-border bg-card/50">
                <h3 className="font-semibold text-foreground">Contact Form Messages Log</h3>
              </div>
              <div className="divide-y divide-border">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground font-mono text-sm">
                    No contact form messages have been submitted yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-5 space-y-3 transition-colors ${
                        !msg.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-secondary/20"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                            <User size={13} className="text-primary" /> {msg.name}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail size={13} /> {msg.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                            <Clock size={11} /> {new Date(msg.createdAt).toLocaleString()}
                          </span>
                          {!msg.read && (
                            <button
                              onClick={() => handleMarkAsRead(msg._id)}
                              className="inline-flex items-center gap-1 font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                              <Check size={10} /> Mark read
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground bg-background/50 border border-border/40 p-3 rounded-lg font-sans">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </AnimatedSection>
        )}
      </section>
    </div>
  );
};

export default Admin;
