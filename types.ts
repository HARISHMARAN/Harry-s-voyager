
export enum AppState {
  LANDING = 'LANDING',
  PLANNING = 'PLANNING',
  GENERATING = 'GENERATING',
  DASHBOARD = 'DASHBOARD'
}

export enum TripStatus {
  DRAFT = 'DRAFT',
  PLANNING = 'PLANNING',
  OPTIMIZING = 'OPTIMIZING',
  GENERATED = 'GENERATED',
  ACTIVE = 'ACTIVE'
}

export interface UserPreferences {
  postcode: string;
  destination: string;
  mood: 'Adventurous' | 'Relaxed' | 'Cultural' | 'Luxury';
  companion: 'Solo' | 'Partner' | 'Family' | 'Friends';
  budget: 'Economy' | 'Business' | 'Elite';
  duration: number;
  startDate?: string;
  travelerCount: number;
  dietary?: string[];
  travelMode?: 'Cheapest' | 'Fastest' | 'Balanced';
}

export interface TransportSegment {
  type: 'TAXI' | 'TRAIN' | 'FLIGHT' | 'WALK' | 'BUS';
  label: string;
  duration: string;
  cost: string;
  optimized: boolean;
  notes?: string;
}

export interface ItineraryItem {
  time: string;
  period: 'MORNING' | 'LUNCH' | 'AFTERNOON' | 'EVENING';
  title: string;
  description: string;
  imageUrl?: string;
  meta?: {
    wifi?: string;
    vibe?: string;
    payment?: string;
    distance?: string;
  };
}

export interface DayPlan {
  dayNumber: number;
  label: string;
  items: ItineraryItem[];
}

export interface TripItinerary {
  id: string;
  location: string;
  dates: string;
  status: TripStatus;
  days: DayPlan[];
  doorToDoor: {
    outbound: TransportSegment[];
    inbound: TransportSegment[];
    totalCost: string;
    totalTime: string;
  };
  accommodation: {
    name: string;
    location: string;
    imageUrl: string;
    bookingStatus: string;
  };
  essentials: {
    esim: { provider: string; plan: string; price: string; coverage: string }[];
    currency: { from: string; to: string; rate: number; recommendation: string };
    souvenir: { name: string; description: string };
    weather: { forecast: string; temp: string; icon: string };
  };
  aiInsights: {
    title: string;
    message: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
}
