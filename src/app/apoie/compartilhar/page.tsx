'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import Navigation from '@/components/ui/Navigation';

const getHomeUrl = () => {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://marchabrasil.com');
  // ensure exactly one trailing slash
  return base.replace(/\/+$/, '') + '/';
};

export default function CompartilharPage() {
  const [copied, setCopied] = useState(false);

  // ✅ NOW SHARING THE MAIN PAGE, NOT /apoie
  const homeUrl = getHomeUrl();
  const shareText =
    'Apoie a Marcha Brasil - coordenação cívica pacífica. Junte-se a nós:';

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${homeUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareViaTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(homeUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(homeUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(homeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar link:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Navigation */}
      <Navigation />

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
              <h1 className="text-3xl font-bold text-gray-900">Compartilhar Marcha Brasil</h1>
              <p className="text-gray-600 mt-1">
                Ajude a espalhar nossa causa e fortaleça nossa mobilização
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          {/* Card header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/10">
              <ShareIcon className="w-10 h-10 text-green-100" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Espalhe a Palavra</h2>
            <p className="text-green-100">
              Cada compartilhamento fortalece nossa voz coletiva
            </p>
          </div>

          {/* Message preview */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Mensagem que será compartilhada:
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 italic">"{shareText}"</p>
                {/* ✅ shows main page now */}
                <p className="text-blue-600 mt-2 font-medium">{homeUrl}</p>
              </div>
            </div>

            {/* Share actions */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={shareViaWhatsApp}
                className="w-full flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.01 0C5.4 0 .06 5.34.06 11.94c0 2.1.55 4.16 1.6 5.98L0 24l6.25-1.64a12 12 0 0 0 5.76 1.47h.01c6.6 0 11.94-5.34 11.94-11.94 0-3.19-1.24-6.18-3.44-8.41zM12.02 22a9.98 9.98 0 0 1-5.08-1.39l-.36-.21-3.72.98.99-3.63-.24-.37A9.98 9.98 0 1 1 22 12.06 10 10 0 0 1 12.02 22zm5.46-7.47c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.14-.19.27-.74.95-.9 1.13-.17.18-.33.2-.61.07-.3-.15-1.28-.47-2.44-1.49-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.6.14-.14.3-.36.45-.54.15-.18.2-.31.3-.51.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.11 3.22 5.1 4.52.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.75-.72 2-1.42.25-.71.25-1.32.17-1.45-.07-.13-.27-.21-.57-.36z" />
                </svg>
                <div className="text-left flex-1">
                  <div className="text-lg">Compartilhar no WhatsApp</div>
                  <div className="text-green-100 text-sm">
                    Envie para seus contatos e grupos
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={shareViaTwitter}
                className="w-full flex items-center gap-4 bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.87-2.37 8.54 8.54 0 0 1-2.71 1.04A4.25 4.25 0 0 0 11.1 9.2c0 .33.04.65.1.96A12.05 12.05 0 0 1 3 5.63a4.25 4.25 0 0 0 1.32 5.67 4.22 4.22 0 0 1-1.92-.53v.05c0 2.05 1.46 3.76 3.4 4.15-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.73 2.16 2.99 4.06 3.02A8.53 8.53 0 0 1 2 19.54 12.03 12.03 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.35-.02-.53A8.32 8.32 0 0 0 22.46 6z" />
                </svg>
                <div className="text-left flex-1">
                  <div className="text-lg">Compartilhar no X (Twitter)</div>
                  <div className="text-gray-100 text-sm">Publique para seus seguidores</div>
                </div>
              </button>

              <button
                type="button"
                onClick={shareViaFacebook}
                className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.29h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.793.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.765v2.314h3.588l-.467 3.416h-3.12V24h6.117C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
                <div className="text-left flex-1">
                  <div className="text-lg">Compartilhar no Facebook</div>
                  <div className="text-blue-100 text-sm">Publique no seu perfil ou grupos</div>
                </div>
              </button>

              <button
                type="button"
                onClick={copyLink}
                className="w-full flex items-center gap-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                <ClipboardDocumentIcon className="h-6 w-6" />
                <div className="text-left flex-1">
                  <div className="text-lg">
                    {copied ? 'Link Copiado!' : 'Copiar Link'}
                  </div>
                  <div className="text-gray-100 text-sm">Cole em qualquer lugar</div>
                </div>
                <LinkIcon className="h-6 w-6 opacity-75" />
              </button>
            </div>
          </div>
        </div>

        {/* Extra info */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            💪 O Poder do Compartilhamento
          </h3>
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

        {/* Alternate CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Prefere contribuir financeiramente?</p>
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

