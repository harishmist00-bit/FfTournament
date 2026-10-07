import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Panel } from './Panel';

interface Props { open: boolean; title: string; onClose: () => void; children: ReactNode }

export function Modal({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-void/80 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg outline-none" onMouseDown={e => e.stopPropagation()}>
        <Panel innerClassName="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-title text-xl text-white">{title}</h2>
            <button onClick={onClose} aria-label="Close dialog" className="text-dim hover:text-neon"><X /></button>
          </div>
          {children}
        </Panel>
      </div>
    </div>
  );
}
