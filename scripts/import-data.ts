/**
 * Data Import Script
 * 
 * This script imports hydrovac companies (with valid websites only) and disposal facilities
 * from the static data files into the Supabase database via Prisma.
 * 
 * Usage: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/import-data.ts
 */

import { PrismaClient } from '@prisma/client';
import companiesData from '../src/data/companies_export.json';

const prisma = new PrismaClient();

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

// Disposal facility data (hardcoded since it's in the same file)
interface DisposalFacilityData {
  name: string;
  address: string;
  city: string;
  state: string;
  materialsAccepted: string[];
  hours: string;
  phone: string;
  latitude: number;
  longitude: number;
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
  // Canadian provinces
  'BC': 'British Columbia', 'AB': 'Alberta', 'SK': 'Saskatchewan', 'MB': 'Manitoba',
  'ON': 'Ontario', 'QC': 'Quebec', 'NB': 'New Brunswick', 'NS': 'Nova Scotia',
  'PE': 'Prince Edward Island', 'NL': 'Newfoundland and Labrador'
};

/**
 * Parse city and state from an address string
 */
function parseCityState(address: string): { city: string; state: string } {
  if (!address) {
    return { city: 'Unknown', state: 'Unknown' };
  }
  
  const parts = address.split(',').map(p => p.trim());
  
  if (parts.length >= 3) {
    const city = parts[parts.length - 3] || 'Unknown';
    const stateZipPart = parts[parts.length - 2] || '';
    const stateMatch = stateZipPart.match(/^([A-Za-z]{2})/);
    const stateAbbr = stateMatch ? stateMatch[1].toUpperCase() : '';
    const state = STATE_ABBR_TO_NAME[stateAbbr] || stateZipPart.split(' ')[0] || 'Unknown';
    return { city, state };
  } else if (parts.length === 2) {
    return { city: parts[0], state: parts[1] };
  }
  
  return { city: 'Unknown', state: 'Unknown' };
}

/**
 * Validate URL
 */
function isValidUrl(urlString: string | null): boolean {
  if (!urlString || urlString.trim() === '') return false;
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Map tier from JSON to database tier format
 */
function mapTier(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'premium':
      return 'Premium';
    case 'featured':
      return 'Featured';
    case 'verified':
      return 'Verified';
    case 'free':
    case 'basic':
    default:
      return 'Basic';
  }
}

// Disposal facilities data
const disposalFacilities: DisposalFacilityData[] = [
  {
    name: 'Clean Harbors Deer Park',
    address: '2027 Independence Pkwy S',
    city: 'Deer Park',
    state: 'Texas',
    materialsAccepted: ['Drilling Mud', 'Industrial Waste', 'Contaminated Soil', 'Hydrovac Slurry'],
    hours: 'Mon-Fri: 6AM-6PM, Sat: 7AM-3PM',
    phone: '(281) 930-2300',
    latitude: 29.7052,
    longitude: -95.1158,
  },
  {
    name: 'Republic Services Landfill',
    address: '10310 Hirsch Road',
    city: 'Houston',
    state: 'Texas',
    materialsAccepted: ['Non-Hazardous Waste', 'Construction Debris', 'Hydrovac Spoils'],
    hours: 'Mon-Fri: 6AM-5PM, Sat: 6AM-12PM',
    phone: '(713) 635-0005',
    latitude: 29.8500,
    longitude: -95.3600,
  },
  {
    name: 'Waste Management Kettleman Hills',
    address: '35251 Skyline Road',
    city: 'Kettleman City',
    state: 'California',
    materialsAccepted: ['Hazardous Waste', 'Industrial Sludge', 'Contaminated Materials'],
    hours: 'Mon-Sat: 7AM-5PM',
    phone: '(559) 386-9711',
    latitude: 35.9900,
    longitude: -119.9600,
  },
  {
    name: 'US Ecology Idaho',
    address: '20400 Lemley Road',
    city: 'Grand View',
    state: 'Idaho',
    materialsAccepted: ['Hazardous Waste', 'Industrial Waste', 'Drilling Fluids'],
    hours: 'Mon-Fri: 7AM-4PM',
    phone: '(208) 834-2275',
    latitude: 42.9800,
    longitude: -116.1100,
  },
  {
    name: 'Stericycle Environmental Solutions',
    address: '4010 Commercial Avenue',
    city: 'Northbrook',
    state: 'Illinois',
    materialsAccepted: ['Medical Waste', 'Industrial Waste', 'Contaminated Soil'],
    hours: 'Mon-Fri: 6AM-6PM',
    phone: '(847) 498-1600',
    latitude: 42.1275,
    longitude: -87.8290,
  },
  {
    name: 'Pacific Northwest Disposal',
    address: '1500 Industrial Way',
    city: 'Portland',
    state: 'Oregon',
    materialsAccepted: ['Non-Hazardous Waste', 'Hydrovac Slurry', 'Construction Debris'],
    hours: 'Mon-Fri: 6AM-5PM',
    phone: '(503) 555-0123',
    latitude: 45.5152,
    longitude: -122.6784,
  },
  {
    name: 'Rocky Mountain Disposal Center',
    address: '8900 Industrial Blvd',
    city: 'Denver',
    state: 'Colorado',
    materialsAccepted: ['Industrial Waste', 'Drilling Fluids', 'Contaminated Soil'],
    hours: 'Mon-Sat: 6AM-6PM',
    phone: '(303) 555-0456',
    latitude: 39.7000,
    longitude: -105.0200,
  },
  {
    name: 'Great Lakes Environmental',
    address: '2200 Lake Shore Drive',
    city: 'Cleveland',
    state: 'Ohio',
    materialsAccepted: ['Hazardous Waste', 'Industrial Sludge', 'Hydrovac Spoils'],
    hours: 'Mon-Fri: 7AM-5PM',
    phone: '(216) 555-0789',
    latitude: 41.4993,
    longitude: -81.6944,
  },
  {
    name: 'Southeast Disposal Services',
    address: '5500 Industrial Park Rd',
    city: 'Charlotte',
    state: 'North Carolina',
    materialsAccepted: ['Non-Hazardous Waste', 'Construction Debris', 'Drilling Mud'],
    hours: 'Mon-Fri: 6AM-6PM, Sat: 7AM-2PM',
    phone: '(704) 555-0321',
    latitude: 35.2271,
    longitude: -80.8431,
  },
  {
    name: 'Midwest Environmental Center',
    address: '7800 County Road 15',
    city: 'Kansas City',
    state: 'Missouri',
    materialsAccepted: ['Industrial Waste', 'Contaminated Soil', 'Hydrovac Slurry'],
    hours: 'Mon-Fri: 6AM-5PM',
    phone: '(816) 555-0654',
    latitude: 39.0997,
    longitude: -94.5786,
  },
];

