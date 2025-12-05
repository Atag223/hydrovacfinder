import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import companiesData from '@/data/companies_export.json';

// Transform raw JSON company to database format for fallback
interface RawCompanyJson {
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
};

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

function transformJsonToDbFormat(raw: RawCompanyJson) {
  const { city, state } = parseCityState(raw.address);
  const tier = raw.tier === 'free' ? 'Basic' : raw.tier.charAt(0).toUpperCase() + raw.tier.slice(1);
  
  return {
    id: raw.id,
    name: raw.name,
    city,
    state,
    phone: raw.phone || null,
    website: raw.website || null,
    tier,
    coverageRadius: 100,
    latitude: raw.lat,
    longitude: raw.lng,
    unionAffiliated: raw.is_union,
    specialties: raw.services || null,
  };
}

// GET all companies
export async function GET() {
  // If database is not configured, return fallback data
  if (!isDatabaseConfigured()) {
    console.log('Database not configured, using fallback JSON data');
    const fallbackCompanies = (companiesData as RawCompanyJson[]).map(transformJsonToDbFormat);
    return NextResponse.json(fallbackCompanies);
  }

  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    // Fall back to JSON data if database query fails
    console.log('Database query failed, using fallback JSON data');
    const fallbackCompanies = (companiesData as RawCompanyJson[]).map(transformJsonToDbFormat);
    return NextResponse.json(fallbackCompanies);
  }
}

// Validation error response type
interface ValidationErrors {
  [field: string]: string;
}

// POST create a new company
export async function POST(request: Request) {
  // Check if database is configured
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot create companies without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    const errors: ValidationErrors = {};

    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!body.city || typeof body.city !== 'string' || body.city.trim() === '') {
      errors.city = 'City is required';
    }

    if (!body.state || typeof body.state !== 'string' || body.state.trim() === '') {
      errors.state = 'State is required';
    }

    // Validate optional fields if provided
    if (body.phone !== undefined && body.phone !== null && typeof body.phone !== 'string') {
      errors.phone = 'Phone must be a string';
    }

    if (body.website !== undefined && body.website !== null && typeof body.website !== 'string') {
      errors.website = 'Website must be a string';
    }

    if (body.tier !== undefined && body.tier !== null && typeof body.tier !== 'string') {
      errors.tier = 'Tier must be a string';
    }

    if (body.coverageRadius !== undefined && body.coverageRadius !== null) {
      if (typeof body.coverageRadius !== 'number' || !Number.isInteger(body.coverageRadius) || body.coverageRadius < 0) {
        errors.coverageRadius = 'Coverage radius must be a non-negative integer';
      }
    }

    if (body.latitude !== undefined && body.latitude !== null && typeof body.latitude !== 'number') {
      errors.latitude = 'Latitude must be a number';
    }

    if (body.longitude !== undefined && body.longitude !== null && typeof body.longitude !== 'number') {
      errors.longitude = 'Longitude must be a number';
    }

    if (body.unionAffiliated !== undefined && body.unionAffiliated !== null && typeof body.unionAffiliated !== 'boolean') {
      errors.unionAffiliated = 'Union affiliated must be a boolean';
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // Convert specialties from comma-separated string to stored format
    let specialties: string | null = null;
    if (body.specialties) {
      if (typeof body.specialties === 'string') {
        // If it's already a string, store as-is (trim whitespace)
        specialties = body.specialties.trim() || null;
      } else if (Array.isArray(body.specialties)) {
        // If it's an array, convert to comma-separated string (filter out non-strings)
        const specialtiesArray = body.specialties as unknown[];
        specialties = specialtiesArray
          .filter((s: unknown): s is string => typeof s === 'string')
          .map((s: string) => s.trim())
          .filter(Boolean)
          .join(', ') || null;
      }
    }

    const company = await prisma.company.create({
      data: {
        name: body.name.trim(),
        city: body.city.trim(),
        state: body.state.trim(),
        phone: body.phone?.trim() || null,
        website: body.website?.trim() || null,
        tier: body.tier?.trim() || 'Basic',
        coverageRadius: body.coverageRadius ?? null,
        latitude: body.latitude ?? null,
        longitude: body.longitude ?? null,
        unionAffiliated: body.unionAffiliated ?? false,
        specialties,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
