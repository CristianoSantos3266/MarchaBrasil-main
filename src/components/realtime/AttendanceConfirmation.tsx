'use client';

import { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface AttendanceConfirmationProps {
  protestId: string;
  protestLocation: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
  };
  userRSVP?: {
    id: string;
    type: 'caminhoneiro' | 'motociclista' | 'cidadao';
    confirmed: boolean;
  };
  onAttendanceConfirmed?: (data: {
    location: GeolocationPosition;
    timestamp: Date;
    method: 'gps' | 'manual';
  }) => void;
}

export default function AttendanceConfirmation({ 
  protestId, 
  protestLocation, 
  userRSVP,
  onAttendanceConfirmed 
}: AttendanceConfirmationProps) {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<'not_confirmed' | 'confirmed' | 'too_far'>('not_confirmed');
  const [distance, setDistance] = useState<number | null>(null);
  const [confirmationTime, setConfirmationTime] = useState<Date | null>(null);

  // Maximum distance in meters to confirm attendance
  const MAX_DISTANCE = 500; // 500 meters

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não é suportada pelo seu navegador');
      setIsLoadingLocation(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      setCurrentLocation(position);
      
      // Calculate distance to protest location
      const dist = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        protestLocation.latitude,
        protestLocation.longitude
      );
      
      setDistance(dist);

      // Check if within attendance range
      if (dist <= MAX_DISTANCE) {
        setAttendanceStatus('confirmed');
        setConfirmationTime(new Date());
        onAttendanceConfirmed?.({
          location: position,
          timestamp: new Date(),
          method: 'gps'
        });
      } else {
        setAttendanceStatus('too_far');
      }

    } catch (error: any) {
      let errorMessage = 'Erro ao obter localização';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permissão de localização negada. Por favor, permita o acesso à localização.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Localização indisponível. Verifique se o GPS está ativo.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tempo limite para obter localização excedido. Tente novamente.';
          break;
      }
      
      setLocationError(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const confirmAttendanceManually = () => {
    // Manual confirmation without GPS (fallback option)
    setAttendanceStatus('confirmed');
    setConfirmationTime(new Date());
    onAttendanceConfirmed?.({
      location: null as any, // No location data for manual confirmation
      timestamp: new Date(),
      method: 'manual'
    });
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  };

  // Don't show if no RSVP
  if (!userRSVP) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
          <div>
            <h3 className="font-semibold text-yellow-900">Confirmação de Presença</h3>
            <p className="text-sm text-yellow-800">
              Faça seu RSVP primeiro para confirmar presença no evento
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <UserGroupIcon className="h-6 w-6" />
          <div>
            <h3 className="text-lg font-bold">Confirmação de Presença</h3>
            <p className="text-sm text-green-100">
              Confirme sua participação no local do evento
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Event Location Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">{protestLocation.name}</h4>
              <p className="text-sm text-gray-600">{protestLocation.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                Você precisa estar a menos de {formatDistance(MAX_DISTANCE)} do local
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Status */}
        {attendanceStatus === 'confirmed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircleSolid className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Presença Confirmada!</h4>
                <p className="text-sm text-green-800">
                  Sua participação foi registrada às {confirmationTime?.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                {distance && (
                  <p className="text-xs text-green-700 mt-1">
                    Distância do evento: {formatDistance(distance)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {attendanceStatus === 'too_far' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-900">Muito Longe do Evento</h4>
                <p className="text-sm text-orange-800">
                  Você está a {distance && formatDistance(distance)} do local. 
                  Aproxime-se para confirmar presença.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Location Error */}
        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Erro de Localização</h4>
                <p className="text-sm text-red-800">{locationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Location Info */}
        {currentLocation && !locationError && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <SignalIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Localização Atual</p>
                <p className="text-blue-800">
                  Lat: {currentLocation.coords.latitude.toFixed(6)}, 
                  Lng: {currentLocation.coords.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Precisão: ±{Math.round(currentLocation.coords.accuracy)}m
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {attendanceStatus === 'not_confirmed' && (
          <div className="space-y-3">
            <button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoadingLocation ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Obtendo Localização...
                </>
              ) : (
                <>
                  <MapPinIcon className="h-5 w-5" />
                  Confirmar Presença com GPS
                </>
              )}
            </button>

            <button
              onClick={confirmAttendanceManually}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheckIcon className="h-5 w-5" />
              Confirmar Manualmente
            </button>

            <p className="text-xs text-gray-500 text-center">
              A confirmação por GPS é mais precisa e verificável. 
              Use a confirmação manual apenas se o GPS não estiver funcionando.
            </p>
          </div>
        )}

        {attendanceStatus === 'too_far' && (
          <button
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isLoadingLocation ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verificando Localização...
              </>
            ) : (
              <>
                <MapPinIcon className="h-5 w-5" />
                Tentar Novamente
              </>
            )}
          </button>
        )}

        {/* Privacy Notice */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <ShieldCheckIcon className="h-4 w-4 text-gray-600 mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-medium">Privacidade:</p>
              <p>
                Sua localização é usada apenas para verificar presença no evento. 
                Os dados não são armazenados permanentemente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}