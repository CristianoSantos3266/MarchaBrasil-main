'use client';

import { useState } from 'react';
import { ShareIcon, LinkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SocialShareProps {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  participantCount: number;
  imageUrl?: string;
  className?: string;
}

export default function SocialShare({
  eventId,
  eventTitle,
  eventDescription,
  eventDate,
  eventLocation,
  participantCount,
  imageUrl,
  className = ''
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/protest/${eventId}`
    : '';

  const shareText = `🇧🇷 ${eventTitle}\n\n📅 ${eventDate}\n📍 ${eventLocation}\n👥 ${participantCount} já confirmaram presença!\n\nParticipe desta manifestação pacífica em defesa da democracia.`;

  const shareData = {
    title: `${eventTitle} - Marcha Brasil`,
    text: shareText,
    url: shareUrl
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '📱',
      color: 'bg-green-600 hover:bg-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=MarchaBrasil,DemocraciaBrasil`
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <ShareIcon className="h-5 w-5" />
        Compartilhar
      </button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Compartilhar Evento</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Event Preview Card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
              <div className="flex items-start gap-3">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt={eventTitle}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{eventTitle}</h4>
                  <p className="text-xs text-gray-600 mt-1">{eventDate} • {eventLocation}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {participantCount} confirmados • Manifestação Pacífica
                  </p>
                </div>
              </div>
            </div>

            {/* Copy Link */}
            <div className="mb-4">
              <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Platforms */}
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 ${option.color} text-white rounded-lg transition-colors`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="font-medium">{option.name}</span>
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Ajude a fortalecer a democracia compartilhando este evento
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Rich Preview Meta Tags Component (for Next.js head)
export function EventMetaTags({
  eventTitle,
  eventDescription,
  eventDate,
  eventLocation,
  eventUrl,
  imageUrl
}: {
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  eventUrl: string;
  imageUrl?: string;
}) {
  const title = `${eventTitle} - Marcha Brasil`;
  const description = `📅 ${eventDate} • 📍 ${eventLocation} • Manifestação pacífica em defesa da democracia. ${eventDescription.slice(0, 100)}...`;
  
  return (
    <>
      {/* Basic Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={eventUrl} />
      <meta property="og:type" content="event" />
      <meta property="og:site_name" content="Marcha Brasil" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Event-specific meta */}
      <meta property="event:start_time" content={eventDate} />
      <meta property="event:location" content={eventLocation} />
      
      {/* Image */}
      {imageUrl && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:image" content={imageUrl} />
        </>
      )}
      
      {/* App-specific */}
      <meta property="og:locale" content="pt_BR" />
      <meta name="robots" content="index, follow" />
    </>
  );
}