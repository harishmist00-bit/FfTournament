import { gsap, ScrollTrigger, reducedMotion } from './motion';

const noop = () => undefined;

/** Fades a section up once as it enters the viewport. Mark with data-reveal. */
export function revealSections(root: HTMLElement): () => void {
  if (reducedMotion()) return noop;
  const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return noop;
  const ctx = gsap.context(() => {
    targets.forEach(el => gsap.from(el, { y: 28, opacity: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  }, root);
  return () => ctx.revert();
}

/** Staggers the children of any [data-stagger] container. */
export function staggerCards(root: HTMLElement): () => void {
  if (reducedMotion()) return noop;
  const groups = root.querySelectorAll<HTMLElement>('[data-stagger]');
  if (!groups.length) return noop;
  const ctx = gsap.context(() => {
    groups.forEach(g => gsap.from(g.children, { y: 36, opacity: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: g, start: 'top 90%', once: true } }));
  }, root);
  return () => ctx.revert();
}

/** Slides table rows in from the left. Mark the tbody/container with data-rows. */
export function rowReveal(root: HTMLElement): () => void {
  if (reducedMotion()) return noop;
  const groups = root.querySelectorAll<HTMLElement>('[data-rows]');
  if (!groups.length) return noop;
  const ctx = gsap.context(() => {
    groups.forEach(g => gsap.from(g.children, { x: -24, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', scrollTrigger: { trigger: g, start: 'top 90%', once: true } }));
  }, root);
  return () => ctx.revert();
}

/** Counts a number up when scrolled into view. Returns cleanup. */
export function countUp(el: HTMLElement, target: number, format: (n: number) => string): () => void {
  if (reducedMotion()) { el.textContent = format(target); return noop; }
  const obj = { v: 0 };
  const tween = gsap.to(obj, {
    v: target, duration: 1.6, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    onUpdate: () => { el.textContent = format(Math.round(obj.v)); },
  });
  return () => { tween.scrollTrigger?.kill(); tween.kill(); };
}

/** Parallax drift on elements marked data-parallax="0.2". */
export function parallax(root: HTMLElement): () => void {
  if (reducedMotion()) return noop;
  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
      const speed = Number(el.dataset.parallax) || 0.2;
      gsap.to(el, { yPercent: speed * -40, ease: 'none', scrollTrigger: { trigger: el, scrub: true, start: 'top bottom', end: 'bottom top' } });
    });
  }, root);
  return () => ctx.revert();
}
