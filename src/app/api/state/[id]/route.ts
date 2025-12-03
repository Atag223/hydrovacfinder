import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { filterValidUrls } from '@/lib/validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single state landing page by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const page = await prisma.stateLandingPage.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    });

    if (!page) {
      return NextResponse.json({ error: 'State landing page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching state landing page:', error);
    return NextResponse.json({ error: 'Failed to fetch state landing page' }, { status: 500 });
  }
}

// PUT update state landing page
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { images, ...pageData } = body;

    // Filter to only valid URLs
    const validImages = images?.length ? filterValidUrls(images) : [];

    // Delete existing images and create new ones
    await prisma.stateLandingImage.deleteMany({
      where: { pageId: parseInt(id) },
    });

    const page = await prisma.stateLandingPage.update({
      where: { id: parseInt(id) },
      data: {
        ...pageData,
        images: validImages.length
          ? {
              create: validImages.map((url: string) => ({ imageUrl: url })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating state landing page:', error);
    return NextResponse.json({ error: 'Failed to update state landing page' }, { status: 500 });
  }
}

// DELETE state landing page
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.stateLandingPage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting state landing page:', error);
    return NextResponse.json({ error: 'Failed to delete state landing page' }, { status: 500 });
  }
}
