import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="container-x grid min-h-[70vh] place-items-center pt-24 text-center">
      <div><p className="font-hud text-8xl font-black text-neon">404</p><h1 className="mt-2 font-title text-3xl text-white">Out of the safe zone</h1><p className="mx-auto mt-2 max-w-md text-dim">This page does not exist or has moved. Head back to the arena.</p><div className="mt-6"><Button to="/">Back to home</Button></div></div>
    </div>
  );
}
