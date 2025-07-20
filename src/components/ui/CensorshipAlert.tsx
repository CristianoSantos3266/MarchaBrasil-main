'use client';

import { useState, useEffect } from 'react';
import { MIRROR_DOMAINS, TOR_ONION_ADDRESS, getStoredMirrorInfo, findWorkingMirror, redirectToMirror } from '@/utils/mirrorDomains';

export default function CensorshipAlert() {
  const [showAlert, setShowAlert] = useState(false);
  const [mirrorInfo, setMirrorInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const info = getStoredMirrorInfo();
    setMirrorInfo(info);
    
    // Show alert if using a mirror domain
    if (info.isUsingMirror) {
      setShowAlert(true);
    }
  }, []);

  const handleFindMirror = async () => {
    setIsChecking(true);
    try {
      const workingMirror = await findWorkingMirror();
      if (workingMirror && workingMirror !== window.location.origin) {
        redirectToMirror(workingMirror);
      } else {
        alert('Não foi possível encontrar um domínio espelho funcionando. Tente novamente em alguns minutos ou use o endereço Tor.');
      }
    } catch (error) {
      alert('Erro ao verificar domínios espelho. Tente usar o endereço Tor.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleDismiss = () => {
    setShowAlert(false);
    localStorage.setItem('alertDismissed', 'true');
  };

  // Don't show if dismissed or not using mirror
  if (!showAlert || !mirrorInfo?.isUsingMirror) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowAlert(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-lg text-sm"
          title="Verificar acesso"
        >
          🛡️
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b-2 border-yellow-400 p-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-yellow-600 text-xl">⚠️</div>
          
          <div className="flex-1">
            <h3 className="font-bold text-yellow-800 text-sm mb-2">
              Aviso de Segurança - Domínio Espelho Ativo
            </h3>
            
            <div className="text-yellow-700 text-xs space-y-2">
              <p>
                Você foi redirecionado para um domínio espelho. Isso pode indicar que o domínio principal 
                foi bloqueado ou está inacessível.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-2">
                <p><strong>Domínio Atual:</strong> {window.location.origin}</p>
                {mirrorInfo?.originalDomain && (
                  <p><strong>Domínio Original:</strong> {mirrorInfo.originalDomain}</p>
                )}
                
                <div className="space-y-1">
                  <p><strong>Opções de acesso alternativo:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Use uma VPN (recomendado: Psiphon, Outline)</li>
                    <li>Acesse via Tor: <code className="bg-gray-200 px-1 rounded">{TOR_ONION_ADDRESS}</code></li>
                    <li>Tente outros domínios espelho disponíveis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 space-x-2">
            <button
              onClick={handleFindMirror}
              disabled={isChecking}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs font-medium"
            >
              {isChecking ? 'Verificando...' : 'Buscar Espelho'}
            </button>
            
            <button
              onClick={handleDismiss}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium"
            >
              Dispensar
            </button>
          </div>
        </div>

        {/* Mirror domains list */}
        <details className="mt-3">
          <summary className="text-yellow-700 text-xs cursor-pointer hover:text-yellow-800">
            Ver todos os domínios espelho disponíveis
          </summary>
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs">
              {MIRROR_DOMAINS.map((domain, index) => (
                <a
                  key={index}
                  href={domain + window.location.pathname}
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {domain.replace('https://', '')}
                </a>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}