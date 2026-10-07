import type { MatchStatus, RegistrationStatus } from '@/types';

const STYLE: Record<string, string> = {
  live: 'text-red-300 border-red-500 bg-red-500/15',
  upcoming: 'text-cyan-300 border-cyan-400/80 bg-cyan-400/10',
  completed: 'text-neon border-neon/70 bg-neon/10',
  pending: 'text-amber-300 border-amber-400/80 bg-amber-400/10',
  approved: 'text-neon border-neon/70 bg-neon/10',
  rejected: 'text-red-300 border-red-500 bg-red-500/15',
};

export function StatusBadge({ status }: { status: MatchStatus | RegistrationStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider ${STYLE[status]}`}>
      {status === 'live' && <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />}
      {status}
    </span>
  );
}
