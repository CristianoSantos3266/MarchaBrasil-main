'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { signIn, signUp } from '@/lib/supabase'
import { DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { refreshProfile } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setMessage('Por favor, preencha todos os campos.')
      return
    }
    
    setLoading(true)
    setMessage('')

    try {
      let result;
      
      if (isSignUp) {
        result = await signUp(email, password)
        if (result.error) {
          // Handle network errors specifically
          if (result.error.message?.includes('fetch')) {
            setMessage('Erro de conexão. Verifique sua internet e tente novamente.')
          } else {
            setMessage(result.error.message || 'Erro ao criar conta')
          }
          return
        }
        setMessage('Conta criada com sucesso! Redirecionando...')
      } else {
        result = await signIn(email, password)
        if (result.error) {
          // Handle network errors specifically
          if (result.error.message?.includes('fetch') || result.error.message?.includes('NetworkError')) {
            setMessage('Erro de conexão. Verifique sua internet e tente novamente.')
          } else {
            setMessage(result.error.message || 'Erro ao fazer login')
          }
          return
        }
        setMessage('Login realizado com sucesso! Redirecionando...')
      }

      // In demo mode, the signIn/signUp functions handle the demo user creation
      // Store user data for AuthContext to pick up
      if (result.data?.user) {
        const demoUser = {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.email?.split('@')[0] || 'User',
          public_name: result.data.user.email?.split('@')[0] || 'User',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        localStorage.setItem('demo-user', JSON.stringify(demoUser))
        
        // Dispatch event to notify AuthContext
        window.dispatchEvent(new CustomEvent('demo-user-updated'))
      }
      
      // Navigate after a short delay
      setTimeout(() => {
        router.push('/')
      }, 1000)
      
    } catch (error: any) {
      setMessage(error.message || 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <ShieldCheckIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Junte-se à comunidade cívica' 
                : 'Acesse sua conta'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-sm ${
                message.includes('sucesso') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              {isSignUp 
                ? 'Já tem uma conta? Fazer login' 
                : 'Não tem conta? Criar agora'
              }
            </button>
          </div>

          {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Modo Demonstração</p>
                    <p>Esta é uma versão de demonstração. Use qualquer email/senha para testar.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}