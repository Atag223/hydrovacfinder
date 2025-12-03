import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { filterValidUrls } from '@/lib/validation';

// GET all state landing pages
export async function GET() {
  try {
    const pages = await prisma.stateLandingPage.findMany({
      include: { images: true },
      orderBy: { state: 'asc' },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching state landing pages:', error);
    return NextResponse.json({ error: 'Failed to fetch state landing pages' }, { status: 500 });
  }
}

// POST create a new state landing page
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, ...pageData } = body;

    // Filter to only valid URLs
    const validImages = images?.length ? filterValidUrls(images) : [];

    const page = await prisma.stateLandingPage.create({
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

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating state landing page:', error);
    return NextResponse.json({ error: 'Failed to create state landing page' }, { status: 500 });
  }
}
