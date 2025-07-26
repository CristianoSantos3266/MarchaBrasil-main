'use client';

import { Protest } from '@/types';
import { getOrCreateUserSession } from './auth';

const DEMO_EVENTS_KEY = 'marcha-brasil-demo-events';
const DEMO_THUMBNAILS_KEY = 'marcha-brasil-demo-thumbnails';

// Brazilian state capitals for national events with coordinates [lat, lng]
const brazilianCapitals = [
  { state: 'AC', capital: 'Rio Branco', coordinates: [-9.9749, -67.8099] },
  { state: 'AL', capital: 'Maceió', coordinates: [-9.6658, -35.7353] },
  { state: 'AP', capital: 'Macapá', coordinates: [0.0389, -51.0694] },
  { state: 'AM', capital: 'Manaus', coordinates: [-3.1190, -60.0261] },
  { state: 'BA', capital: 'Salvador', coordinates: [-12.9714, -38.5014] },
  { state: 'CE', capital: 'Fortaleza', coordinates: [-3.7319, -38.5434] },
  { state: 'DF', capital: 'Brasília', coordinates: [-15.7975, -47.8825] },
  { state: 'ES', capital: 'Vitória', coordinates: [-20.3155, -40.3376] },
  { state: 'GO', capital: 'Goiânia', coordinates: [-16.6864, -49.2643] },
  { state: 'MA', capital: 'São Luís', coordinates: [-2.5307, -44.3068] },
  { state: 'MT', capital: 'Cuiabá', coordinates: [-15.6014, -56.0925] },
  { state: 'MS', capital: 'Campo Grande', coordinates: [-20.4697, -54.6464] },
  { state: 'MG', capital: 'Belo Horizonte', coordinates: [-19.9167, -43.9378] },
  { state: 'PA', capital: 'Belém', coordinates: [-1.4558, -48.5044] },
  { state: 'PB', capital: 'João Pessoa', coordinates: [-7.1195, -34.8641] },
  { state: 'PR', capital: 'Curitiba', coordinates: [-25.4284, -49.2671] },
  { state: 'PE', capital: 'Recife', coordinates: [-8.0476, -34.8775] },
  { state: 'PI', capital: 'Teresina', coordinates: [-5.0892, -42.8019] },
  { state: 'RJ', capital: 'Rio de Janeiro', coordinates: [-22.9068, -43.1729] },
  { state: 'RN', capital: 'Natal', coordinates: [-5.7945, -35.2094] },
  { state: 'RS', capital: 'Porto Alegre', coordinates: [-30.0346, -51.2177] },
  { state: 'RO', capital: 'Porto Velho', coordinates: [-8.7619, -63.9004] },
  { state: 'RR', capital: 'Boa Vista', coordinates: [2.8235, -60.6753] },
  { state: 'SC', capital: 'Florianópolis', coordinates: [-27.5954, -48.5482] },
  { state: 'SP', capital: 'São Paulo', coordinates: [-23.5505, -46.6333] },
  { state: 'SE', capital: 'Aracaju', coordinates: [-10.9472, -37.0731] },
  { state: 'TO', capital: 'Palmas', coordinates: [-10.1753, -48.3603] }
];

// Migrate existing demo events to add coordinates if missing
function migrateDemoEventsCoordinates(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(DEMO_EVENTS_KEY);
    if (!stored) return;
    
    const events: Protest[] = JSON.parse(stored);
    let needsUpdate = false;
    
    const updatedEvents = events.map(event => {
      // Skip if already has coordinates
      if (event.coordinates) return event;
      
      needsUpdate = true;
      
      // Find coordinates based on state
      const stateCapital = brazilianCapitals.find(cap => cap.state === event.region);
      const coordinates: [number, number] = stateCapital 
        ? stateCapital.coordinates as [number, number]
        : [-23.5505, -46.6333]; // Default to São Paulo [lat, lng]
      
      return {
        ...event,
        coordinates
      };
    });
    
    if (needsUpdate) {
      localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(updatedEvents));
      console.log('Migrated demo events coordinates');
    }
  } catch (error) {
    console.error('Error migrating demo events:', error);
  }
}

