'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div className="max-w-md mx-auto pt-20 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header — ONLY flag + title */}
        <div className="text-center mb-8 space-y-3">
          <div className="text-6xl leading-none select-none" role="img" aria-label="Bandeira do Brasil">🇧🇷</div>
          <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>
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
              <a href="/forgot-password" className="text-green-600 hover:text-green-800 text-sm font-medium">
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
