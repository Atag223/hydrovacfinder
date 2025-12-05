import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import { filterValidUrls } from '@/lib/validation';

// GET all state landing pages
export async function GET() {
  if (!isDatabaseConfigured()) {
    // Return empty array - no fallback data for state landing pages
    return NextResponse.json([]);
  }

  try {
    const pages = await prisma.stateLandingPage.findMany({
      include: { images: true },
      orderBy: { state: 'asc' },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching state landing pages:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST create a new state landing page
export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot create state landing pages without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

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
