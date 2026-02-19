
import { UserPreferences, TransportSegment } from "../types";

/**
 * Simulates a door-to-door transport optimization engine.
 * In a real backend, this would use Google Maps Routes API, Skyscanner API, etc.
 */
export const optimizeTransport = (prefs: UserPreferences): { outbound: TransportSegment[], inbound: TransportSegment[] } => {
  // Mock logic: Calculate nearest airport based on postcode
  const isLondon = prefs.postcode.toUpperCase().startsWith('SW') || prefs.postcode.toUpperCase().startsWith('E');
  const departureAirport = isLondon ? 'LHR (Heathrow)' : 'LGW (Gatwick)';
  
  const outbound: TransportSegment[] = [
    {
      type: 'TAXI',
      label: `Home to ${departureAirport}`,
      duration: '45m',
      cost: prefs.budget === 'Elite' ? '$85 (Uber Black)' : '$45 (UberX)',
      optimized: true,
      notes: 'Scheduled for 06:15 AM'
    },
    {
      type: 'FLIGHT',
      label: `Direct to ${prefs.destination.split(' ')[0]}`,
      duration: '11h 20m',
      cost: prefs.budget === 'Elite' ? '$4,200 (Business)' : '$1,120 (Economy)',
      optimized: true,
      notes: 'Lufthansa / JAL codeshare'
    },
    {
      type: 'TRAIN',
      label: 'Airport Express to City Center',
      duration: '35m',
      cost: '$22',
      optimized: true,
      notes: 'Contactless payment enabled'
    }
  ];

  const inbound: TransportSegment[] = [
    {
      type: 'TRAIN',
      label: 'City Express to Airport',
      duration: '40m',
      cost: '$22',
      optimized: true
    },
    {
      type: 'FLIGHT',
      label: 'Return Flight',
      duration: '12h 10m',
      cost: 'Included',
      optimized: true
    },
    {
      type: 'TAXI',
      label: 'Airport to Home',
      duration: '50m',
      cost: '$50',
      optimized: true
    }
  ];

  return { outbound, inbound };
};
