'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminEmail } from '@/lib/admin';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth(); // user?.email should exist when logged in

  useEffect(() => {
    if (loading) return;
    const email = user?.email ?? null;
    if (!isAdminEmail(email)) router.replace('/login');
  }, [loading, user, router]);

  if (loading) return null; // or return a spinner/skeleton if you prefer
  return <>{children}</>;
}
