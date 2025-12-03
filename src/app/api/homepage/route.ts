import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET homepage content (returns first record or creates default)
export async function GET() {
  try {
    let content = await prisma.homepageContent.findFirst();
    
    // If no content exists, create a default record
    if (!content) {
      content = await prisma.homepageContent.create({
        data: {
          heroTitle: 'Find Hydro-Vac Services Near You',
          heroSubtitle: 'Connect with trusted hydro excavation companies across the nation',
          slideshowEnabled: false,
        },
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json({ error: 'Failed to fetch homepage content' }, { status: 500 });
  }
}

// PUT update homepage content
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Get or create the homepage content
    const existing = await prisma.homepageContent.findFirst();
    
    let content;
    if (existing) {
      content = await prisma.homepageContent.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      content = await prisma.homepageContent.create({
        data: body,
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating homepage content:', error);
    return NextResponse.json({ error: 'Failed to update homepage content' }, { status: 500 });
  }
}
