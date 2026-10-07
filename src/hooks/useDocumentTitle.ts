import { useEffect } from 'react';

/** Sets the tab title and meta description for the current page. */
export function useDocumentTitle(title: string, description?: string): void {
  useEffect(() => {
    document.title = title === 'Home' ? 'FF Battle Arena | Free Fire Tournament Platform' : `${title} | FF Battle Arena`;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
