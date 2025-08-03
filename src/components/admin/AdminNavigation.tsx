'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

const adminLinks = [
  { href: '/admin', icon: HomeIcon, label: 'Dashboard' },
  { href: '/admin/events', icon: CalendarIcon, label: 'Eventos' },
  { href: '/admin/news', icon: NewspaperIcon, label: 'Notícias' },
  { href: '/admin/organizers', icon: UsersIcon, label: 'Organizadores' },
  { href: '/admin/participants', icon: UsersIcon, label: 'Participantes' },
  { href: '/admin/donations', icon: CurrencyDollarIcon, label: 'Doações' },
  { href: '/admin/moderation', icon: ExclamationTriangleIcon, label: 'Moderação' },
  { href: '/admin/reports', icon: ExclamationTriangleIcon, label: 'Relatórios' },
  { href: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
  { href: '/admin/settings', icon: Cog6ToothIcon, label: 'Configurações' }
]

export default function AdminNavigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar ao Site
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {adminLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu - simplified for now */}
          <div className="md:hidden">
            <select
              value={pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {adminLinks.map((link) => (
                <option key={link.href} value={link.href}>
                  {link.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  )
}