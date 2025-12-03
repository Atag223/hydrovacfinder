// Company tier types
export type HydroVacTier = 'basic' | 'verified' | 'featured' | 'premium';
export type DisposalTier = 'verified';

// Pin colors for map
export const HYDROVAC_PIN_COLORS: Record<HydroVacTier, string> = {
  basic: '#9CA3AF', // Gray - Non-paying companies
  verified: '#3B82F6', // Blue - Verified
  featured: '#EF4444', // Red - Featured
  premium: '#EAB308', // Gold - Premium
};

export const DISPOSAL_PIN_COLOR = '#22C55E'; // Green - Disposal Facilities

// HydroVac Company interface
export interface HydroVacCompany {
  id: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  serviceSpecialties: string[];
  coverageRadius: number;
  unionAffiliation: boolean;
  unionLocalNumber?: string;
  tier: HydroVacTier;
  latitude: number;
  longitude: number;
  profileViews: number;
  clickToCalls: number;
  websiteClicks: number;
  directionRequests: number;
}

// Disposal Facility interface
export interface DisposalFacility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  materialsAccepted: string[];
  hours: string;
  phone: string;
  tier: DisposalTier;
  latitude: number;
  longitude: number;
  clicks: number;
  images?: string[];
}

// Filter types
export type FilterType = 'all' | 'hydrovac' | 'disposal';

// Search radius options
export type SearchRadius = 25 | 50 | 75 | 100;

// Search location coordinates
export interface SearchLocation {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @returns Distance in miles
 */
export function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Membership pricing
export interface MembershipPackage {
  tier: HydroVacTier | 'state-ownership' | DisposalTier;
  name: string;
  monthlyPrice?: number;
  yearlyPrice: number;
  features: string[];
  pinColor: string;
}

// Analytics date filter
export type DateFilter = 'today' | '7days' | '30days' | 'allTime';

// Analytics data
export interface AnalyticsData {
  totalVisits: number;
  visitsByState: Record<string, number>;
  topStatePages: { state: string; views: number }[];
  companyMetrics: {
    profileViews: number;
    clickToCalls: number;
    websiteClicks: number;
    directionRequests: number;
    disposalClicks: number;
  };
}

// US States
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];
