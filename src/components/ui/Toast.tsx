import { useCallback, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

/** Minimal toast: `const { toast, notify } = useToast()` then render `{toast}` once in the page. */
export function useToast(): { toast: ReactNode; notify: (msg: string, kind?: 'ok' | 'error') => void } {
  const [state, setState] = useState<{ msg: string; kind: 'ok' | 'error' } | null>(null);
  const timer = useRef<number>();
  const notify = useCallback((msg: string, kind: 'ok' | 'error' = 'ok') => {
    setState({ msg, kind });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState(null), 3500);
  }, []);
  const toast = state && (
    <div role="status" aria-live="polite" className={`fixed bottom-6 right-4 z-[120] flex max-w-sm items-center gap-2 border px-4 py-3 font-display font-semibold backdrop-blur ${state.kind === 'ok' ? 'border-neon bg-void/90 text-neon' : 'border-red-500 bg-void/90 text-red-300'}`}>
      {state.kind === 'ok' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}{state.msg}
    </div>
  );
  return { toast, notify };
}
