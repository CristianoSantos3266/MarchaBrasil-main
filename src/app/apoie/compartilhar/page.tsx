'use client';

import Link from 'next/link';
import { ArrowLeftIcon, ShareIcon, LinkIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function CompartilharPage() {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://marchabrasil.com/apoie';
  const shareText = 'Apoie a Marcha Brasil - coordenação cívica pacífica. Junte-se a nós:';

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareViaTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/apoie"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Voltar
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Compartilhar Marcha Brasil
              </h1>
              <p className="text-gray-600 mt-1">
                Ajude a espalhar nossa causa e fortaleça nossa mobilização
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Share Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 text-center">
            <ShareIcon className="h-16 w-16 mx-auto mb-4 text-green-100" />
            <h2 className="text-2xl font-bold mb-2">Espalhe a Palavra</h2>
            <p className="text-green-100">
              Cada compartilhamento fortalece nossa voz coletiva
            </p>
          </div>

          <div className="p-8">
            {/* Share message preview */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Mensagem que será compartilhada:</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 italic">
                  "{shareText}"
                </p>
                <p className="text-blue-600 mt-2 font-medium">{shareUrl}</p>
              </div>
            </div>

            {/* Share buttons */}
            <div className="space-y-4">
              <button
                onClick={shareViaWhatsApp}
                className="w-full flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-2xl">📱</div>
                <div className="text-left flex-1">
                  <div className="text-lg">Compartilhar no WhatsApp</div>
                  <div className="text-green-100 text-sm">Envie para seus contatos e grupos</div>
                </div>
              </button>

              <button
                onClick={shareViaTwitter}
                className="w-full flex items-center gap-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-2xl">🐦</div>
                <div className="text-left flex-1">
                  <div className="text-lg">Compartilhar no X (Twitter)</div>
                  <div className="text-blue-100 text-sm">Publique para seus seguidores</div>
                </div>
              </button>

              <button
                onClick={shareViaFacebook}
                className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-2xl">📘</div>
                <div className="text-left flex-1">
                  <div className="text-lg">Compartilhar no Facebook</div>
                  <div className="text-blue-100 text-sm">Publique no seu perfil ou grupos</div>
                </div>
              </button>

              <button
                onClick={copyLink}
                className="w-full flex items-center gap-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ClipboardDocumentIcon className="h-6 w-6" />
                <div className="text-left flex-1">
                  <div className="text-lg">{copied ? 'Link Copiado!' : 'Copiar Link'}</div>
                  <div className="text-gray-100 text-sm">Cole em qualquer lugar</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Impact message */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
          <h3 className="text-xl font-bold text-blue-900 mb-2">💪 O Poder do Compartilhamento</h3>
          <p className="text-blue-800 mb-4">
            Cada pessoa que você trouxer fortalece nossa mobilização cívica. 
            Estudos mostram que <strong>1 compartilhamento gera 3 novos apoiadores</strong> em média.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">5.2M</div>
              <div className="text-sm text-blue-700">Alcance médio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-blue-700">Taxa de engajamento</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">3.1x</div>
              <div className="text-sm text-blue-700">Crescimento viral</div>
            </div>
          </div>
        </div>

        {/* Alternative contribution */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Prefere contribuir financeiramente?
          </p>
          <Link
            href="/apoie/contribuir"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Fazer Contribuição
          </Link>
        </div>
      </div>
    </div>
  );
}