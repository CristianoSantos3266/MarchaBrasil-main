'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  MapPinIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  QuestionMarkCircleIcon,
  WrenchScrewdriverIcon,
  LockClosedIcon,
  UserCircleIcon,
  ChevronDownIcon,
  HandRaisedIcon,
  FilmIcon
} from '@heroicons/react/24/outline'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, userProfile, signOut } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }

  const getUserDisplayName = () => {
    return userProfile?.public_name || userProfile?.name || user?.email?.split('@')[0] || 'Usuário'
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]?.toUpperCase()).slice(0, 2).join('')
  }

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

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
              href="/videos" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors flex items-center gap-2"
            >
              <FilmIcon className="h-5 w-5" />
              Vídeos
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
            
            <Link 
              href="/como-agir" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors flex items-center gap-2"
            >
              <HandRaisedIcon className="h-5 w-5" />
              Como Agir
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
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {getUserInitials(getUserDisplayName())}
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Online
                    </div>
                  </div>
                  
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {getUserInitials(getUserDisplayName())}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                          {userProfile?.role === 'admin' && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="inline h-4 w-4 mr-2" />
                        Meu Perfil
                      </Link>
                      
                      {userProfile?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <WrenchScrewdriverIcon className="inline h-4 w-4 mr-2" />
                          Painel Admin
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LockClosedIcon className="inline h-4 w-4 mr-2" />
                        Sair da Conta
                      </button>
                    </div>
                  </div>
                )}
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
                href="/videos" 
                className="text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FilmIcon className="h-5 w-5" />
                Vídeos
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
              
              <Link 
                href="/como-agir" 
                className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <HandRaisedIcon className="h-5 w-5" />
                Como Agir
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
                  <div className="flex items-center space-x-3 px-2 py-2 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {getUserInitials(getUserDisplayName())}
                      </div>
                      {/* Online Status Indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Online
                      </div>
                      {userProfile?.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircleIcon className="h-4 w-4" />
                    Meu Perfil
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LockClosedIcon className="h-4 w-4" />
                    Sair da Conta
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