import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import { isValidUrl } from '@/lib/validation';

// GET all homepage slideshow images
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json([]);
  }

  try {
    const images = await prisma.homepageSlideshowImage.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching homepage slideshow images:', error);
    return NextResponse.json([]);
  }
}

// POST create a new homepage slideshow image
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

    const image = await prisma.homepageSlideshowImage.create({
      data: body,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating homepage slideshow image:', error);
    return NextResponse.json({ error: 'Failed to create slideshow image' }, { status: 500 });
  }
}
