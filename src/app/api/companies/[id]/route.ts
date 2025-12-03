import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { filterValidUrls } from '@/lib/validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single company by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

// PUT update company
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { images, ...companyData } = body;

    // Filter to only valid URLs
    const validImages = images?.length ? filterValidUrls(images) : [];

    // Delete existing images and create new ones
    await prisma.companyImage.deleteMany({
      where: { companyId: parseInt(id) },
    });

    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        ...companyData,
        images: validImages.length
          ? {
              create: validImages.map((url: string) => ({ imageUrl: url })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

// DELETE company
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.company.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
