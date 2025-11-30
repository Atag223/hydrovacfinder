import { HydroVacCompany, DisposalFacility, HydroVacTier } from '@/types';
import companiesData from './companies_export.json';

// Raw company data type from the JSON file
interface RawCompany {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  description: string;
  services: string;
  coverage_area: string;
  lat: number | null;
  lng: number | null;
  tier: string;
  logo_url: string | null;
  created_at: string;
  is_union: boolean;
  union_name: string | null;
}

/**
 * Parse city and state from an address string
 * Expected format: "Street Address, City, STATE ZIP, Country" or similar
 */
function parseCityState(address: string): { city: string; state: string } {
  if (!address) {
    return { city: 'Unknown', state: 'Unknown' };
  }
  
  // Split by comma
  const parts = address.split(',').map(p => p.trim());
  
  // Try to extract city and state
  // Usually format is: "Street Address, City, STATE ZIP, Country"
  if (parts.length >= 3) {
    const city = parts[parts.length - 3] || 'Unknown';
    // State part usually contains "STATE ZIP"
    const stateZipPart = parts[parts.length - 2] || '';
    // Extract just the state abbreviation (first word before ZIP)
    const stateMatch = stateZipPart.match(/^([A-Za-z]{2})/);
    const stateAbbr = stateMatch ? stateMatch[1].toUpperCase() : '';
    
    // Convert state abbreviation to full name
    const state = STATE_ABBR_TO_NAME[stateAbbr] || stateZipPart.split(' ')[0] || 'Unknown';
    
    return { city, state };
  } else if (parts.length === 2) {
    return { city: parts[0], state: parts[1] };
  }
  
  return { city: 'Unknown', state: 'Unknown' };
}

/**
 * Map tier from JSON to HydroVacTier
 */
function mapTier(tier: string): HydroVacTier {
  switch (tier.toLowerCase()) {
    case 'premium':
      return 'premium';
    case 'featured':
      return 'featured';
    case 'verified':
      return 'verified';
    case 'free':
    case 'basic':
    default:
      return 'basic';
  }
}

/**
 * Parse services string into array
 */
function parseServices(services: string): string[] {
  if (!services) {
    return ['Hydro Excavation'];
  }
  
  // Split by comma and clean up
  return services.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// State abbreviation to full name mapping
const STATE_ABBR_TO_NAME: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia',
  // Canadian provinces (some entries in data may be from Canada)
  'BC': 'British Columbia', 'AB': 'Alberta', 'SK': 'Saskatchewan', 'MB': 'Manitoba',
  'ON': 'Ontario', 'QC': 'Quebec', 'NB': 'New Brunswick', 'NS': 'Nova Scotia',
  'PE': 'Prince Edward Island', 'NL': 'Newfoundland and Labrador'
};

/**
 * Transform raw company data to HydroVacCompany format
 */
function transformCompany(raw: RawCompany): HydroVacCompany | null {
  // Skip companies without valid coordinates
  if (raw.lat === null || raw.lng === null) {
    return null;
  }
  
  const { city, state } = parseCityState(raw.address);
  
  return {
    id: String(raw.id),
    name: raw.name,
    city,
    state,
    phone: raw.phone || '',
    website: raw.website || '',
    serviceSpecialties: parseServices(raw.services),
    coverageRadius: 100, // Default coverage radius
    unionAffiliation: raw.is_union,
    unionLocalNumber: raw.union_name || undefined,
    tier: mapTier(raw.tier),
    latitude: raw.lat,
    longitude: raw.lng,
    // Default analytics values for new companies
    profileViews: Math.floor(Math.random() * 500) + 100,
    clickToCalls: Math.floor(Math.random() * 100) + 20,
    websiteClicks: Math.floor(Math.random() * 200) + 50,
    directionRequests: Math.floor(Math.random() * 80) + 10,
  };
}

// Transform all companies from the JSON data
export const mockHydroVacCompanies: HydroVacCompany[] = (companiesData as RawCompany[])
  .map(transformCompany)
  .filter((company): company is HydroVacCompany => company !== null);

