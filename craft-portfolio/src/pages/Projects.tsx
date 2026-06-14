import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard, { Project } from "@/components/ProjectCard";
import ProjectPreviewModal from "@/components/ProjectPreviewModal";
import { toast } from "sonner";
import Screenshot from "@/assets/screenshot.png";
import TeamApp from "@/assets/TeamApp.png";
import mrscar from "@/assets/mrscar.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const filters = ["all", "frontend", "backend", "fullstack"];

const defaultProjects: Project[] = [
  {
    title: "Jeropath International",
    description: "Study abroad agency website connecting students with international education opportunities. Features comprehensive service listings, destination guides, and inquiry forms.",
    image: Screenshot,
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    github: "#",
    live: "#",
    category: "fullstack",
  },
  {
    title: "Team Task Manager",
    description: "Collaborative task management application with real-time updates. Features include dashboard analytics, kanban boards, team chat, calendar scheduling, and user settings.",
    image: TeamApp,
    tags: ["Next.js", "OpenAI", "TypeScript", "Tailwind"],
    github: "#",
    live: "#",
    category: "frontend",
  },
  {
    title: "Car Rental Service",
    description: "Modern car rental platform with booking management, vehicle filtering, and user reviews.",
    image: mrscar,
    tags: ["React", "D3.js", "WebSocket", "Docker"],
    github: "#",
    live: "#",
    category: "fullstack",
  },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // Dynamically fetch projects from Native MongoDB.
  // Whenever the activeFilter state changes, a new API call is made,
  // prompting MongoDB to filter results at the database layer.
  // Falls back to local/default projects if the server is offline or database is empty.
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/projects?category=${activeFilter}`);
        if (!response.ok) {
          throw new Error("Could not retrieve projects from database.");
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          const filtered = defaultProjects.filter(
            p => activeFilter === "all" || p.category === activeFilter
          );
          setProjects(filtered);
        }
      } catch (error: any) {
        console.error("❌ Error loading projects:", error);
        toast.error("Could not load database records. Showing default projects.");
        const filtered = defaultProjects.filter(
          p => activeFilter === "all" || p.category === activeFilter
        );
        setProjects(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeFilter]);

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="// portfolio"
            title="All Projects"
            description="A comprehensive collection of my work across different domains and tech stacks, retrieved live from a native MongoDB database."
          />

          {/* Filters */}
          <AnimatedSection className="mb-10">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`font-mono text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Dynamic Grid / Loader */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-mono text-sm text-muted-foreground">Retrieving live database records...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-mono text-sm text-muted-foreground">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <AnimatedSection key={project.title} delay={i * 0.05}>
                  <ProjectCard project={project} onPreview={setPreviewProject} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProjectPreviewModal project={previewProject} onClose={() => setPreviewProject(null)} />
    </div>
  );
};

export default Projects;