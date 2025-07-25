'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  FlagIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Eventos', href: '/admin/events', icon: CalendarIcon },
  { name: 'Organizadores', href: '/admin/organizers', icon: UsersIcon },
  { name: 'Participantes', href: '/admin/participants', icon: UserGroupIcon },
  { name: 'Doações', href: '/admin/donations', icon: CurrencyDollarIcon },
  { name: 'Relatórios', href: '/admin/reports', icon: DocumentTextIcon },
  { name: 'Moderação', href: '/admin/moderation', icon: ShieldCheckIcon },
  { name: 'Configurações', href: '/admin/settings', icon: Cog6ToothIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { signOut, userProfile } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render on server to prevent hydration issues
  if (!mounted) {
    return (
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🛡️</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Marcha Brasil</p>
            </div>
          </div>
        </div>
        <div className="p-4 text-center text-gray-500">Loading...</div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🛡️</div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">Marcha Brasil</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive 
                  ? 'bg-green-100 text-green-700 border-r-2 border-green-500' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-green-600' : ''}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Admin Info & Logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {mounted ? (userProfile?.name || 'Admin') : 'Admin'}
            </div>
            <div className="text-xs text-red-600 font-medium">Administrador</div>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <LockClosedIcon className="h-4 w-4" />
          <span>Sair da Conta</span>
        </button>
      </div>

      {/* System Alerts */}
      <div className="border-t border-gray-200 p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-800">Sistema Ativo</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Monitoramento em tempo real
          </p>
        </div>
      </div>
    </div>
  )
}