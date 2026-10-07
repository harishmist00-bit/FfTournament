import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArenaBackground } from '@/components/ArenaBackground';
import { LoadingSpinner } from '@/components/ui/States';
import { pageEnter } from '@/animations/pageAnimations';

export function MainLayout() {
  const ref = useRef<HTMLElement>(null);
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (ref.current) pageEnter(ref.current);
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 120);
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <div className="relative min-h-screen">
      <a href="#main" className="sr-only z-[200] bg-neon px-4 py-2 font-bold text-void focus:not-sr-only focus:fixed focus:left-2 focus:top-2">Skip to content</a>
      <ArenaBackground />
      <Navbar />
      <main id="main" ref={ref} className="relative z-10">
        <Suspense fallback={<div className="pt-40"><LoadingSpinner /></div>}><Outlet /></Suspense>
      </main>
      <Footer />
    </div>
  );
}
