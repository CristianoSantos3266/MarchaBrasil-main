import { Protest } from '@/types';

export const globalProtests: Protest[] = [
  // All protest data cleared - ready for new events to be added
];

// Helper function to get protests by country and region
export function getProtestsByCountryAndRegion(country?: string, region?: string): Protest[] {
  if (!country) return globalProtests;
  
  return globalProtests.filter(protest => {
    if (protest.country !== country) return false;
    if (region && protest.region !== region) return false;
    return true;
  });
}