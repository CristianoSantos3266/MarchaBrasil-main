'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldExclamationIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Wait for auth to finish loading
      if (loading) return;

      // Check if user is authenticated
      if (!user) {
        setAuthError('Acesso não autorizado. Faça login primeiro.');
        setIsAuthorized(false);
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 3000);
        return;
      }

      // Check if we're in demo mode
      const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';
      
      if (isDemoMode) {
        // In demo mode, allow access for demo admin
        const demoAdminEmails = ['cristiano@marchabrasil.com', 'admin@demo.com'];
        if (demoAdminEmails.includes(user.email || '')) {
          setIsAuthorized(true);
          setAuthError('');
          return;
        } else {
          setAuthError('Em modo demo, apenas emails de admin específicos têm acesso.');
          setIsAuthorized(false);
          setTimeout(() => {
            router.push('/');
          }, 3000);
          return;
        }
      }

      // Check if user email matches admin email via API (production mode)
      try {
        const response = await fetch('/api/admin/check-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userEmail: user.email,
            userId: user.id 
          }),
        });

        const result = await response.json();

        if (response.ok && result.authorized) {
          setIsAuthorized(true);
          setAuthError('');
        } else {
          setAuthError(result.error || 'Acesso negado. Você não tem permissão para acessar esta área.');
          setIsAuthorized(false);
          // Redirect to home page after a short delay
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setAuthError('Erro ao verificar permissões. Tente novamente.');
        setIsAuthorized(false);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    checkAdminAccess();
  }, [user, userProfile, loading, router]);

  // Show loading state
  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verificando Acesso
            </h2>
            <p className="text-gray-600">
              Validando suas credenciais...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <ShieldExclamationIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-4">
              {authError}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-700">
                  Redirecionando para a página inicial em alguns segundos...
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar à Página Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show admin content if authorized
  return <>{children}</>;
}