// Get demo events from localStorage
export function getDemoEvents(): Protest[] {
  if (typeof window === 'undefined') return [];
  
  try {
    // Run migration first
    migrateDemoEventsCoordinates();
    
    const stored = localStorage.getItem(DEMO_EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading demo events:', error);
    return [];
  }
}

// Event listener for demo events updates
const listeners: (() => void)[] = [];

export function onDemoEventsUpdate(callback: () => void) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

function notifyListeners() {
  listeners.forEach(callback => callback());
}

// Helper function to compress and store thumbnail separately
function storeThumbnail(eventId: string, thumbnailData: string | null): void {
  if (!thumbnailData || typeof window === 'undefined') return;
  
  try {
    const thumbnails = JSON.parse(localStorage.getItem(DEMO_THUMBNAILS_KEY) || '{}');
    thumbnails[eventId] = thumbnailData;
    localStorage.setItem(DEMO_THUMBNAILS_KEY, JSON.stringify(thumbnails));
  } catch (error) {
    console.warn(`Failed to store thumbnail for ${eventId}:`, error);
  }
}

// Helper function to get thumbnail for an event
export function getThumbnail(eventId: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const thumbnails = JSON.parse(localStorage.getItem(DEMO_THUMBNAILS_KEY) || '{}');
    return thumbnails[eventId];
  } catch (error) {
    console.warn(`Failed to get thumbnail for ${eventId}:`, error);
    return undefined;
  }
}

// Helper function to create event-specific RSVPs based on event type
function createEventSpecificRSVPs(eventType: string): Record<string, number> {
  const relevantTypes: Record<string, string[]> = {
    'manifestacao': ['populacaoGeral'],
    'marcha': ['populacaoGeral'],
    'caminhoneiros': ['caminhoneiros', 'populacaoGeral'],
    'carreata': ['carros', 'populacaoGeral'],
    'motociata': ['motociclistas', 'carros', 'populacaoGeral'],
    'tratorada': ['tratores', 'carros', 'populacaoGeral'],
    'assembleia': ['populacaoGeral', 'comerciantes', 'produtoresRurais']
  };
  
  const rsvps: Record<string, number> = {};
  const types = relevantTypes[eventType] || ['populacaoGeral'];
  
  types.forEach(type => {
    rsvps[type] = 0;
  });
  
  return rsvps;
}