export const mockDisposalFacilities: DisposalFacility[] = [
  {
    id: 'd1',
    name: 'Clean Harbors Deer Park',
    address: '2027 Independence Pkwy S',
    city: 'Deer Park',
    state: 'Texas',
    materialsAccepted: ['Drilling Mud', 'Industrial Waste', 'Contaminated Soil', 'Hydrovac Slurry'],
    hours: 'Mon-Fri: 6AM-6PM, Sat: 7AM-3PM',
    phone: '(281) 930-2300',
    tier: 'verified',
    latitude: 29.7052,
    longitude: -95.1158,
    clicks: 680,
  },
  {
    id: 'd2',
    name: 'Republic Services Landfill',
    address: '10310 Hirsch Road',
    city: 'Houston',
    state: 'Texas',
    materialsAccepted: ['Non-Hazardous Waste', 'Construction Debris', 'Hydrovac Spoils'],
    hours: 'Mon-Fri: 6AM-5PM, Sat: 6AM-12PM',
    phone: '(713) 635-0005',
    tier: 'verified',
    latitude: 29.8500,
    longitude: -95.3600,
    clicks: 520,
  },
  {
    id: 'd3',
    name: 'Waste Management Kettleman Hills',
    address: '35251 Skyline Road',
    city: 'Kettleman City',
    state: 'California',
    materialsAccepted: ['Hazardous Waste', 'Industrial Sludge', 'Contaminated Materials'],
    hours: 'Mon-Sat: 7AM-5PM',
    phone: '(559) 386-9711',
    tier: 'verified',
    latitude: 35.9900,
    longitude: -119.9600,
    clicks: 445,
  },
  {
    id: 'd4',
    name: 'US Ecology Idaho',
    address: '20400 Lemley Road',
    city: 'Grand View',
    state: 'Idaho',
    materialsAccepted: ['Hazardous Waste', 'Industrial Waste', 'Drilling Fluids'],
    hours: 'Mon-Fri: 7AM-4PM',
    phone: '(208) 834-2275',
    tier: 'verified',
    latitude: 42.9800,
    longitude: -116.1100,
    clicks: 320,
  },
  {
    id: 'd5',
    name: 'Stericycle Environmental Solutions',
    address: '4010 Commercial Avenue',
    city: 'Northbrook',
    state: 'Illinois',
    materialsAccepted: ['Medical Waste', 'Industrial Waste', 'Contaminated Soil'],
    hours: 'Mon-Fri: 6AM-6PM',
    phone: '(847) 498-1600',
    tier: 'verified',
    latitude: 42.1275,
    longitude: -87.8290,
    clicks: 275,
  },
  // Additional disposal facilities for nationwide coverage
  {
    id: 'd6',
    name: 'Pacific Northwest Disposal',
    address: '1500 Industrial Way',
    city: 'Portland',
    state: 'Oregon',
    materialsAccepted: ['Non-Hazardous Waste', 'Hydrovac Slurry', 'Construction Debris'],
    hours: 'Mon-Fri: 6AM-5PM',
    phone: '(503) 555-0123',
    tier: 'verified',
    latitude: 45.5152,
    longitude: -122.6784,
    clicks: 380,
  },
  {
    id: 'd7',
    name: 'Rocky Mountain Disposal Center',
    address: '8900 Industrial Blvd',
    city: 'Denver',
    state: 'Colorado',
    materialsAccepted: ['Industrial Waste', 'Drilling Fluids', 'Contaminated Soil'],
    hours: 'Mon-Sat: 6AM-6PM',
    phone: '(303) 555-0456',
    tier: 'verified',
    latitude: 39.7000,
    longitude: -105.0200,
    clicks: 420,
  },
  {
    id: 'd8',
    name: 'Great Lakes Environmental',
    address: '2200 Lake Shore Drive',
    city: 'Cleveland',
    state: 'Ohio',
    materialsAccepted: ['Hazardous Waste', 'Industrial Sludge', 'Hydrovac Spoils'],
    hours: 'Mon-Fri: 7AM-5PM',
    phone: '(216) 555-0789',
    tier: 'verified',
    latitude: 41.4993,
    longitude: -81.6944,
    clicks: 345,
  },
  {
    id: 'd9',
    name: 'Southeast Disposal Services',
    address: '5500 Industrial Park Rd',
    city: 'Charlotte',
    state: 'North Carolina',
    materialsAccepted: ['Non-Hazardous Waste', 'Construction Debris', 'Drilling Mud'],
    hours: 'Mon-Fri: 6AM-6PM, Sat: 7AM-2PM',
    phone: '(704) 555-0321',
    tier: 'verified',
    latitude: 35.2271,
    longitude: -80.8431,
    clicks: 290,
  },
  {
    id: 'd10',
    name: 'Midwest Environmental Center',
    address: '7800 County Road 15',
    city: 'Kansas City',
    state: 'Missouri',
    materialsAccepted: ['Industrial Waste', 'Contaminated Soil', 'Hydrovac Slurry'],
    hours: 'Mon-Fri: 6AM-5PM',
    phone: '(816) 555-0654',
    tier: 'verified',
    latitude: 39.0997,
    longitude: -94.5786,
    clicks: 310,
  },
];
