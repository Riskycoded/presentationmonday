import { useState } from "react";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProgressiveImage = ({ src, alt, className = "" }: ProgressiveImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-secondary animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent skeleton-shimmer" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default ProgressiveImage;
