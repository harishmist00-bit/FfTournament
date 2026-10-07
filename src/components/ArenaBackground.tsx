import { useEffect, useMemo, useRef } from 'react';
import { gsap, reducedMotion } from '@/animations/motion';

/** Fixed futuristic backdrop: grid, glows, diagonal bands and drifting particles. CSS + GSAP only. */
export function ArenaBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const dots = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ id: i, x: (i * 37) % 100, y: (i * 53) % 100, s: 2 + (i % 3) })), []);
  useEffect(() => {
    if (reducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.p-dot', { y: 'random(-120, -40)', x: 'random(-30, 30)', opacity: 'random(0.1, 0.7)', duration: 'random(4, 8)', ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: { each: 0.2, from: 'random' } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-0 bg-arena" aria-hidden>
      <div className="grid-bg absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="absolute -left-40 top-1/3 h-[140%] w-24 -rotate-12 bg-gradient-to-b from-neon/15 to-transparent" />
      <div className="absolute right-[8%] top-0 h-[120%] w-px rotate-[14deg] bg-gradient-to-b from-neon/40 to-transparent" />
      {dots.map(d => <span key={d.id} className="p-dot absolute rounded-full bg-neon/60" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s }} />)}
    </div>
  );
}
