// Location-based attendance verification utilities

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

export interface EventLocation {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  radius: number; // verification radius in meters
}

export interface AttendanceVerification {
  id: string;
  userId: string;
  protestId: string;
  location: LocationData;
  method: 'gps' | 'manual' | 'qr_code';
  status: 'verified' | 'pending' | 'rejected';
  distance: number; // distance from event location in meters
  timestamp: Date;
  ipAddress?: string;
  deviceInfo?: string;
}

// Calculate distance between two geographic points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Verify if a location is within the acceptable range of an event
export function verifyLocationProximity(
  userLocation: LocationData,
  eventLocation: EventLocation
): {
  isValid: boolean;
  distance: number;
  confidence: 'high' | 'medium' | 'low';
  reason?: string;
} {
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    eventLocation.latitude,
    eventLocation.longitude
  );

  const isValid = distance <= eventLocation.radius;

  // Determine confidence based on GPS accuracy
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (userLocation.accuracy <= 10) {
    confidence = 'high';
  } else if (userLocation.accuracy <= 50) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  const result = {
    isValid,
    distance,
    confidence,
  };

  if (!isValid) {
    return {
      ...result,
      reason: `Localização muito distante do evento (${Math.round(distance)}m). Máximo permitido: ${eventLocation.radius}m`,
    };
  }

  if (confidence === 'low') {
    return {
      ...result,
      reason: `Precisão do GPS baixa (±${Math.round(userLocation.accuracy)}m). Recomendamos tentar novamente.`,
    };
  }

  return result;
}

// Get current device location with enhanced options
export async function getCurrentLocation(options?: {
  highAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}): Promise<LocationData> {
  const defaultOptions = {
    enableHighAccuracy: options?.highAccuracy ?? true,
    timeout: options?.timeout ?? 15000,
    maximumAge: options?.maximumAge ?? 60000, // 1 minute
  };

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não é suportada por este navegador'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp),
        });
      },
      (error) => {
        let errorMessage = 'Erro desconhecido ao obter localização';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada pelo usuário';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização indisponíveis';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite para obter localização excedido';
            break;
        }

        reject(new Error(errorMessage));
      },
      defaultOptions
    );
  });
}

// Generate a verification QR code data for manual check-in
export function generateQRVerificationData(
  protestId: string,
  timestamp: Date = new Date()
): {
  qrData: string;
  expiresAt: Date;
} {
  const expiresAt = new Date(timestamp.getTime() + 5 * 60 * 1000); // 5 minutes validity

  const qrData = JSON.stringify({
    type: 'attendance_verification',
    protestId,
    timestamp: timestamp.toISOString(),
    expiresAt: expiresAt.toISOString(),
    nonce: Math.random().toString(36).substring(2, 15), // Random string for security
  });

  return {
    qrData: btoa(qrData), // Base64 encode
    expiresAt,
  };
}

// Validate QR code verification data
export function validateQRVerificationData(qrData: string): {
  isValid: boolean;
  protestId?: string;
  reason?: string;
} {
  try {
    const decoded = JSON.parse(atob(qrData));

    if (decoded.type !== 'attendance_verification') {
      return {
        isValid: false,
        reason: 'Código QR inválido',
      };
    }

    const expiresAt = new Date(decoded.expiresAt);
    if (expiresAt < new Date()) {
      return {
        isValid: false,
        reason: 'Código QR expirado',
      };
    }

    return {
      isValid: true,
      protestId: decoded.protestId,
    };
  } catch (error) {
    return {
      isValid: false,
      reason: 'Código QR malformado',
    };
  }
}

