
import { TripItinerary, TripStatus } from './types';

// Add missing travelerCount to satisfy UserPreferences type
export const INITIAL_PREFERENCES = {
  postcode: '',
  destination: 'Tokyo & Kyoto',
  mood: 'Cultural' as const,
  companion: 'Partner' as const,
  budget: 'Elite' as const,
  duration: 4,
  travelerCount: 2
};

// Update fallback to fully satisfy TripItinerary type including missing properties
export const FALLBACK_ITINERARY: TripItinerary = {
  id: "fallback-itinerary-001",
  location: "Tokyo & Kyoto",
  dates: "Oct 12 — Oct 19, 2024",
  status: TripStatus.GENERATED,
  days: [
    {
      dayNumber: 1,
      label: "Arrival",
      items: [
        {
          time: "09:00 AM",
          period: "MORNING",
          title: "Touchdown & Transit",
          description: "Proceed to Terminal 1. Voyager AI predicts a smooth 45min queue based on current flight data. Board the 10:45 AM N'EX Express to Shinjuku.",
          meta: { distance: "Direct from NRT" }
        },
        {
          time: "12:30 PM",
          period: "LUNCH",
          title: "Fuunji Ramen",
          description: "Try the Special Archer Tsukemen (Dipping Noodles). The broth is a thick, rich fish and pork blend legendary in Shinjuku.",
          imageUrl: "https://picsum.photos/seed/ramen/600/400",
          meta: { wifi: "85 Mbps", vibe: "Bustling", payment: "Cash Only", distance: "8 min from Station" }
        },
        {
          time: "02:30 PM",
          period: "AFTERNOON",
          title: "Gyoen National Garden",
          description: "Best route starts at Shinjuku Gate. Aim for the French Formal Garden area for the best late-afternoon light.",
          meta: { vibe: "Serene" }
        }
      ]
    }
  ],
  // Corrected property name and structure to match TripItinerary doorToDoor type
  doorToDoor: {
    outbound: [
      { type: 'TAXI', label: '06:15 AM Uber Pick-up', duration: '45m', cost: '$85', optimized: true },
      { type: 'FLIGHT', label: 'JAL · Direct · 13h 20m', duration: '13h 20m', cost: '$1,120', optimized: true }
    ],
    inbound: [],
    totalCost: "$1,120",
    totalTime: "14h"
  },
  accommodation: {
    name: "Park Hyatt Tokyo",
    location: "Shinjuku-ku, Tokyo",
    imageUrl: "https://picsum.photos/seed/hotel/200/200",
    bookingStatus: "Confirmed" // Added missing property
  },
  essentials: {
    esim: [
      { provider: "Airalo (Moshi Moshi)", plan: "10GB · 30 Days", price: "$18.00", coverage: "Japan-wide" }, // Added coverage
      { provider: "Ubigi", plan: "Unlimited · 7 Days", price: "$24.00", coverage: "Japan-wide" } // Added coverage
    ],
    currency: { from: "USD", to: "JPY", rate: 149.20, recommendation: "Exchange at 7-Eleven ATMs for best rates." }, // Added recommendation
    souvenir: { name: "Tokyo Banana (Star Edition)", description: "Found at Gate 15. Only available in evening slots." },
    weather: { forecast: "Sunny", temp: "22°C", icon: "sunny" } // Added missing weather
  },
  // Added missing aiInsights field
  aiInsights: [
    { title: "Smart Travel", message: "Shinjuku station is less crowded before 8:00 AM.", priority: 'LOW' }
  ]
};
