import { useEffect, useRef, useState, useCallback } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafId = useRef<number>(0);

  const updateCursor = useCallback(() => {
    const { x, y } = pos.current;
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
    }
    if (ringRef.current) {
      const size = hovering ? 48 : 32;
      ringRef.current.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
      ringRef.current.style.width = `${size}px`;
      ringRef.current.style.height = `${size}px`;
    }
  }, [hovering]);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateCursor);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]")) {
        setHovering(true);
      }
    };

    const handleOut = () => setHovering(false);
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [updateCursor]);

  useEffect(() => {
    updateCursor();
  }, [hovering, updateCursor]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference will-change-transform"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.15s" }}
      >
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform"
        style={{
          opacity: visible ? 0.5 : 0,
          transition: "opacity 0.15s, width 0.2s ease-out, height 0.2s ease-out",
        }}
      >
        <div className="w-full h-full rounded-full border border-primary/60" />
      </div>

      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
};

export default CustomCursor;
