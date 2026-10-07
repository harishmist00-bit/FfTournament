import { useEffect, useRef, type ReactNode } from 'react';
import { Panel } from './Panel';
import { countUp } from '@/animations/scrollAnimations';

interface Props { icon: ReactNode; label: string; value: number; prefix?: string; suffix?: string }

export function StatCard({ icon, label, value, prefix = '', suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => `${prefix}${n.toLocaleString('en-IN')}${suffix}`;
  useEffect(() => (ref.current ? countUp(ref.current, value, fmt) : undefined), [value, prefix, suffix]); // eslint-disable-line
  return (
    <Panel hover innerClassName="flex items-center gap-4 p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center border border-neon/50 bg-neon/10 text-neon">{icon}</span>
      <div>
        <span ref={ref} className="block font-hud text-3xl font-black text-white sm:text-4xl">{fmt(value)}</span>
        <span className="text-sm uppercase tracking-widest text-dim">{label}</span>
      </div>
    </Panel>
  );
}
