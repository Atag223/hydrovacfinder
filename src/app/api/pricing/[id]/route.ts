import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single pricing tier by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const tier = await prisma.pricingTier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tier) {
      return NextResponse.json({ error: 'Pricing tier not found' }, { status: 404 });
    }

    return NextResponse.json(tier);
  } catch (error) {
    console.error('Error fetching pricing tier:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing tier' }, { status: 500 });
  }
}

// PUT update pricing tier
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const tier = await prisma.pricingTier.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(tier);
  } catch (error) {
    console.error('Error updating pricing tier:', error);
    return NextResponse.json({ error: 'Failed to update pricing tier' }, { status: 500 });
  }
}

// DELETE pricing tier
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.pricingTier.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pricing tier:', error);
    return NextResponse.json({ error: 'Failed to delete pricing tier' }, { status: 500 });
  }
}
