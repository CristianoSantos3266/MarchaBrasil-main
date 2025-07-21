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
    
    // Only show alert if using a mirror domain AND user hasn't dismissed it
    const alertDismissed = localStorage.getItem('alertDismissed');
    if (info.isUsingMirror && !alertDismissed) {
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
  if (!showAlert) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowAlert(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg text-sm transition-all hover:scale-110"
          title="Verificar opções de acesso"
        >
          🛡️
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-xl p-4 z-50 max-w-md ml-auto mr-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-yellow-600 text-lg">⚠️</div>
        
        <div className="flex-1">
          <h3 className="font-bold text-yellow-800 text-sm mb-2">
            Domínio Espelho Ativo
          </h3>
          
          <div className="text-yellow-700 text-xs space-y-2">
            <p>
              Usando domínio alternativo para acesso seguro.
            </p>
            
            <div className="space-y-1">
              <p><strong>Atual:</strong> {window.location.origin.replace('https://', '')}</p>
              
              <details className="mt-2">
                <summary className="text-yellow-700 text-xs cursor-pointer hover:text-yellow-800">
                  Ver opções de acesso
                </summary>
                <div className="mt-2 space-y-1">
                  <p>• Use VPN (Psiphon, Outline)</p>
                  <p>• Tor: <code className="bg-yellow-100 px-1 rounded text-xs">{TOR_ONION_ADDRESS}</code></p>
                  <p>• Outros domínios espelho</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 space-x-1">
          <button
            onClick={handleFindMirror}
            disabled={isChecking}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-2 py-1 rounded text-xs"
            title="Buscar outro espelho"
          >
            {isChecking ? '...' : '🔍'}
          </button>
          
          <button
            onClick={handleDismiss}
            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
            title="Dispensar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}