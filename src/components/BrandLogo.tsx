import { Link } from 'react-router-dom';

export function BrandLogo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <Link to="/" aria-label="FF Battle Arena home" className="group inline-flex items-center gap-2">
      <svg width={size === 'lg' ? 56 : 44} height={size === 'lg' ? 40 : 32} viewBox="0 0 88 64" aria-hidden className="drop-shadow-[0_0_8px_rgba(57,255,20,.6)]">
        <path d="M6 6h40l-5 11H22l-2 8h18l-4 10H17L12 58H0z" fill="#39FF14" />
        <path d="M48 6h38l-5 11H64l-2 8h18l-4 10H59L54 58H42z" fill="#B7FF00" opacity=".9" />
      </svg>
      <span className="leading-none">
        <span className="block font-title text-lg tracking-wider text-white sm:text-xl">Battle <span className="text-neon">Arena</span></span>
        <span className="block font-display text-[10px] uppercase tracking-[0.35em] text-dim">Free Fire Tournaments</span>
      </span>
    </Link>
  );
}
