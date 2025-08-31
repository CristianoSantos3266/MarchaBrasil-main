'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div className="max-w-md mx-auto pt-20 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header — no big circle */}
        <div className="text-center mb-8 space-y-2">
          {/* Tiny optional badge (remove this block if not desired) */}
          <div className="inline-flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.96 11.96 0 0 1 3.6 6 12 12 0 0 0 3 9.75c0 5.59 3.82 10.29 9 11.62 5.18-1.33 9-6.03 9-11.62 0-1.31-.21-2.57-.6-3.75h-.15C17.05 6 14.15 4.75 12 2.71" />
            </svg>
            <span>Ambiente seguro</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>
          <p className="text-gray-600">Acesse sua conta</p>
        </div>

        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              required
              autoComplete="email"
              inputMode="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                id="password"
                required
                autoComplete="current-password"
                className="w-full pr-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd(s => !s)}
                className="absolute inset-y-0 right-3 my-1 px-2 text-sm text-gray-600 hover:text-gray-800"
                aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPwd ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <div className="mt-2">
              <a href="/support-redirect" className="text-green-600 hover:text-green-800 text-sm font-medium">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/criar-perfil" className="text-green-600 hover:text-green-800 text-sm font-medium">
            Não tem conta? Criar conta
          </a>
        </div>
      </div>
    </div>
  );
}
