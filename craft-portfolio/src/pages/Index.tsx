import Screenshot from "@/assets/screenshot.png";
import TeamApp from "@/assets/TeamApp.png";
import mrscar from "@/assets/mrscar.png";
import { Link } from "react-router-dom";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard, { Project } from "@/components/ProjectCard";
import Michael from "@/assets/image.jpg";

const HeroScene = lazy(() => import("@/components/HeroScene"));

const featuredProjects: Project[] = [
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

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col-reverse md:flex-row items-center section-padding overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <HeroScene />
        </Suspense>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full pt-16 md:pt-16 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-sm text-primary mb-4">Hi, my name is</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4"
          >
            Adebanjo Michael.
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-muted-foreground mb-6"
          >
            I build things for the web.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted-foreground max-w-lg text-lg mb-10"
          >
            Full-stack developer specializing in building exceptional digital experiences.
            Currently focused on building accessible, human-centered products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 items-center"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              View My Work <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-primary text-primary font-mono text-sm px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Get In Touch
            </Link>
          </motion.div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex gap-5 mt-12"
          >
            <a href="https://github.com/riskycoded" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/adebanjo-michael-2b2b971b5" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="https://x.com/markerinemk?s=21" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          </motion.div>
        </div>

        <div className="relative flex justify-center items-center z-20 mb-8 md:mb-0 flex-shrink-0">
          <img
            src={Michael}
            alt="Michael Adebanjo"
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] xl:w-[36rem] xl:h-[36rem] max-w-full max-h-[80vh] rounded-full object-cover mx-auto"
            style={{ background: 'transparent' }}
          />
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="// featured work"
            title="Selected Projects"
            description="A collection of projects that showcase my range across frontend, backend, and full-stack development."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <AnimatedSection key={project.title} delay={i * 0.1}>
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.3} className="mt-10 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline"
            >
              View all projects <ArrowRight size={14} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <p className="font-mono text-sm text-primary mb-4">// what's next</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Let's Work Together</h2>
            <p className="text-muted-foreground mb-8">
              I'm currently open to new opportunities and freelance projects. Whether you have a question or just want to say hi, my inbox is always open.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Say Hello <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
