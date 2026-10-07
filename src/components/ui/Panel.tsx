import type { ReactNode } from 'react';

interface Props { children: ReactNode; className?: string; hover?: boolean; innerClassName?: string }

/** Angular clipped panel with a glowing gradient edge. */
export function Panel({ children, className = '', innerClassName = '', hover }: Props) {
  return (
    <div className={`group panel-wrap ${hover ? 'panel-hover' : ''} ${className}`}>
      <div className="panel-edge h-full">
        <div className={`panel-in ${innerClassName}`}>{children}</div>
      </div>
    </div>
  );
}
