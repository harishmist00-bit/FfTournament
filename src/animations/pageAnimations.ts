import { gsap, reducedMotion } from './motion';

export function navbarEntrance(el: HTMLElement): void {
  if (reducedMotion()) return;
  gsap.from(el, { yPercent: -100, opacity: 0, duration: 0.7, ease: 'power3.out' });
}

/** Fades a routed page in. Safe to call on every route change. */
export function pageEnter(el: HTMLElement): void {
  if (reducedMotion()) return;
  gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all' });
}

export function mobileMenu(el: HTMLElement, open: boolean): void {
  if (reducedMotion()) { gsap.set(el, { autoAlpha: open ? 1 : 0, height: open ? 'auto' : 0 }); return; }
  if (open) {
    gsap.fromTo(el, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
    gsap.from(el.querySelectorAll('a, button'), { x: -20, opacity: 0, stagger: 0.04, duration: 0.3, delay: 0.1 });
  } else {
    gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.25, ease: 'power2.in' });
  }
}
