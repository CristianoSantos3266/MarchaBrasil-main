export interface Protest {
  id: string;
  title: string;
  description: string;
  city: string;
  state?: string; // Legacy support for state property
  region: string; // state/province/region code
  country: string; // country code
  date: string;
  time: string;
  location: string;
  type: ProtestType;
  coordinates?: [number, number];
  convoy?: ConvoyInfo;
  thumbnail?: string; // Base64 image data or URL
  rsvps: RSVPCounts; // Legacy for existing data
  rsvpsDetailed?: RSVPCountsDetailed; // New structure
  results?: ProtestResults;
  createdBy?: string; // User ID who created the event
  createdAt: string;
  updatedAt: string;
}

export interface ConvoyInfo {
  startLocation: string;
  startCoordinates: [number, number];
  departureTime: string;
  destination: string;
  destinationCoordinates: [number, number];
  route?: RoutePoint[];
  description?: string;
}

export interface RoutePoint {
  coordinates: [number, number];
  name: string;
  estimatedTime?: string;
}

export interface RSVPCounts {
  caminhoneiros: number;
  motociclistas: number;
  carros: number;
  tratores: number;
  produtoresRurais: number;
  comerciantes: number;
  populacaoGeral: number;
  [key: string]: number; // Index signature to allow string indexing
}

export interface RSVPCountsDetailed {
  anonymous: RSVPCounts;
  verified: RSVPCounts;
  total: RSVPCounts;
}

export interface EmailSubscription {
  id: string;
  email: string;
  countries: string[];
  regions: string[];
  protestTypes: ProtestType[];
  createdAt: string;
}

export interface RSVP {
  id: string;
  protestId: string;
  participantType: ParticipantType;
  joinLocation?: ConvoyJoinLocation;
  timestamp: string;
  isVerified?: boolean;
  email?: string;
  phone?: string;
  ipHash?: string;
}

export type ProtestType = 
  | 'marcha'
  | 'motociata'
  | 'carreata'
  | 'caminhoneiros'
  | 'tratorada'
  | 'assembleia'
  | 'manifestacao'
  | 'outro';

export type ParticipantType = 
  | 'caminhoneiro'
  | 'motociclista'
  | 'carro'
  | 'trator'
  | 'produtor_rural'
  | 'comerciante'
  | 'populacao_geral';

export type ConvoyJoinLocation = 
  | 'inicio'
  | 'rota'
  | 'destino';

export interface BrazilState {
  code: string;
  name: string;
  coordinates: [number, number];
}

export interface CountryRegion {
  countryCode: string;
  regionCode: string;
  countryName: string;
  regionName: string;
}

export interface ProtestResults {
  estimatedTurnout: TurnoutEstimate;
  verifications: VerificationCounts;
  communityImages: CommunityImage[];
  testimonials: AnonymousTestimonial[];
  lastUpdated: string;
}

export interface TurnoutEstimate {
  rsvpBased: number;
  communityReported: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  source: string;
}

export interface VerificationCounts {
  iwasthere: number;
  uniqueVerifications: number;
  lastVerification: string;
}

export interface CommunityImage {
  id: string;
  originalUrl: string;
  blurredUrl: string;
  thumbnailUrl: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
  reportedCount: number;
  upvotes: number;
  tags: string[];
}

export interface AnonymousTestimonial {
  id: string;
  content: string;
  participantType: ParticipantType;
  location?: string; // general area, not specific
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  upvotes: number;
  reportedCount: number;
}

export interface ImageModerationData {
  hasBlurredFaces: boolean;
  hasBlurredPlates: boolean;
  detectedObjects: string[];
  safetyScore: number; // 0-100
  moderatorNotes?: string;
}