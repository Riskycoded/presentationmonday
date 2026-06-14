import { ExternalLink, Github, Eye } from "lucide-react";
import { motion } from "framer-motion";
import ProgressiveImage from "./ProgressiveImage";

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  live?: string;
  category: string;
  beforeImage?: string;
  afterImage?: string;
  videoUrl?: string;
  role?: string;
  outcome?: string;
}

const ProjectCard = ({ project, onPreview }: { project: Project; onPreview?: (project: Project) => void }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-card border border-border rounded-lg overflow-hidden card-hover"
    >
      <div className="aspect-video bg-secondary overflow-hidden relative">
        <ProgressiveImage
          src={project.image}
          alt={project.title}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {onPreview && (
          <button
            onClick={() => onPreview(project)}
            className="absolute inset-0 flex items-center justify-center bg-background/0 group-hover:bg-background/60 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label={`Preview ${project.title}`}
          >
            <div className="flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs px-4 py-2 rounded-lg">
              <Eye size={14} /> Preview
            </div>
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{project.title}</h3>
          <div className="flex gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Source code">
                <Github size={16} />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Live demo">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
