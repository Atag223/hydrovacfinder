import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all pricing tiers
export async function GET() {
  try {
    const tiers = await prisma.pricingTier.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(tiers);
  } catch (error) {
    console.error('Error fetching pricing tiers:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing tiers' }, { status: 500 });
  }
}

// POST create a new pricing tier
export async function POST(request: Request) {
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
