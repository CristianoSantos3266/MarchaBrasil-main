'use client';

// Badge definitions for civic participation
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: {
    type: 'attendance' | 'organizing' | 'cities' | 'states';
    threshold: number;
    cities?: number;
    states?: number;
  };
}

export const BADGES: Badge[] = [
  {
    id: 'presente',
    name: 'Presente!',
    description: 'Confirmou presença em sua primeira manifestação',
    icon: '🔰',
    color: 'green',
    criteria: {
      type: 'attendance',
      threshold: 1
    }
  },
  {
    id: 'resistente',
    name: 'Resistente',
    description: 'Participou de protestos em 3+ cidades diferentes',
    icon: '🛡',
    color: 'blue',
    criteria: {
      type: 'cities',
      threshold: 1,
      cities: 3
    }
  },
  {
    id: 'mobilizador',
    name: 'Mobilizador',
    description: 'Organizou uma manifestação verificada',
    icon: '📍',
    color: 'purple',
    criteria: {
      type: 'organizing',
      threshold: 1
    }
  },
  {
    id: 'marchador_nacional',
    name: 'Marchador Nacional',
    description: 'Participou de eventos em 3+ estados',
    icon: '🧭',
    color: 'gold',
    criteria: {
      type: 'states',
      threshold: 1,
      states: 3
    }
  }
];

// User participation tracking
export interface UserParticipation {
  userId: string;
  totalAttendance: number;
  citiesVisited: string[];
  statesVisited: string[];
  eventsOrganized: number;
  earnedBadges: string[];
  lastUpdated: string;
}

const USER_PARTICIPATION_KEY = 'marcha-brasil-user-participation';

