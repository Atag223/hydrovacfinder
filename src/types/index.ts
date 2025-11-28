// Company tier types
export type HydroVacTier = 'basic' | 'verified' | 'featured' | 'premium';
export type DisposalTier = 'verified';

// Pin colors for map
export const HYDROVAC_PIN_COLORS: Record<HydroVacTier, string> = {
  basic: '#9CA3AF', // Gray
  verified: '#3B82F6', // Blue
  featured: '#22C55E', // Green
  premium: '#EAB308', // Gold
};

export const DISPOSAL_PIN_COLOR = '#22C55E'; // Green

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
