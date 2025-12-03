import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isValidUrl } from '@/lib/validation';

// GET all homepage slideshow images
export async function GET() {
  try {
    const images = await prisma.homepageSlideshowImage.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching homepage slideshow images:', error);
    return NextResponse.json({ error: 'Failed to fetch slideshow images' }, { status: 500 });
  }
}

// POST create a new homepage slideshow image
export async function POST(request: Request) {
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
