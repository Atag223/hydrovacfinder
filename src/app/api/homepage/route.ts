import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';

// GET homepage content (returns first record or creates default)
export async function GET() {
  if (!isDatabaseConfigured()) {
    // Return default homepage content when database is not configured
    return NextResponse.json({
      id: 0,
      heroTitle: 'Find Hydro-Vac Services Near You',
      heroSubtitle: 'Connect with trusted hydro excavation companies across the nation',
      mainImage: null,
      slideshowEnabled: false,
    });
  }

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
    // Return default content on error
    return NextResponse.json({
      id: 0,
      heroTitle: 'Find Hydro-Vac Services Near You',
      heroSubtitle: 'Connect with trusted hydro excavation companies across the nation',
      mainImage: null,
      slideshowEnabled: false,
    });
  }
}

// PUT update homepage content
export async function PUT(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot update homepage content without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

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
