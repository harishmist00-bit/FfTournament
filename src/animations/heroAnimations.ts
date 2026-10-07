import { gsap, reducedMotion } from './motion';

/** Hero intro: heading lines reveal, subtitle fades, buttons slide, art floats and drifts with the pointer. */
export function heroIntro(root: HTMLElement): () => void {
  if (reducedMotion()) return () => undefined;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-hero="label"]', { x: -30, opacity: 0, duration: 0.5 })
      .from('[data-hero="line"]', { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.14 }, '-=0.2')
      .from('[data-hero="sub"]', { y: 18, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('[data-hero="btn"]', { x: -40, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
      .from('[data-hero="art"]', { x: 60, opacity: 0, duration: 0.9 }, 0.2);
    gsap.to('[data-hero="art-float"]', { y: -12, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('[data-hero="shape"]', { y: 'random(-14, 14)', x: 'random(-10, 10)', duration: 'random(3, 5)', ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3 });
  }, root);

  const move = (e: PointerEvent) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    gsap.to('[data-hero="art"]', { x: nx * -18, rotateZ: nx * 1.2, duration: 0.8, overwrite: 'auto' });
    gsap.to('[data-hero="bg"]', { x: nx * 14, y: ny * 10, duration: 1, overwrite: 'auto' });
  };
  window.addEventListener('pointermove', move);
  return () => { window.removeEventListener('pointermove', move); ctx.revert(); };
}
