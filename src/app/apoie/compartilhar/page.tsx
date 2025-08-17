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
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current text-green-100">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
              </svg>
            </div>
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
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="text-lg">Compartilhar no WhatsApp</div>
                  <div className="text-green-100 text-sm">Envie para seus contatos e grupos</div>
                </div>
              </button>

              <button
                onClick={shareViaTwitter}
                className="w-full flex items-center gap-4 bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="text-lg">Compartilhar no X (Twitter)</div>
                  <div className="text-gray-100 text-sm">Publique para seus seguidores</div>
                </div>
              </button>

              <button
                onClick={shareViaFacebook}
                className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
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