'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'
import { signIn, signUp } from '@/lib/supabase'
import { DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password)
        if (error) throw error
        
        if (data.user) {
          if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
            setMessage('✅ Conta criada com sucesso! (Modo demonstração - login automático habilitado)')
            // Auto redirect in demo mode after showing success
            setTimeout(() => {
              router.push('/')
            }, 2000)
          } else {
            setMessage('Conta criada com sucesso! Verifique seu email para confirmar.')
          }
        }
      } else {
        const { data, error } = await signIn(email, password)
        if (error) throw error
        
        if (data.user) {
          router.push('/')
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      if (error.message === 'Supabase not configured') {
        setMessage('Sistema de autenticação temporariamente indisponível. Tente novamente mais tarde.')
      } else if (error.message === 'Failed to fetch') {
        setMessage('Erro de conexão. Verifique sua internet e tente novamente.')
      } else {
        setMessage(error.message || 'Erro ao fazer login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🇧🇷</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Junte-se à plataforma de mobilização cívica' 
                : 'Acesse sua conta para organizar manifestações'
              }
            </p>
            {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
              <div className="mt-3 p-2 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-sm text-blue-700">
                  🧪 <strong>Modo Demonstração</strong> - Todas as funcionalidades estão ativas para teste
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            {message && (
              <div className={`p-4 rounded-md text-sm ${
                message.includes('sucesso') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-md font-medium hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Registre-se'}
              </button>
            </div>
          </form>

          {isSignUp && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Próximos Passos
              </h3>
              <p className="text-sm text-blue-700">
                Após criar sua conta, você poderá <Link href="/criar-perfil" className="underline">criar um perfil de organizador</Link> para começar a organizar manifestações.
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              Seus dados são protegidos e não são compartilhados publicamente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}