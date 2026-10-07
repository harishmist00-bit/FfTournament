import { useEffect, type RefObject } from 'react';
import { revealSections, staggerCards, rowReveal } from '@/animations/scrollAnimations';

/** Wires scroll animations to elements inside `ref` marked with data-reveal / data-stagger / data-rows. Re-runs when `ready` flips. */
export function useReveal(ref: RefObject<HTMLElement>, ready: unknown = true): void {
  useEffect(() => {
    if (!ref.current || !ready) return;
    const cleanups = [revealSections(ref.current), staggerCards(ref.current), rowReveal(ref.current)];
    return () => cleanups.forEach(c => c());
  }, [ref, ready]);
}
