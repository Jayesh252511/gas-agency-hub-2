'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Singleton Lenis instance accessible globally
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisInstance = lenis;

    // Proxy Lenis scroll into GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive GSAP ticker from Lenis RAF
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisInstance = null;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <>{children}</>;
}
