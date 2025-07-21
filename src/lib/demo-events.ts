'use client';

import { Protest } from '@/types';

const DEMO_EVENTS_KEY = 'marcha-brasil-demo-events';

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

// Save demo event to localStorage
export function saveDemoEvent(eventData: any): Protest[] {
  const timestamp = Date.now();
  const newEvents: Protest[] = [];

  // If it's a national event, create events for all capitals
  if (eventData.isNational) {
    brazilianCapitals.forEach((capitalInfo, index) => {
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
        thumbnail: eventData.thumbnail || undefined,
        rsvps: {
          caminhoneiros: 0,
          motociclistas: 0,
          carros: 0,
          tratores: 0,
          produtoresRurais: 0,
          comerciantes: 0,
          populacaoGeral: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      newEvents.push(newEvent);
    });
  } else {
    // Single city event - find coordinates from capital list
    const stateCapital = brazilianCapitals.find(cap => cap.state === eventData.state);
    const coordinates: [number, number] = stateCapital 
      ? stateCapital.coordinates as [number, number]
      : [-23.5505, -46.6333]; // Default to São Paulo [lat, lng]
      
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
      thumbnail: eventData.thumbnail || undefined,
      rsvps: {
        caminhoneiros: 0,
        motociclistas: 0,
        carros: 0,
        tratores: 0,
        produtoresRurais: 0,
        comerciantes: 0,
        populacaoGeral: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    newEvents.push(newEvent);
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