'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { confirmEventAttendance, checkUserAttendanceConfirmation } from '@/lib/supabase'
import { CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/solid'
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from '@heroicons/react/24/outline'

interface AttendanceConfirmationProps {
  eventId: string
  confirmedCount?: number
  estimatedFromSource?: number
  sourceName?: string
  sourceUrl?: string
}

export default function AttendanceConfirmation({
  eventId,
  confirmedCount = 0,
  estimatedFromSource,
  sourceName,
  sourceUrl
}: AttendanceConfirmationProps) {
  const { user } = useAuth()
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentCount, setCurrentCount] = useState(confirmedCount)
  const [checkingConfirmation, setCheckingConfirmation] = useState(true)

  // Check if user has already confirmed attendance
  useEffect(() => {
    const checkConfirmation = async () => {
      if (!user?.id) {
        setCheckingConfirmation(false)
        return
      }

      try {
        const { data } = await checkUserAttendanceConfirmation(eventId, user.id)
        setHasConfirmed(!!data)
      } catch (error) {
        console.error('Error checking confirmation:', error)
      } finally {
        setCheckingConfirmation(false)
      }
    }

    checkConfirmation()
  }, [eventId, user?.id])

  const handleConfirmAttendance = async () => {
    if (!user?.id || isLoading || hasConfirmed) return

    setIsLoading(true)
    try {
      const { data, error } = await confirmEventAttendance(eventId, user.id)
      
      if (error) {
        if (error.message === 'User already confirmed attendance') {
          setHasConfirmed(true)
        } else {
          alert('Erro ao confirmar presença. Tente novamente.')
        }
        return
      }

      setHasConfirmed(true)
      setCurrentCount(prev => prev + 1)
    } catch (error) {
      console.error('Error confirming attendance:', error)
      alert('Erro ao confirmar presença. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UserGroupIcon className="h-5 w-5 text-blue-600" />
        Estimativa de Participação
      </h3>

      <div className="space-y-4">
        {/* Confirmed Count */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div>
            <div className="text-2xl font-bold text-green-700">
              {currentCount.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-green-600">
              Confirmaram "Eu fui"
            </div>
          </div>
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>

        {/* Official Estimate */}
        {estimatedFromSource && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <div className="text-2xl font-bold text-blue-700">
                {estimatedFromSource.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-blue-600">
                Estimativa oficial
              </div>
              {sourceName && (
                <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                  Fonte: {sourceUrl ? (
                    <a 
                      href={sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      {sourceName}
                      <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  ) : sourceName}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Button */}
        {user ? (
          <div className="pt-2">
            {checkingConfirmation ? (
              <div className="flex items-center justify-center py-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Verificando...</span>
              </div>
            ) : hasConfirmed ? (
              <div className="flex items-center justify-center py-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-700 font-medium">✅ Presença confirmada!</span>
              </div>
            ) : (
              <button
                onClick={handleConfirmAttendance}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    Eu fui neste evento
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="pt-2">
            <div className="text-center py-3 bg-gray-100 rounded-lg">
              <span className="text-gray-600 text-sm">
                Faça login para confirmar sua presença
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info text */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Os números "Eu fui" são baseados nas confirmações dos usuários da plataforma. 
          As estimativas oficiais vêm de fontes jornalísticas confiáveis.
        </p>
      </div>
    </div>
  )
}