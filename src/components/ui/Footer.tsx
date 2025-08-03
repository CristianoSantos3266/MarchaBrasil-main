'use client';

import Link from 'next/link';
import { HeartIcon, GlobeAltIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <GlobeAltIcon className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">
              © {currentYear} <span className="font-semibold text-white">Marcha Brasil</span>
              {' '}• Desenvolvido por{' '}
              <span className="font-semibold text-blue-400">AlphaFlare</span>
            </span>
          </div>
          
          {/* Mission Statement */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <HeartIcon className="h-4 w-4 text-red-400" />
            <span>Fortalecendo a democracia brasileira</span>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <a 
              href="mailto:equipe@marchabrasil.com" 
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <EnvelopeIcon className="h-3 w-3" />
              equipe@marchabrasil.com
            </a>
            <a 
              href="https://wa.me/13657671900?text=Olá! Gostaria de mais informações sobre a Marcha Brasil." 
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ChatBubbleLeftRightIcon className="h-3 w-3" />
              WhatsApp: +1 (365) 767-1900
            </a>
          </div>
          
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link 
              href="/termos" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Termos de Uso
            </Link>
            <Link 
              href="/politica-privacidade" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Política de Privacidade (LGPD)
            </Link>
            <Link 
              href="/privacidade" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Segurança & Anti-Censura
            </Link>
          </div>
          
          {/* Peace Disclaimer */}
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-300 text-center font-medium">
              ✌️ A Marcha Brasil apoia EXCLUSIVAMENTE manifestações pacíficas e democráticas
            </p>
          </div>
          
          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center">
            Plataforma apartidária dedicada à organização pacífica de manifestações cívicas. 
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}