// Save demo event to localStorage
export function saveDemoEvent(eventData: any): Protest[] {
  const timestamp = Date.now();
  const newEvents: Protest[] = [];

  // If it's a national event, create events for all capitals
  if (eventData.isNational) {
    brazilianCapitals.forEach((capitalInfo, index) => {
      const currentUser = getOrCreateUserSession();
      const newEvent: Protest = {
        id: `demo-${timestamp}-${capitalInfo.state}`,
        title: `${eventData.title} - ${capitalInfo.capital}`,
        description: `${eventData.description}\n\n🇧🇷 Evento Nacional - Simultâneo em todas as capitais`,
        city: capitalInfo.capital,
        region: capitalInfo.state,
        country: 'BR',
        date: eventData.date,
        time: eventData.time,
        location: eventData.meeting_point || `Centro de ${capitalInfo.capital}`,
        type: eventData.type,
        coordinates: capitalInfo.coordinates as [number, number],
        thumbnail: undefined, // Thumbnails stored separately
        rsvps: createEventSpecificRSVPs(eventData.type),
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      newEvents.push(newEvent);
      
      // Store thumbnail separately for national events
      if (eventData.thumbnail) {
        storeThumbnail(newEvent.id, eventData.thumbnail);
      }
    });
  } else {
    // Single city event - find coordinates from capital list
    const stateCapital = brazilianCapitals.find(cap => cap.state === eventData.state);
    const coordinates: [number, number] = stateCapital 
      ? stateCapital.coordinates as [number, number]
      : [-23.5505, -46.6333]; // Default to São Paulo [lat, lng]
      
    const currentUser = getOrCreateUserSession();
    const newEvent: Protest = {
      id: `demo-${timestamp}`,
      title: eventData.title,
      description: eventData.description,
      city: eventData.city,
      region: eventData.state,
      country: 'BR',
      date: eventData.date,
      time: eventData.time,
      location: eventData.meeting_point,
      type: eventData.type,
      coordinates: coordinates,
      thumbnail: undefined, // Thumbnails stored separately
      rsvps: createEventSpecificRSVPs(eventData.type),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    newEvents.push(newEvent);
    
    // Store thumbnail separately for single events
    if (eventData.thumbnail) {
      storeThumbnail(newEvent.id, eventData.thumbnail);
    }
  }

  // Get existing demo events
  const existingEvents = getDemoEvents();
  
  // Add new events
  const updatedEvents = [...existingEvents, ...newEvents];
  
  // Save back to localStorage
  try {
    localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(updatedEvents));
    // Notify listeners that events have been updated
    notifyListeners();
  } catch (error) {
    console.error('Error saving demo event:', error);
  }
  
  return newEvents;
}

// Clear all demo events (useful for testing)
export function clearDemoEvents(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DEMO_EVENTS_KEY);
}

// Force regenerate demo events with correct coordinates
export function forceRegenerateCoordinates(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(DEMO_EVENTS_KEY);
    if (!stored) return;
    
    const events: Protest[] = JSON.parse(stored);
    
    const updatedEvents = events.map(event => {
      // Find coordinates based on state
      const stateCapital = brazilianCapitals.find(cap => cap.state === event.region);
      const coordinates: [number, number] = stateCapital 
        ? stateCapital.coordinates as [number, number]
        : [-23.5505, -46.6333]; // Default to São Paulo [lat, lng]
      
      return {
        ...event,
        coordinates
      };
    });
    
    localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(updatedEvents));
    console.log('Force regenerated coordinates for', updatedEvents.length, 'demo events');
    
    // Notify listeners
    notifyListeners();
  } catch (error) {
    console.error('Error force regenerating coordinates:', error);
  }
}

// Update existing demo event
export function updateDemoEvent(eventId: string, eventData: any): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const existingEvents = getDemoEvents();
    const eventIndex = existingEvents.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) {
      console.error('Event not found for editing:', eventId);
      return false;
    }
    
    // Update the event data while preserving the ID and timestamps
    const updatedEvent = {
      ...existingEvents[eventIndex],
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      date: eventData.date,
      time: eventData.time,
      location: eventData.meeting_point || eventData.location,
      city: eventData.city || existingEvents[eventIndex].city,
      region: eventData.state || existingEvents[eventIndex].region,
      updatedAt: new Date().toISOString()
    };
    
    // Update the event in the array
    existingEvents[eventIndex] = updatedEvent;
    
    // Save back to localStorage
    localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(existingEvents));
    
    // Update thumbnail if provided
    if (eventData.thumbnail) {
      storeThumbnail(eventId, eventData.thumbnail);
    }
    
    // Notify listeners
    notifyListeners();
    
    console.log('Successfully updated demo event:', eventId);
    return true;
  } catch (error) {
    console.error('Error updating demo event:', error);
    return false;
  }
}

