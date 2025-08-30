'use client'

import useSWR from 'swr'
import { useState } from 'react'
import {
  CalendarIcon,
  MapPinIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Event {
  id: string
  title: string
  date: string
  location?: string
  city?: string
  region?: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  approved?: boolean
  users?: {
    public_name?: string
    email?: string
    whatsapp?: string
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'x-user-email': 'cristiano@marchabrasil.com'
    }
  })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function AdminEventsPage() {
  const { data: events, error, mutate } = useSWR<{ data: Event[] }>('/api/admin/events/pending', fetcher)
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({})

  const handleApprove = async (eventId: string) => {
    setSubmitting(prev => ({ ...prev, [eventId]: true }))
    try {
      const res = await fetch(`/api/admin/events/${eventId}/approve`, {
        method: 'POST',
        headers: {
          'x-user-email': 'cristiano@marchabrasil.com'
        }
      })
      if (res.ok) {
        await mutate()
      }
    } catch (error) {
      console.error('Error approving event:', error)
    } finally {
      setSubmitting(prev => ({ ...prev, [eventId]: false }))
    }
  }

  const handleReject = async (eventId: string) => {
    setSubmitting(prev => ({ ...prev, [eventId]: true }))
    try {
      const res = await fetch(`/api/admin/events/${eventId}/reject`, {
        method: 'POST',
        headers: {
          'x-user-email': 'cristiano@marchabrasil.com'
        }
      })
      if (res.ok) {
        await mutate()
      }
    } catch (error) {
      console.error('Error rejecting event:', error)
    } finally {
      setSubmitting(prev => ({ ...prev, [eventId]: false }))
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Aprovação de Eventos</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erro ao carregar eventos pendentes</p>
        </div>
      </div>
    )
  }

  if (!events) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Aprovação de Eventos</h1>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Carregando eventos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Aprovação de Eventos</h1>
        <p className="text-gray-600 mt-2">Eventos pendentes aguardando aprovação</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        {events.data.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento pendente</h3>
            <p className="text-gray-500">Não há eventos aguardando aprovação</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Local
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.data.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {event.location || `${event.city || ''}, ${event.region || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Não informado'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {event.description || 'Sem descrição'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(event.id)}
                          disabled={submitting[event.id]}
                          className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckIcon className="h-4 w-4" />
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleReject(event.id)}
                          disabled={submitting[event.id]}
                          className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XMarkIcon className="h-4 w-4" />
                          Rejeitar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}