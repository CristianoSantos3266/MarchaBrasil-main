'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'
import { updatePassword } from '@/lib/supabase'
import { isStrongPassword, PASSWORD_HELP_PT } from '@/lib/validation'
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const strongPw = isStrongPassword(password)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  useEffect(() => {
    // Check if we have the necessary auth tokens in the URL
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      setMessage('Link de recuperação inválido ou expirado. Solicite um novo link.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      setMessage('Por favor, preencha todos os campos.')
      return
    }

    if (!strongPw) {
      setMessage('A senha não atende aos critérios de segurança.')
      return
    }
    
    if (!passwordsMatch) {
      setMessage('As senhas não coincidem.')
      return
    }
    
    setLoading(true)
    setMessage('')

    try {
      const { error } = await updatePassword(password)
      
      if (error) {
        if (error.message?.includes('fetch')) {
          setMessage('Erro de conexão. Verifique sua internet e tente novamente.')
        } else {
          setMessage(error.message || 'Erro ao atualizar senha')
        }
        return
      }
      
      setSuccess(true)
      setMessage('Senha atualizada com sucesso! Redirecionando para o login...')
      
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      
    } catch (error: any) {
      setMessage(error.message || 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
        <Navigation />
        
        <div className="max-w-md mx-auto pt-20 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Senha Atualizada!
              </h1>
              <p className="text-gray-600">
                Sua senha foi alterada com sucesso
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm text-center">
                ✓ Senha redefinida com sucesso<br/>
                Redirecionando para o login...
              </p>
            </div>

            <Link
              href="/login"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-center block"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <LockClosedIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Nova Senha
            </h1>
            <p className="text-gray-600">
              Digite sua nova senha abaixo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  password && !strongPw ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {password && !strongPw && (
                <div className="mt-2 text-sm text-red-600">
                  {PASSWORD_HELP_PT}
                </div>
              )}
              {password && strongPw && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ Senha forte
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  confirmPassword && !passwordsMatch ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {confirmPassword && !passwordsMatch && (
                <div className="mt-2 text-sm text-red-600">
                  As senhas não coincidem
                </div>
              )}
              {passwordsMatch && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ Senhas coincidem
                </div>
              )}
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
              disabled={loading || !strongPw || !passwordsMatch}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}