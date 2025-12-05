import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';

// Default pricing tiers when database is not configured
const DEFAULT_PRICING_TIERS = [
  { id: 1, name: 'Basic', monthly: 0, annual: 0, sortOrder: 1 },
  { id: 2, name: 'Verified', monthly: 99, annual: 990, sortOrder: 2 },
  { id: 3, name: 'Featured', monthly: 199, annual: 1990, sortOrder: 3 },
  { id: 4, name: 'Premium', monthly: 399, annual: 3990, sortOrder: 4 },
];

// GET all pricing tiers
export async function GET() {
  if (!isDatabaseConfigured()) {
    // Return default pricing tiers when database is not configured
    return NextResponse.json(DEFAULT_PRICING_TIERS);
  }

  try {
    const tiers = await prisma.pricingTier.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    // Return default tiers if none exist
    if (tiers.length === 0) {
      return NextResponse.json(DEFAULT_PRICING_TIERS);
    }
    return NextResponse.json(tiers);
  } catch (error) {
    console.error('Error fetching pricing tiers:', error);
    return NextResponse.json(DEFAULT_PRICING_TIERS);
  }
}

// POST create a new pricing tier
export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot create pricing tiers without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

  try {
    const body = await request.json();

    const tier = await prisma.pricingTier.create({
      data: body,
    });

    return NextResponse.json(tier, { status: 201 });
  } catch (error) {
    console.error('Error creating pricing tier:', error);
    return NextResponse.json({ error: 'Failed to create pricing tier' }, { status: 500 });
  }
}
