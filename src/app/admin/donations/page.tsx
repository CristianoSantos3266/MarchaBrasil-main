'use client'

import { useState, useEffect } from 'react'
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CreditCardIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Donation {
  id: string
  donorName: string
  donorEmail: string
  amount: number
  method: 'pix' | 'credit_card' | 'bank_transfer'
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  date: string
  eventId?: string
  eventTitle?: string
  transactionId: string
  fees: number
  netAmount: number
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed' | 'refunded'>('all')
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    // Mock donations data
    setDonations([
      {
        id: '1',
        donorName: 'Ana Silva Martins',
        donorEmail: 'ana.martins@email.com',
        amount: 50.00,
        method: 'pix',
        status: 'completed',
        date: '2024-07-20T14:30:00Z',
        eventId: 'evt1',
        eventTitle: 'Manifestação pela Democracia - SP',
        transactionId: 'PIX_20240720_001',
        fees: 0.50,
        netAmount: 49.50
      },
      {
        id: '2',
        donorName: 'Carlos Eduardo Santos',
        donorEmail: 'carlos.santos@email.com',
        amount: 100.00,
        method: 'credit_card',
        status: 'completed',
        date: '2024-07-19T16:45:00Z',
        transactionId: 'CC_20240719_002',
        fees: 4.99,
        netAmount: 95.01
      },
      {
        id: '3',
        donorName: 'Maria Fernanda Lima',
        donorEmail: 'maria.lima@email.com',
        amount: 25.00,
        method: 'pix',
        status: 'pending',
        date: '2024-07-22T09:15:00Z',
        eventId: 'evt2',
        eventTitle: 'Carreata Patriótica - RJ',
        transactionId: 'PIX_20240722_003',
        fees: 0.25,
        netAmount: 24.75
      },
      {
        id: '4',
        donorName: 'Roberto Oliveira Costa',
        donorEmail: 'roberto.costa@email.com',
        amount: 200.00,
        method: 'bank_transfer',
        status: 'completed',
        date: '2024-07-18T11:20:00Z',
        transactionId: 'TED_20240718_004',
        fees: 5.00,
        netAmount: 195.00
      },
      {
        id: '5',
        donorName: 'Juliana Alves Souza',
        donorEmail: 'juliana.souza@email.com',
        amount: 75.00,
        method: 'credit_card',
        status: 'failed',
        date: '2024-07-21T13:30:00Z',
        transactionId: 'CC_20240721_005',
        fees: 3.74,
        netAmount: 71.26
      }
    ])
  }, [])

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter
    
    // Date filtering
    const donationDate = new Date(donation.date)
    const now = new Date()
    const daysDiff = (now.getTime() - donationDate.getTime()) / (1000 * 3600 * 24)
    
    let matchesDate = true
    if (dateFilter === '7d') matchesDate = daysDiff <= 7
    else if (dateFilter === '30d') matchesDate = daysDiff <= 30
    else if (dateFilter === '90d') matchesDate = daysDiff <= 90
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      completed: 'Concluída',
      pending: 'Pendente',
      failed: 'Falhada',
      refunded: 'Reembolsada'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getMethodIcon = (method: string) => {
    const icons = {
      pix: '💳',
      credit_card: '💳',
      bank_transfer: '🏦'
    }
    return icons[method as keyof typeof icons] || '💰'
  }

  const getMethodLabel = (method: string) => {
    const labels = {
      pix: 'PIX',
      credit_card: 'Cartão de Crédito',
      bank_transfer: 'Transferência Bancária'
    }
    return labels[method as keyof typeof labels] || method
  }

  // Calculate stats
  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0)
  const completedAmount = filteredDonations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.netAmount, 0)
  const totalFees = filteredDonations.reduce((sum, d) => sum + d.fees, 0)
  const pendingCount = filteredDonations.filter(d => d.status === 'pending').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          Gerenciar Doações
        </h1>
        <p className="text-gray-600 mt-2">Monitoramento e administração de doações da plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">Total Arrecadado</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {completedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <BanknotesIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total de Doações</p>
              <p className="text-2xl font-bold text-blue-600">{filteredDonations.length}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 text-sm font-medium">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 text-sm font-medium">Taxas Totais</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {totalFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou ID da transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Todos os Status</option>
              <option value="completed">Concluídas</option>
              <option value="pending">Pendentes</option>
              <option value="failed">Falhadas</option>
              <option value="refunded">Reembolsadas</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Todas as Datas</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Doações ({filteredDonations.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {donation.donorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                        <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {donation.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500">
                      Líquido: R$ {donation.netAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <span className="mr-1">{getMethodIcon(donation.method)}</span>
                      {getMethodLabel(donation.method)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(donation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donation.date).toLocaleDateString('pt-BR')}
                    <div className="text-xs text-gray-400">
                      {new Date(donation.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.eventTitle ? (
                      <div className="text-sm text-gray-900 max-w-32 truncate" title={donation.eventTitle}>
                        {donation.eventTitle}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Doação geral</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedDonation(donation)}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Ver detalhes"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes da Doação</h3>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-gray-900">
                  R$ {selectedDonation.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h4>
                {getStatusBadge(selectedDonation.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Informações do Doador</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Nome:</span>
                      <span className="text-sm text-gray-900">{selectedDonation.donorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">{selectedDonation.donorEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Detalhes da Transação</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="text-sm text-gray-900 font-mono">{selectedDonation.transactionId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Método:</span>
                      <span className="text-sm text-gray-900">{getMethodLabel(selectedDonation.method)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Data:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedDonation.date).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Resumo Financeiro</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor bruto:</span>
                    <span className="text-sm font-medium text-gray-900">
                      R$ {selectedDonation.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxas:</span>
                    <span className="text-sm text-red-600">
                      -R$ {selectedDonation.fees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm font-medium text-gray-900">Valor líquido:</span>
                    <span className="text-sm font-bold text-green-600">
                      R$ {selectedDonation.netAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {selectedDonation.eventTitle && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Evento Relacionado</h5>
                  <p className="text-sm text-gray-700">{selectedDonation.eventTitle}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}