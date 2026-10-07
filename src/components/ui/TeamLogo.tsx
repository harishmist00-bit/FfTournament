import { useId } from 'react';

interface Props { label: string; color: string; size?: number; title?: string }

/** Original generated shield emblem. Used for teams and tournaments until real logos come from the API. */
export function ShieldLogo({ label, color, size = 40, title }: Props) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={title ?? `${label} logo`} className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.45" />
          <stop offset="1" stopColor="#030909" />
        </linearGradient>
      </defs>
      <path d="M24 2 44 9v15c0 12-9 20-20 23C13 44 4 36 4 24V9z" fill={`url(#${id})`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 7 39 12v12c0 9-6 15-15 18" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1" />
      <text x="24" y="29" textAnchor="middle" fontFamily="Oxanium, sans-serif" fontWeight="800" fontStyle="italic" fontSize={label.length > 3 ? 12 : 15} fill="#fff">{label}</text>
    </svg>
  );
}

export const TeamLogo = ({ tag, color, size, name }: { tag: string; color: string; size?: number; name?: string }) =>
  <ShieldLogo label={tag} color={color} size={size} title={name ? `${name} logo` : undefined} />;

export const TournamentLogo = ({ name, color, size }: { name: string; color: string; size?: number }) => {
  const initials = name.split(' ').filter(w => /^[A-Za-z]/.test(w)).map(w => w[0]).join('').slice(0, 3).toUpperCase();
  return <ShieldLogo label={initials} color={color} size={size} title={`${name} logo`} />;
};
