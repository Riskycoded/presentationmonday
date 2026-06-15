import { Briefcase, Download, Code2, Server, Wrench } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";

const skills = {
  Frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
  Animation: ["Framer Motion"],
  Backend: ["Node.js", "Express", "MongoDB", "REST APIs", "Firebase", "Supabase", "Resend"],
  Tools: ["Git", "Figma", "Docker", "Vercel", "Render", "Netlify"],
};

const experience = [
  {
    role: "Full-Stack Developer",
    company: "Malhub",
    period: "2025 — Present",
    description: "Building responsive web applications, developing RESTful APIs, and implementing modern UI/UX practices. Working with React, TypeScript, Node.js, Express, and MongoDB.",
  },
  {
    role: "Freelance Full-Stack Developer",
    company: "Self-Employed",
    period: "2022 — Present",
    description: "Delivered complete full-stack web solutions for 10+ clients. Built secure web applications, database integrations, and optimized user flows for performance and conversion.",
  },
  {
    role: "Digital Marketing Specialist",
    company: "Freelance",
    period: "2023 — Present",
    description: "Managing campaigns and building landing pages that convert. Combining technical skills with marketing strategy.",
  },
];

const About = () => {
  return (
    <div className="pt-16">
      {/* Intro */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="// about me" title="My Story" />
          <div className="grid md:grid-cols-5 gap-12">
            <AnimatedSection className="md:col-span-3">
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I'm a full-stack developer with a passion for creating scalable, user-intuitive applications and robust backends. With over 3 years of experience in TypeScript, React, Node.js, and MongoDB, I've worked on projects for companies, brands, and agencies.
                </p>
                <p>
                  My journey started with a need to build visually appealing websites for my friends back in school. I specialize in React ecosystems but I'm comfortable with other tools as well.
                </p>
                <p>
                  When I'm not coding, I'm networking and running campaigns as a digital marketer. I also have a cat, Sammy, who I love playing with.
                </p>
              </div>
              <a
                href="/Adebanjo_Michael_Resume.pdf"
                download="Adebanjo_Michael_Resume.pdf"
                className="inline-flex items-center gap-2 mt-6 font-mono text-sm text-primary border border-primary px-5 py-2.5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Download size={16} /> Download Resume
              </a>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="md:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-destructive/60" />
                    <span className="w-3 h-3 rounded-full bg-primary/40" />
                    <span className="w-3 h-3 rounded-full bg-primary/70" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">about.ts</span>
                </div>
                <pre className="font-mono text-sm text-muted-foreground leading-relaxed">
{`const developer = {
  name: "Adebanjo Michael",
  role: "Full-Stack Dev",
  location: "Lagos, Nigeria",
  available: true,
  coffee: "always ☕"
};`}
                </pre>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section-padding bg-card/50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="// skills" title="Technical Expertise" />
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items], i) => {
              const icons = { Frontend: Code2, Backend: Server, Tools: Wrench, Animation: Briefcase };
              const Icon = icons[category as keyof typeof icons];
              return (
                <AnimatedSection key={category} delay={i * 0.1}>
                  <div className="bg-card border border-border rounded-lg p-6 h-full card-hover">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <Icon size={18} />
                      </div>
                      <h3 className="font-semibold text-foreground">{category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span key={skill} className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="// experience" title="Where I've Worked" />
          <div className="space-y-8 max-w-3xl">
            {experience.map((job, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="relative pl-8 border-l-2 border-border hover:border-primary/50 transition-colors">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{job.role}</h3>
                    <span className="text-primary font-mono text-sm">@ {job.company}</span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground mb-2">{job.period}</p>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
