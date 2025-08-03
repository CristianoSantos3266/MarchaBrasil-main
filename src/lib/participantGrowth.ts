// Importação de funções demo para uso no servidor
import { getDemoEvents } from './demo-events';

export interface ParticipantGrowthConfig {
  eventId: string;
  originalEstimate: number;
  createdAt: string;
  confirmed_participants: number;
  growth_started_at?: string;
  growth_completed: boolean;
}

/**
 * Lógica de crescimento automático de participantes:
 * - 1 hora após criação: inicia crescimento
 * - A cada hora: +1% da estimativa original
 * - Máximo: 5% em 5 horas
 * - Para automaticamente após 5% ou 5 horas
 */
export class ParticipantGrowthService {
  
  static async processGrowthForAllEvents(): Promise<void> {
    try {
      const events = getDemoEvents();
      let hasUpdates = false;

      for (const event of events) {
        const updated = await this.processEventGrowth(event);
        if (updated) {
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        // Salvar eventos atualizados no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('marcha-brasil-demo-events', JSON.stringify(events));
        }
        console.log('✅ Participant growth processed for all eligible events');
      }
    } catch (error) {
      console.error('❌ Error processing participant growth:', error);
    }
  }

  static async processEventGrowth(event: any): Promise<boolean> {
    const now = new Date();
    const createdAt = new Date(event.createdAt);
    const hoursSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));

    // Se não tem estimativa, não processa
    const expectedAttendance = event.expected_attendance || 0;
    if (expectedAttendance <= 0) {
      return false;
    }

    // Inicializar campos se necessário
    if (event.confirmed_participants === undefined) {
      event.confirmed_participants = 0;
    }
    if (event.original_estimate === undefined) {
      event.original_estimate = expectedAttendance;
    }
    if (event.growth_completed === undefined) {
      event.growth_completed = false;
    }

    // Se já completou o crescimento, não processa mais
    if (event.growth_completed) {
      return false;
    }

    // Deve aguardar 1 hora após criação para começar
    if (hoursSinceCreation < 1) {
      return false;
    }

    // Marcar início do crescimento se for a primeira vez
    if (!event.growth_started_at && hoursSinceCreation >= 1) {
      event.growth_started_at = now.toISOString();
    }

    // Calcular crescimento baseado nas horas desde início
    const growthStartTime = new Date(event.growth_started_at || now);
    const hoursSinceGrowthStart = Math.floor((now.getTime() - growthStartTime.getTime()) / (1000 * 60 * 60));
    
    // Máximo 5 horas de crescimento
    if (hoursSinceGrowthStart >= 5) {
      if (!event.growth_completed) {
        event.growth_completed = true;
        return true;
      }
      return false;
    }

    // Calcular novo número de participantes
    // A cada hora completa: +1% da estimativa original
    const growthPercentage = Math.min(hoursSinceGrowthStart * 1, 5); // Máximo 5%
    const targetParticipants = Math.floor((event.original_estimate * growthPercentage) / 100);

    // Se já atingiu 5%, marcar como completo
    if (growthPercentage >= 5) {
      event.growth_completed = true;
    }

    // Só atualiza se o valor mudou
    if (event.confirmed_participants !== targetParticipants) {
      const oldValue = event.confirmed_participants;
      event.confirmed_participants = targetParticipants;
      
      console.log(`📈 Event "${event.title}": ${oldValue} → ${targetParticipants} participants (${growthPercentage}% of ${event.original_estimate})`);
      return true;
    }

    return false;
  }

  static getGrowthStatus(event: any): string {
    if (!event.expected_attendance) {
      return 'Sem estimativa';
    }
    
    if (event.growth_completed) {
      return 'Crescimento concluído';
    }
    
    const now = new Date();
    const createdAt = new Date(event.createdAt);
    const hoursSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
    
    if (hoursSinceCreation < 1) {
      const minutesLeft = 60 - Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
      return `Crescimento inicia em ${minutesLeft}min`;
    }
    
    if (event.growth_started_at) {
      const growthStartTime = new Date(event.growth_started_at);
      const hoursSinceGrowthStart = Math.floor((now.getTime() - growthStartTime.getTime()) / (1000 * 60 * 60));
      const hoursLeft = Math.max(0, 5 - hoursSinceGrowthStart);
      return `Crescendo... ${hoursLeft}h restantes`;
    }
    
    return 'Aguardando início';
  }
}