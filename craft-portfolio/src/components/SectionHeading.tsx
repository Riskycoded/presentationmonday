import AnimatedSection from "./AnimatedSection";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

const SectionHeading = ({ label, title, description }: SectionHeadingProps) => {
  return (
    <AnimatedSection className="mb-12 md:mb-16">
      <p className="font-mono text-sm text-primary mb-2">{label}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl">{description}</p>
      )}
    </AnimatedSection>
  );
};

export default SectionHeading;
