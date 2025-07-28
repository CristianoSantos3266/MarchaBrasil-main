'use client';

import { useState } from 'react';
import { XMarkIcon, PaperAirplaneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  eventUrl: string;
  participantCount: number;
}

export default function ShareModal({
  isOpen,
  onClose,
  eventTitle,
  eventDescription,
  eventDate,
  eventLocation,
  eventUrl,
  participantCount
}: ShareModalProps) {
  const [customMessage, setCustomMessage] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  // Generate default message
  const defaultMessage = `*${eventTitle}*

Data: ${eventDate}
Local: ${eventLocation}
${participantCount} pessoas já confirmaram presença

${eventDescription.slice(0, 150)}${eventDescription.length > 150 ? '...' : ''}

Esta é uma manifestação pacífica em defesa da democracia. Sua participação é importante para fortalecer nossos valores democráticos.

Confirme sua presença e veja mais detalhes:
${eventUrl}

marchabrasil.com - Unidos pela Democracia`;

  const finalMessage = customMessage || defaultMessage;

  const handleWhatsApp = () => {
    const whatsappUrl = phoneNumber 
      ? `https://wa.me/55${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(finalMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = async () => {
    if (!email.trim()) {
      alert('Por favor, insira um endereço de email.');
      return;
    }

    setEmailSending(true);
    
    try {
      // Simulate sending email via web service
      // In production, this would call your backend API
      const emailData = {
        to: email,
        subject: `${eventTitle} - ${eventDate}`,
        message: finalMessage.replace(/\*/g, ''),
        eventUrl: eventUrl
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Email would be sent:', emailData);
      
      setEmailSent(true);
      setTimeout(() => {
        setEmailSending(false);
        setEmailSent(false);
        setEmail('');
      }, 3000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Erro ao enviar email. Tente novamente.');
      setEmailSending(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${finalMessage}\n\n${eventUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${finalMessage}\n\n${eventUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply Brazilian phone number formatting
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold">Compartilhar Evento</h2>
            <p className="text-green-100">Ajude a divulgar esta manifestação</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Event Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-2">{eventTitle}</h3>
            <div className="text-sm text-gray-600">
              <p>{eventDate} • {eventLocation}</p>
              <p className="text-green-600 font-medium">{participantCount} confirmados</p>
            </div>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personalize sua mensagem (opcional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Deixe em branco para usar a mensagem padrão..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              {customMessage ? customMessage.length : defaultMessage.length} caracteres
            </p>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prévia da mensagem
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
              {finalMessage}
            </div>
          </div>

          {/* Sharing Options */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-500 rounded-full p-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                  <p className="text-sm text-gray-600">Compartilhe diretamente ou para um contato específico</p>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Número do contato (opcional)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe em branco para escolher o contato no WhatsApp
                </p>
              </div>
              
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Compartilhar no WhatsApp
              </button>
            </div>

            {/* Email */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-500 rounded-full p-2">
                  <EnvelopeIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-sm text-gray-600">Envie por email para seus contatos</p>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email do destinatário (opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amigo@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  O email será enviado diretamente pela plataforma
                </p>
              </div>
              
              <button
                onClick={handleEmail}
                disabled={emailSending || emailSent || !email.trim()}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {emailSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Enviando...
                  </>
                ) : emailSent ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Email Enviado!
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-4 w-4" />
                    Enviar Email
                  </>
                )}
              </button>
            </div>

            {/* Copy Link */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gray-500 rounded-full p-2">
                  <DocumentDuplicateIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Copiar Texto</h4>
                  <p className="text-sm text-gray-600">Copie a mensagem para usar em outros aplicativos</p>
                </div>
              </div>
              
              <button
                onClick={handleCopyLink}
                disabled={copied}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:bg-green-600"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="h-4 w-4" />
                    Copiar Mensagem
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Dicas para compartilhar:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Adicione uma mensagem pessoal para aumentar o engajamento</li>
              <li>• Compartilhe em grupos familiares e de amigos</li>
              <li>• Compartilhe com antecedência para dar tempo às pessoas se organizarem</li>
              <li>• Explique a importância da manifestação pacífica</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}