import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({ children, className = "", intensity = 12 }: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: ny * intensity, y: -nx * intensity, gx: (nx + 0.5) * 100, gy: (ny + 0.5) * 100 });
    },
    [intensity]
  );

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0, gx: 50, gy: 50 }), []);

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.4 }}
      style={{ transformStyle: "preserve-3d", perspective: 800, willChange: "transform" }}
      className={`relative ${className}`}
    >
      {/* Specular glint that follows mouse */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
          mixBlendMode: "overlay",
        }}
      />
      {children}
    </motion.div>
  );
}
