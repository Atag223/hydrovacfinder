import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single disposal facility by ID
export async function GET(request: Request, { params }: RouteParams) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot fetch single facility without database connection.' 
    }, { status: 503 });
  }

  try {
    const { id } = await params;
    const facility = await prisma.disposalFacility.findUnique({
      where: { id: parseInt(id) },
    });

    if (!facility) {
      return NextResponse.json({ error: 'Disposal facility not found' }, { status: 404 });
    }

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error fetching disposal facility:', error);
    return NextResponse.json({ error: 'Failed to fetch disposal facility' }, { status: 500 });
  }
}

// PUT update disposal facility
export async function PUT(request: Request, { params }: RouteParams) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot update disposal facilities without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const facility = await prisma.disposalFacility.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error updating disposal facility:', error);
    return NextResponse.json({ error: 'Failed to update disposal facility' }, { status: 500 });
  }
}

// DELETE disposal facility
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot delete disposal facilities without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

  try {
    const { id } = await params;
    await prisma.disposalFacility.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting disposal facility:', error);
    return NextResponse.json({ error: 'Failed to delete disposal facility' }, { status: 500 });
  }
}
