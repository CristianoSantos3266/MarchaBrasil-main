'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';

interface SupportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportShareModal({ isOpen, onClose }: SupportShareModalProps) {
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

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    Compartilhar Marcha Brasil
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Share message */}
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Ajude a espalhar a palavra sobre a Marcha Brasil e fortaleça nossa mobilização cívica:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <p className="text-sm text-gray-600 italic">
                      "{shareText}"
                    </p>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="space-y-3">
                  <button
                    onClick={shareViaWhatsApp}
                    className="w-full flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <span className="text-xl">📱</span>
                    Compartilhar no WhatsApp
                  </button>

                  <button
                    onClick={shareViaTwitter}
                    className="w-full flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <span className="text-xl">🐦</span>
                    Compartilhar no X (Twitter)
                  </button>

                  <button
                    onClick={shareViaFacebook}
                    className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <span className="text-xl">📘</span>
                    Compartilhar no Facebook
                  </button>

                  <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <LinkIcon className="h-5 w-5" />
                    Copiar Link
                  </button>
                </div>

                {/* Impact message */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>💪 Cada compartilhamento conta!</strong><br />
                    Ajude mais 3 amigos a descobrir nossa plataforma
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}