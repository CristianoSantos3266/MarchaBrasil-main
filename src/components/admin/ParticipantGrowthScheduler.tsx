'use client';

import { useEffect, useState } from 'react';
import { ParticipantGrowthService } from '@/lib/participantGrowth';

interface GrowthSchedulerProps {
  enabled?: boolean;
  intervalMinutes?: number;
}

export default function ParticipantGrowthScheduler({ 
  enabled = true, 
  intervalMinutes = 60 
}: GrowthSchedulerProps) {
  const [lastRun, setLastRun] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const runGrowthProcess = async () => {
      if (isRunning) return;
      
      setIsRunning(true);
      try {
        await ParticipantGrowthService.processGrowthForAllEvents();
        setLastRun(new Date().toLocaleString('pt-BR'));
        console.log('🔄 Automatic participant growth processed');
      } catch (error) {
        console.error('❌ Error in automatic growth process:', error);
      } finally {
        setIsRunning(false);
      }
    };

    // Executar imediatamente na primeira carga
    runGrowthProcess();

    // Configurar interval para execução periódica
    const interval = setInterval(runGrowthProcess, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled, intervalMinutes, isRunning]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="hidden">
      {/* Componente invisível que roda o scheduler */}
      <div className="text-xs text-gray-500">
        Scheduler ativo - Última execução: {lastRun || 'Nunca'}
        {isRunning && ' (Executando...)'}
      </div>
    </div>
  );
}