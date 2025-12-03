import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all disposal facilities
export async function GET() {
  try {
    const facilities = await prisma.disposalFacility.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(facilities);
  } catch (error) {
    console.error('Error fetching disposal facilities:', error);
    return NextResponse.json({ error: 'Failed to fetch disposal facilities' }, { status: 500 });
  }
}

// POST create a new disposal facility
export async function POST(request: Request) {
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