// Delete demo event
export function deleteDemoEvent(eventId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const existingEvents = getDemoEvents();
    const filteredEvents = existingEvents.filter(event => event.id !== eventId);
    
    if (filteredEvents.length === existingEvents.length) {
      console.error('Event not found for deletion:', eventId);
      return false;
    }
    
    // Save updated events
    localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(filteredEvents));
    
    // Remove thumbnail
    try {
      const thumbnails = JSON.parse(localStorage.getItem(DEMO_THUMBNAILS_KEY) || '{}');
      delete thumbnails[eventId];
      localStorage.setItem(DEMO_THUMBNAILS_KEY, JSON.stringify(thumbnails));
    } catch (e) {
      console.warn('Failed to remove thumbnail:', e);
    }
    
    // Notify listeners
    notifyListeners();
    
    console.log('Successfully deleted demo event:', eventId);
    return true;
  } catch (error) {
    console.error('Error deleting demo event:', error);
    return false;
  }
}

// Get single demo event by ID
export function getDemoEventById(eventId: string): Protest | null {
  if (typeof window === 'undefined') return null;
  
  const events = getDemoEvents();
  return events.find(event => event.id === eventId) || null;
}

// Add RSVP to demo event
export function addDemoEventRSVP(eventId: string, participantType: string, verification?: { email?: string; phone?: string }): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const existingEvents = getDemoEvents();
    const eventIndex = existingEvents.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) {
      console.error('Event not found for RSVP:', eventId);
      return false;
    }
    
    const event = existingEvents[eventIndex];
    
    // Map participant types to RSVP keys
    const rsvpKeyMap: Record<string, string> = {
      'caminhoneiro': 'caminhoneiros',
      'motociclista': 'motociclistas', 
      'carro': 'carros',
      'produtor_rural': 'produtoresRurais',
      'comerciante': 'comerciantes',
      'populacao_geral': 'populacaoGeral'
    };
    
    const rsvpKey = rsvpKeyMap[participantType];
    
    if (!rsvpKey) {
      console.error('Invalid participant type:', participantType);
      return false;
    }
    
    // Increment the RSVP count
    event.rsvps = event.rsvps || {
      caminhoneiros: 0,
      motociclistas: 0,
      carros: 0,
      tratores: 0,
      produtoresRurais: 0,
      comerciantes: 0,
      populacaoGeral: 0
    };
    
    const oldCount = event.rsvps[rsvpKey] || 0;
    event.rsvps[rsvpKey] = oldCount + 1;
    event.updatedAt = new Date().toISOString();
    
    // Update the event in the array
    existingEvents[eventIndex] = event;
    
    // Save back to localStorage
    localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(existingEvents));
    
    // Store verification data if provided (optional future feature)
    if (verification && (verification.email || verification.phone)) {
      try {
        const verificationKey = `marcha-brasil-rsvp-verification-${eventId}`;
        const existing = JSON.parse(localStorage.getItem(verificationKey) || '[]');
        existing.push({
          participantType,
          verification,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem(verificationKey, JSON.stringify(existing));
      } catch (e) {
        console.warn('Failed to store verification data:', e);
      }
    }
    
    // Notify listeners
    notifyListeners();
    
    return true;
  } catch (error) {
    console.error('Error adding RSVP:', error);
    return false;
  }
}

// Get RSVP stats for demo event
export function getDemoEventRSVPs(eventId: string): Record<string, number> | null {
  if (typeof window === 'undefined') return null;
  
  const event = getDemoEventById(eventId);
  return event?.rsvps || null;
}

// Check if we're in demo mode
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
         !process.env.NEXT_PUBLIC_SUPABASE_URL || 
         process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';
}

// Debug function to check coordinates
export function debugDemoEventsCoordinates(): void {
  if (typeof window === 'undefined') return;
  
  const events = getDemoEvents();
  console.log(`Demo events: ${events.length}`);
  
  const withCoords = events.filter(e => e.coordinates);
  const withoutCoords = events.filter(e => !e.coordinates);
  
  console.log(`With coordinates: ${withCoords.length}`);
  console.log(`Without coordinates: ${withoutCoords.length}`);
  
  if (withoutCoords.length > 0) {
    console.log('Events without coordinates:', withoutCoords.map(e => e.title));
  }
}