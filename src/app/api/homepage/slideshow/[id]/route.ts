import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE homepage slideshow image
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.homepageSlideshowImage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting homepage slideshow image:', error);
    return NextResponse.json({ error: 'Failed to delete slideshow image' }, { status: 500 });
  }
}
