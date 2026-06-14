import { useRef } from "react";

interface BeforeAfterSliderProps {
  after: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({ after, afterLabel = "Project" }: BeforeAfterSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden rounded-lg"
    >
      <img src={after} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
};

export default BeforeAfterSlider;