// Get user participation data
export function getUserParticipation(userId: string): UserParticipation {
  if (typeof window === 'undefined') {
    return {
      userId,
      totalAttendance: 0,
      citiesVisited: [],
      statesVisited: [],
      eventsOrganized: 0,
      earnedBadges: [],
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const stored = localStorage.getItem(USER_PARTICIPATION_KEY);
    const allParticipation: Record<string, UserParticipation> = stored ? JSON.parse(stored) : {};
    
    return allParticipation[userId] || {
      userId,
      totalAttendance: 0,
      citiesVisited: [],
      statesVisited: [],
      eventsOrganized: 0,
      earnedBadges: [],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.warn('Error loading user participation:', error);
    return {
      userId,
      totalAttendance: 0,
      citiesVisited: [],
      statesVisited: [],
      eventsOrganized: 0,
      earnedBadges: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

// Update user participation and check for new badges
export function updateUserParticipation(
  userId: string,
  action: 'attend' | 'organize',
  city: string,
  state: string
): { newBadges: Badge[]; participation: UserParticipation } {
  const participation = getUserParticipation(userId);
  const previousBadges = [...participation.earnedBadges];

  // Update participation based on action
  if (action === 'attend') {
    participation.totalAttendance += 1;
    if (!participation.citiesVisited.includes(city)) {
      participation.citiesVisited.push(city);
    }
    if (!participation.statesVisited.includes(state)) {
      participation.statesVisited.push(state);
    }
  } else if (action === 'organize') {
    participation.eventsOrganized += 1;
  }

  participation.lastUpdated = new Date().toISOString();

  // Check for new badges
  const newlyEarnedBadges: string[] = [];
  
  for (const badge of BADGES) {
    if (participation.earnedBadges.includes(badge.id)) continue;

    let earned = false;
    
    switch (badge.criteria.type) {
      case 'attendance':
        earned = participation.totalAttendance >= badge.criteria.threshold;
        break;
      case 'organizing':
        earned = participation.eventsOrganized >= badge.criteria.threshold;
        break;
      case 'cities':
        earned = participation.citiesVisited.length >= (badge.criteria.cities || 0);
        break;
      case 'states':
        earned = participation.statesVisited.length >= (badge.criteria.states || 0);
        break;
    }

    if (earned) {
      participation.earnedBadges.push(badge.id);
      newlyEarnedBadges.push(badge.id);
    }
  }

  // Save updated participation
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(USER_PARTICIPATION_KEY);
      const allParticipation: Record<string, UserParticipation> = stored ? JSON.parse(stored) : {};
      allParticipation[userId] = participation;
      localStorage.setItem(USER_PARTICIPATION_KEY, JSON.stringify(allParticipation));
    } catch (error) {
      console.warn('Error saving user participation:', error);
    }
  }

  const newBadges = BADGES.filter(badge => newlyEarnedBadges.includes(badge.id));
  
  return { newBadges, participation };
}

// Get badge by ID
export function getBadgeById(badgeId: string): Badge | undefined {
  return BADGES.find(badge => badge.id === badgeId);
}

// Chama do Povo (People's Fire) - engagement indicator
export interface ChamaDoPovoData {
  eventId: string;
  shares: number;
  views: number;
  confirmations: number;
  intensity: number; // 0-100 calculated value
  lastUpdated: string;
}

const CHAMA_POVO_KEY = 'marcha-brasil-chama-povo';

// Get Chama do Povo data for an event
export function getChamaDoPovoData(eventId: string): ChamaDoPovoData {
  if (typeof window === 'undefined') {
    return {
      eventId,
      shares: 0,
      views: 0,
      confirmations: 0,
      intensity: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const stored = localStorage.getItem(CHAMA_POVO_KEY);
    const allChama: Record<string, ChamaDoPovoData> = stored ? JSON.parse(stored) : {};
    
    return allChama[eventId] || {
      eventId,
      shares: 0,
      views: 0,
      confirmations: 0,
      intensity: 0,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.warn('Error loading Chama do Povo data:', error);
    return {
      eventId,
      shares: 0,
      views: 0,
      confirmations: 0,
      intensity: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Update Chama do Povo data
export function updateChamaDoPovoData(
  eventId: string,
  action: 'view' | 'share' | 'confirm',
  amount: number = 1
): ChamaDoPovoData {
  const chamaData = getChamaDoPovoData(eventId);

  switch (action) {
    case 'view':
      chamaData.views += amount;
      break;
    case 'share':
      chamaData.shares += amount;
      break;
    case 'confirm':
      chamaData.confirmations += amount;
      break;
  }

  // Calculate intensity (0-100) based on engagement
  // More responsive algorithm - shows progress with fewer interactions
  const viewWeight = 1;
  const shareWeight = 5;
  const confirmWeight = 10;
  
  const totalEngagement = 
    (chamaData.views * viewWeight) +
    (chamaData.shares * shareWeight) +
    (chamaData.confirmations * confirmWeight);
  
  // More responsive scaling that handles massive numbers properly
  let intensity = 0;
  
  if (totalEngagement === 0) {
    intensity = 0;
  } else if (totalEngagement >= 100000) {
    // Massive viral level: 100K+ engagement points = 95-100%
    intensity = Math.min(100, 95 + Math.round((totalEngagement - 100000) / 200000 * 5));
  } else if (totalEngagement >= 10000) {
    // Super viral level: 10K-99K engagement points = 90-94%
    intensity = 90 + Math.round(((totalEngagement - 10000) / 90000) * 4);
  } else if (totalEngagement >= 5000) {
    // High viral level: 5K-9.9K engagement points = 85-89%
    intensity = 85 + Math.round(((totalEngagement - 5000) / 5000) * 4);
  } else if (totalEngagement >= 1000) {
    // Viral level: 1K-4.9K engagement points = 75-84%
    intensity = 75 + Math.round(((totalEngagement - 1000) / 4000) * 9);
  } else if (totalEngagement >= 500) {
    // High momentum: 500-999 points = 65-74%
    intensity = 65 + Math.round(((totalEngagement - 500) / 500) * 9);
  } else if (totalEngagement >= 200) {
    // Growing momentum: 200-499 points = 50-64%
    intensity = 50 + Math.round(((totalEngagement - 200) / 300) * 14);
  } else if (totalEngagement >= 75) {
    // Growing: 75-199 points = 35-49%
    intensity = 35 + Math.round(((totalEngagement - 75) / 125) * 14);
  } else if (totalEngagement >= 25) {
    // Starting: 25-74 points = 20-34%
    intensity = 20 + Math.round(((totalEngagement - 25) / 50) * 14);
  } else {
    // Beginning: 1-24 points = 5-19%
    intensity = Math.max(5, Math.round((totalEngagement / 25) * 14) + 5);
  }
  
  chamaData.intensity = intensity;
  
  chamaData.lastUpdated = new Date().toISOString();

  // Save updated data
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CHAMA_POVO_KEY);
      const allChama: Record<string, ChamaDoPovoData> = stored ? JSON.parse(stored) : {};
      allChama[eventId] = chamaData;
      localStorage.setItem(CHAMA_POVO_KEY, JSON.stringify(allChama));
    } catch (error) {
      console.warn('Error saving Chama do Povo data:', error);
    }
  }

  return chamaData;
}

// Regional impact tracking
export interface RegionalImpact {
  state: string;
  totalEvents: number;
  totalConfirmations: number;
  activeOrganizers: number;
  lastUpdated: string;
}

const REGIONAL_IMPACT_KEY = 'marcha-brasil-regional-impact';

// Get regional impact data
export function getRegionalImpact(): Record<string, RegionalImpact> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(REGIONAL_IMPACT_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Error loading regional impact data:', error);
    return {};
  }
}

// Calculate and update regional impact from events
export function calculateRegionalImpact(events: any[]): Record<string, RegionalImpact> {
  const impactByState: Record<string, RegionalImpact> = {};

  for (const event of events) {
    const state = event.state || event.region;
    if (!state) continue;

    if (!impactByState[state]) {
      impactByState[state] = {
        state,
        totalEvents: 0,
        totalConfirmations: 0,
        activeOrganizers: 0,
        lastUpdated: new Date().toISOString()
      };
    }

    impactByState[state].totalEvents += 1;
    
    // Calculate total confirmations for this event
    if (event.rsvps) {
      const eventTotal = Object.values(event.rsvps).reduce((sum: number, count: any) => sum + (count || 0), 0);
      impactByState[state].totalConfirmations += eventTotal;
    }
  }

  // Save regional impact data
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REGIONAL_IMPACT_KEY, JSON.stringify(impactByState));
    } catch (error) {
      console.warn('Error saving regional impact data:', error);
    }
  }

  return impactByState;
}

// Get milestone notifications
export function getMilestoneNotification(
  eventId: string,
  currentCount: number,
  previousCount: number
): string | null {
  const milestones = [50, 100, 250, 500, 1000, 2500, 5000, 10000];
  
  for (const milestone of milestones) {
    if (currentCount >= milestone && previousCount < milestone) {
      if (milestone >= 1000) {
        return `🔥 Mais de ${(milestone / 1000).toFixed(0)}k patriotas já confirmaram presença — compartilhe para aumentar!`;
      } else {
        return `🎉 Você é o ${milestone}º a confirmar presença nesta manifestação!`;
      }
    }
  }
  
  return null;
}

// Demo function to simulate high engagement
export function simulateHighEngagement(eventId: string, confirmations: number = 1000): ChamaDoPovoData {
  // Create fresh data instead of modifying existing
  const chamaData: ChamaDoPovoData = {
    eventId,
    confirmations: confirmations,
    shares: Math.floor(confirmations * 0.15), // 15% share rate
    views: Math.floor(confirmations * 3), // 3x view rate
    intensity: 0,
    lastUpdated: new Date().toISOString()
  };
  
  // Recalculate intensity with new values
  const viewWeight = 1;
  const shareWeight = 5;
  const confirmWeight = 10;
  
  const totalEngagement = 
    (chamaData.views * viewWeight) +
    (chamaData.shares * shareWeight) +
    (chamaData.confirmations * confirmWeight);
  
  console.log(`Engagement calculation for ${confirmations} confirmations:`, {
    views: chamaData.views,
    shares: chamaData.shares,
    confirmations: chamaData.confirmations,
    totalEngagement
  });
  
  let intensity = 0;
  
  if (totalEngagement === 0) {
    intensity = 0;
  } else if (totalEngagement >= 100000) {
    intensity = Math.min(100, 95 + Math.round((totalEngagement - 100000) / 200000 * 5));
  } else if (totalEngagement >= 10000) {
    intensity = 90 + Math.round(((totalEngagement - 10000) / 90000) * 4);
  } else if (totalEngagement >= 5000) {
    intensity = 85 + Math.round(((totalEngagement - 5000) / 5000) * 4);
  } else if (totalEngagement >= 1000) {
    intensity = 75 + Math.round(((totalEngagement - 1000) / 4000) * 9);
  } else if (totalEngagement >= 500) {
    intensity = 65 + Math.round(((totalEngagement - 500) / 500) * 9);
  } else if (totalEngagement >= 200) {
    intensity = 50 + Math.round(((totalEngagement - 200) / 300) * 14);
  } else if (totalEngagement >= 75) {
    intensity = 35 + Math.round(((totalEngagement - 75) / 125) * 14);
  } else if (totalEngagement >= 25) {
    intensity = 20 + Math.round(((totalEngagement - 25) / 50) * 14);
  } else {
    intensity = Math.max(5, Math.round((totalEngagement / 25) * 14) + 5);
  }
  
  chamaData.intensity = intensity;
  
  console.log(`Final intensity: ${intensity}%`);
  
  // Save the demo data
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CHAMA_POVO_KEY);
      const allChama: Record<string, ChamaDoPovoData> = stored ? JSON.parse(stored) : {};
      allChama[eventId] = chamaData;
      localStorage.setItem(CHAMA_POVO_KEY, JSON.stringify(allChama));
    } catch (error) {
      console.warn('Error saving demo Chama do Povo data:', error);
    }
  }
  
  return chamaData;
}