async function importCompanies() {
  console.log('Starting company import...');
  
  const rawCompanies = companiesData as RawCompany[];
  
  // Filter companies with valid websites
  const companiesWithWebsites = rawCompanies.filter(company => {
    const hasValidWebsite = isValidUrl(company.website);
    const { city, state } = parseCityState(company.address);
    const hasValidLocation = city !== 'Unknown' && state !== 'Unknown';
    const hasName = company.name && company.name.trim() !== '';
    
    return hasValidWebsite && hasValidLocation && hasName;
  });
  
  console.log(`Found ${companiesWithWebsites.length} companies with valid websites out of ${rawCompanies.length} total`);
  
  // Track duplicates by name + state
  const seen = new Set<string>();
  const uniqueCompanies: RawCompany[] = [];
  
  for (const company of companiesWithWebsites) {
    const { state } = parseCityState(company.address);
    const key = `${company.name.toLowerCase()}_${state.toLowerCase()}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueCompanies.push(company);
    }
  }
  
  console.log(`After removing duplicates: ${uniqueCompanies.length} companies`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const company of uniqueCompanies) {
    const { city, state } = parseCityState(company.address);
    
    try {
      // Check if company already exists
      const existingCompany = await prisma.company.findFirst({
        where: {
          name: company.name,
          state: state,
        },
      });
      
      if (existingCompany) {
        skipped++;
        continue;
      }
      
      await prisma.company.create({
        data: {
          name: company.name,
          city: city,
          state: state,
          phone: company.phone || null,
          website: company.website,
          tier: mapTier(company.tier),
          coverageRadius: null,
          latitude: company.lat,
          longitude: company.lng,
          unionAffiliated: company.is_union || false,
          specialties: company.services || null,
          email: company.email || null,
          address: company.address || null,
        },
      });
      
      imported++;
    } catch (error) {
      console.error(`Error importing company ${company.name}:`, error);
    }
  }
  
  console.log(`Imported ${imported} companies, skipped ${skipped} (already exist)`);
}

async function importDisposalFacilities() {
  console.log('\nStarting disposal facility import...');
  
  let imported = 0;
  let skipped = 0;
  
  for (const facility of disposalFacilities) {
    try {
      // Check if facility already exists
      const existingFacility = await prisma.disposalFacility.findFirst({
        where: {
          name: facility.name,
          state: facility.state,
        },
      });
      
      if (existingFacility) {
        skipped++;
        continue;
      }
      
      await prisma.disposalFacility.create({
        data: {
          name: facility.name,
          address: facility.address,
          city: facility.city,
          state: facility.state,
          phone: facility.phone,
          hours: facility.hours,
          latitude: facility.latitude,
          longitude: facility.longitude,
          materialsAccepted: facility.materialsAccepted.join(', '),
        },
      });
      
      imported++;
    } catch (error) {
      console.error(`Error importing facility ${facility.name}:`, error);
    }
  }
  
  console.log(`Imported ${imported} disposal facilities, skipped ${skipped} (already exist)`);
}

async function validateImport() {
  console.log('\nValidating import...');
  
  const companyCount = await prisma.company.count();
  const facilityCount = await prisma.disposalFacility.count();
  
  console.log(`Total companies in database: ${companyCount}`);
  console.log(`Total disposal facilities in database: ${facilityCount}`);
  
  // Sample some data
  const sampleCompanies = await prisma.company.findMany({ take: 5 });
  console.log('\nSample companies:');
  sampleCompanies.forEach(c => console.log(`  - ${c.name} (${c.city}, ${c.state})`));
  
  const sampleFacilities = await prisma.disposalFacility.findMany({ take: 5 });
  console.log('\nSample facilities:');
  sampleFacilities.forEach(f => console.log(`  - ${f.name} (${f.city}, ${f.state})`));
}

async function main() {
  console.log('=== Data Import Script ===\n');
  
  try {
    await importCompanies();
    await importDisposalFacilities();
    await validateImport();
    
    console.log('\n=== Import completed successfully! ===');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
