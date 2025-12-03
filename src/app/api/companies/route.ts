import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { filterValidUrls } from '@/lib/validation';

// GET all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

// POST create a new company
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, ...companyData } = body;

    // Filter to only valid URLs
    const validImages = images?.length ? filterValidUrls(images) : [];

    const company = await prisma.company.create({
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

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
