'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'
import { resetPassword } from '@/lib/supabase'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Por favor, insira seu email.')
      return
    }
    
    setLoading(true)
    setMessage('')

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        if (error.message?.includes('fetch')) {
          setMessage('Erro de conexão. Verifique sua internet e tente novamente.')
        } else {
          setMessage(error.message || 'Erro ao enviar email de recuperação')
        }
        return
      }
      
      setEmailSent(true)
      setMessage('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.')
      
    } catch (error: any) {
      setMessage(error.message || 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
        <Navigation />
        
        <div className="max-w-md mx-auto pt-20 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                <EnvelopeIcon className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Enviado!
              </h1>
              <p className="text-gray-600">
                Enviamos um link de recuperação para <strong>{email}</strong>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                ✓ Verifique sua caixa de entrada<br/>
                ✓ Procure por um email da Marcha Brasil<br/>
                ✓ Clique no link para redefinir sua senha
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-center block"
              >
                Voltar ao Login
              </Link>
              
              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                  setMessage('')
                }}
                className="w-full text-green-600 hover:text-green-800 py-2 text-sm font-medium"
              >
                Enviar para outro email
              </button>
            </div>
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
              <EnvelopeIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Recuperar Senha
            </h1>
            <p className="text-gray-600">
              Digite seu email e enviaremos um link para redefinir sua senha
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
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}