import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Panel } from './Panel';

export const LoadingSpinner = ({ label = 'Loading' }: { label?: string }) => (
  <div role="status" className="flex items-center justify-center gap-3 py-16 text-neon">
    <Loader2 className="animate-spin" aria-hidden /> <span className="font-display uppercase tracking-widest">{label}</span>
  </div>
);

export const SkeletonCard = () => <div className="skeleton clip-cut h-56 w-full" aria-hidden />;

export const SkeletonTable = ({ rows = 6 }: { rows?: number }) => (
  <div className="space-y-2" aria-hidden role="status" aria-label="Loading table">
    {Array.from({ length: rows }, (_, i) => <div key={i} className="skeleton h-12 w-full" />)}
  </div>
);

export const EmptyState = ({ title = 'Nothing here yet', message, action }: { title?: string; message: string; action?: ReactNode }) => (
  <Panel innerClassName="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <Inbox size={40} className="text-neon/70" aria-hidden />
    <h3 className="font-title text-xl text-white">{title}</h3>
    <p className="max-w-md text-dim">{message}</p>
    {action}
  </Panel>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div role="alert"><Panel innerClassName="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <AlertTriangle size={40} className="text-red-400" aria-hidden />
    <h3 className="font-title text-xl text-white">Something went wrong</h3>
    <p className="max-w-md text-dim">{message}</p>
    {onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}
  </Panel></div>
);

interface AsyncViewProps<T> {
  state: { data: T | null; loading: boolean; error: string | null; reload: () => void };
  skeleton?: ReactNode;
  isEmpty?: (d: T) => boolean;
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}
/** Renders the right UI for loading, error, empty and success. */
export function AsyncView<T>({ state, skeleton, isEmpty, empty, children }: AsyncViewProps<T>) {
  if (state.loading && !state.data) return <>{skeleton ?? <LoadingSpinner />}</>;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (!state.data) return null;
  if (isEmpty?.(state.data)) return <>{empty ?? <EmptyState message="No results match your filters." />}</>;
  return <>{children(state.data)}</>;
}