// Create attendance verification record
export function createAttendanceVerification(
  userId: string,
  protestId: string,
  location: LocationData | null,
  eventLocation: EventLocation,
  method: 'gps' | 'manual' | 'qr_code'
): AttendanceVerification {
  let distance = 0;
  let status: 'verified' | 'pending' | 'rejected' = 'pending';

  if (location && method === 'gps') {
    const verification = verifyLocationProximity(location, eventLocation);
    distance = verification.distance;
    status = verification.isValid ? 'verified' : 'rejected';
  } else if (method === 'manual') {
    // Manual verification requires admin approval
    status = 'pending';
  } else if (method === 'qr_code') {
    // QR code verification is automatic if valid
    status = 'verified';
  }

  return {
    id: `verification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    protestId,
    location: location || {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      timestamp: new Date(),
    },
    method,
    status,
    distance,
    timestamp: new Date(),
    ipAddress: getClientIP(),
    deviceInfo: getDeviceInfo(),
  };
}

// Get client IP address (simulated for demo)
function getClientIP(): string {
  // In a real application, this would be handled by the server
  return '192.168.1.1'; // Demo IP
}

// Get device information
function getDeviceInfo(): string {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;

  return `${platform} | ${language} | ${userAgent.substring(0, 100)}`;
}

// Estimate travel time to event location
export async function estimateTravelTime(
  userLocation: LocationData,
  eventLocation: EventLocation,
  travelMode: 'walking' | 'driving' | 'transit' = 'walking'
): Promise<{
  duration: number; // in minutes
  distance: number; // in meters
  route?: string;
}> {
  // In a real application, this would use Google Maps API or similar
  // For demo purposes, we'll provide estimated values

  const straightLineDistance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    eventLocation.latitude,
    eventLocation.longitude
  );

  // Rough estimates based on travel mode
  let speedKmh = 5; // walking speed
  if (travelMode === 'driving') speedKmh = 30; // city driving
  if (travelMode === 'transit') speedKmh = 20; // public transport

  const routeDistance = straightLineDistance * 1.3; // add 30% for actual route
  const durationMinutes = (routeDistance / 1000 / speedKmh) * 60;

  return {
    duration: Math.round(durationMinutes),
    distance: Math.round(routeDistance),
    route: `Rota estimada via ${travelMode}`,
  };
}

// Check if user is likely to be at the event based on multiple factors
export function calculateAttendanceProbability(
  userLocation: LocationData,
  eventLocation: EventLocation,
  eventTime: Date,
  userHistory?: AttendanceVerification[]
): {
  probability: number; // 0-1
  factors: string[];
  recommendation: string;
} {
  const factors: string[] = [];
  let score = 0;

  // Distance factor (0-40 points)
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    eventLocation.latitude,
    eventLocation.longitude
  );

  if (distance <= eventLocation.radius) {
    score += 40;
    factors.push('Dentro do raio do evento');
  } else if (distance <= eventLocation.radius * 2) {
    score += 20;
    factors.push('Próximo ao evento');
  } else if (distance <= eventLocation.radius * 5) {
    score += 10;
    factors.push('Na região do evento');
  }

  // Time factor (0-20 points)
  const now = new Date();
  const timeDiff = Math.abs(now.getTime() - eventTime.getTime()) / (1000 * 60); // minutes

  if (timeDiff <= 30) {
    score += 20;
    factors.push('Horário do evento');
  } else if (timeDiff <= 60) {
    score += 10;
    factors.push('Próximo ao horário');
  }

  // GPS accuracy (0-20 points)
  if (userLocation.accuracy <= 10) {
    score += 20;
    factors.push('GPS preciso');
  } else if (userLocation.accuracy <= 50) {
    score += 10;
    factors.push('GPS moderado');
  }

  // History factor (0-20 points)
  if (userHistory && userHistory.length > 0) {
    const recentVerifications = userHistory.filter(
      (v) => v.status === 'verified' && v.method === 'gps'
    );
    if (recentVerifications.length > 0) {
      score += 20;
      factors.push('Histórico confiável');
    }
  }

  const probability = Math.min(score / 100, 1);

  let recommendation = 'Verificação necessária';
  if (probability >= 0.8) {
    recommendation = 'Presença altamente provável';
  } else if (probability >= 0.6) {
    recommendation = 'Presença provável';
  } else if (probability >= 0.4) {
    recommendation = 'Presença possível';
  } else {
    recommendation = 'Presença improvável';
  }

  return {
    probability,
    factors,
    recommendation,
  };
}