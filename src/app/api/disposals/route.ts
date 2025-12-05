import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import disposalSitesData from '@/data/disposal_sites.json';

// Transform JSON disposal site to database format
interface RawDisposalJson {
  name: string;
  address: string;
  city: string;
  state: string;
  materialsAccepted: string;
  hours: string;
  phone: string;
  latitude: number;
  longitude: number;
}

function transformJsonToDbFormat(raw: RawDisposalJson, index: number) {
  return {
    id: index + 1,
    name: raw.name,
    address: raw.address,
    city: raw.city,
    state: raw.state,
    phone: raw.phone || null,
    hours: raw.hours || null,
    latitude: raw.latitude,
    longitude: raw.longitude,
    materialsAccepted: raw.materialsAccepted || null,
  };
}

// GET all disposal facilities
export async function GET() {
  // If database is not configured, return fallback data
  if (!isDatabaseConfigured()) {
    console.log('Database not configured, using fallback JSON data for disposals');
    const fallbackFacilities = (disposalSitesData as RawDisposalJson[]).map(transformJsonToDbFormat);
    return NextResponse.json(fallbackFacilities);
  }

  try {
    const facilities = await prisma.disposalFacility.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(facilities);
  } catch (error) {
    console.error('Error fetching disposal facilities:', error);
    // Fall back to JSON data if database query fails
    console.log('Database query failed, using fallback JSON data for disposals');
    const fallbackFacilities = (disposalSitesData as RawDisposalJson[]).map(transformJsonToDbFormat);
    return NextResponse.json(fallbackFacilities);
  }
}

// POST create a new disposal facility
export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot create disposal facilities without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

  try {
    const body = await request.json();

    const facility = await prisma.disposalFacility.create({
      data: body,
    });

    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    console.error('Error creating disposal facility:', error);
    return NextResponse.json({ error: 'Failed to create disposal facility' }, { status: 500 });
  }
}
