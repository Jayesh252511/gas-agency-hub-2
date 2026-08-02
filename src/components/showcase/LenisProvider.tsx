import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let lenis: any = null;

    import('lenis')
      .then((module) => {
        const Lenis = module.default;
        lenis = new Lenis({
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);

        const updateRaf = (time: number) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(updateRaf);
        gsap.ticker.lagSmoothing(0);
      })
      .catch(() => {
        // Fallback: standard GSAP ScrollTrigger ticker listener
        const onScroll = () => ScrollTrigger.update();
        window.addEventListener('scroll', onScroll, { passive: true });
      });

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <>{children}</>;
}
