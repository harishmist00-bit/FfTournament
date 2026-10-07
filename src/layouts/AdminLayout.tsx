import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminHeader } from '@/components/AdminHeader';
import { LoadingSpinner } from '@/components/ui/States';

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="min-h-screen bg-void">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenu={() => setOpen(true)} />
        <main className="p-4 sm:p-6"><Suspense fallback={<LoadingSpinner />}><Outlet /></Suspense></main>
      </div>
    </div>
  );
}
