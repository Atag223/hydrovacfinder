import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import { isValidUrl } from '@/lib/validation';

// GET all disposal slideshow images (optionally filter by state)
export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json([]);
  }

  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');

    const images = await prisma.disposalSlideshow.findMany({
      where: state ? { state } : undefined,
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching disposal slideshow images:', error);
    return NextResponse.json([]);
  }
}

// POST create a new disposal slideshow image
export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot create slideshow images without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

  try {
    const body = await request.json();

    // Validate URL
    if (!body.imageUrl || !isValidUrl(body.imageUrl)) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    const image = await prisma.disposalSlideshow.create({
      data: body,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating disposal slideshow image:', error);
    return NextResponse.json({ error: 'Failed to create slideshow image' }, { status: 500 });
  }
}
