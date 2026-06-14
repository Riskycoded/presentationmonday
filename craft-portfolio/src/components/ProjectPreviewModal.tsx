import { X, ExternalLink, Github, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "./ProjectCard";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface ProjectPreviewModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectPreviewModal = ({ project, onClose }: ProjectPreviewModalProps) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card border border-border rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-lg text-foreground">{project.title}</h2>
              <div className="flex items-center gap-3">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={18} />
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </a>
                )}
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              {/* Interactive Preview area */}
              <BeforeAfterSlider after={project.image} afterLabel={project.title} />

              <p className="text-muted-foreground">{project.description}</p>

              {/* Tech Stack */}
              <div>
                <h3 className="font-mono text-sm text-primary mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Role & Outcome */}
              {project.role && (
                <div>
                  <h3 className="font-mono text-sm text-primary mb-1">My Role</h3>
                  <p className="text-sm text-muted-foreground">{project.role}</p>
                </div>
              )}
              {project.outcome && (
                <div>
                  <h3 className="font-mono text-sm text-primary mb-1">Outcome</h3>
                  <p className="text-sm text-muted-foreground">{project.outcome}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectPreviewModal;
