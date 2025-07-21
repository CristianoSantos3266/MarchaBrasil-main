'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  MapPinIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  QuestionMarkCircleIcon,
  WrenchScrewdriverIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, userProfile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md border-b-2 border-green-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">🇧🇷</span>
            <span className="text-xl font-bold text-gray-900">
              Marcha Brasil
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/create-event" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors flex items-center gap-2"
            >
              <MapPinIcon className="h-5 w-5" />
              Criar Manifestação
            </Link>
            
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
            >
              <CalendarIcon className="h-5 w-5" />
              Manifestações Confirmadas
            </Link>
            
            <Link 
              href="/doar" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-2"
            >
              <CurrencyDollarIcon className="h-5 w-5" />
              Apoie a Causa
            </Link>
            
            <Link 
              href="/faq" 
              className="text-gray-700 hover:text-gray-600 font-medium transition-colors flex items-center gap-2"
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
              FAQ
            </Link>
            
            {user && userProfile?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors flex items-center gap-2"
              >
                <WrenchScrewdriverIcon className="h-5 w-5" />
                Admin
              </Link>
            )}
            
            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Olá, {userProfile?.public_name || userProfile?.name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <LockClosedIcon className="h-5 w-5" />
                Entrar / Criar Conta
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/create-event" 
                className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPinIcon className="h-5 w-5" />
                Criar Manifestação
              </Link>
              
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <CalendarIcon className="h-5 w-5" />
                Manifestações Confirmadas
              </Link>
              
              <Link 
                href="/doar" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <CurrencyDollarIcon className="h-5 w-5" />
                Apoie a Causa
              </Link>
              
              <Link 
                href="/faq" 
                className="text-gray-700 hover:text-gray-600 font-medium py-2 transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                FAQ
              </Link>
              
              {user && userProfile?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-gray-700 hover:text-red-600 font-medium py-2 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <WrenchScrewdriverIcon className="h-5 w-5" />
                  Admin
                </Link>
              )}
              
              {user ? (
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600 pb-2">
                    {userProfile?.public_name || userProfile?.name || user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg font-bold text-center mt-2 flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LockClosedIcon className="h-5 w-5" />
                  Entrar / Criar Conta
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}