import { NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Validation error response type
interface ValidationErrors {
  [field: string]: string;
}

// GET single company by ID
export async function GET(request: Request, { params }: RouteParams) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot fetch single company without database connection.' 
    }, { status: 503 });
  }

  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

// PUT update company
export async function PUT(request: Request, { params }: RouteParams) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot update companies without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const errors: ValidationErrors = {};

    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!body.city || typeof body.city !== 'string' || body.city.trim() === '') {
      errors.city = 'City is required';
    }

    if (!body.state || typeof body.state !== 'string' || body.state.trim() === '') {
      errors.state = 'State is required';
    }

    // Validate optional fields if provided
    if (body.phone !== undefined && body.phone !== null && typeof body.phone !== 'string') {
      errors.phone = 'Phone must be a string';
    }

    if (body.website !== undefined && body.website !== null && typeof body.website !== 'string') {
      errors.website = 'Website must be a string';
    }

    if (body.tier !== undefined && body.tier !== null && typeof body.tier !== 'string') {
      errors.tier = 'Tier must be a string';
    }

    if (body.coverageRadius !== undefined && body.coverageRadius !== null) {
      if (typeof body.coverageRadius !== 'number' || !Number.isInteger(body.coverageRadius) || body.coverageRadius < 0) {
        errors.coverageRadius = 'Coverage radius must be a non-negative integer';
      }
    }

    if (body.latitude !== undefined && body.latitude !== null && typeof body.latitude !== 'number') {
      errors.latitude = 'Latitude must be a number';
    }

    if (body.longitude !== undefined && body.longitude !== null && typeof body.longitude !== 'number') {
      errors.longitude = 'Longitude must be a number';
    }

    if (body.unionAffiliated !== undefined && body.unionAffiliated !== null && typeof body.unionAffiliated !== 'boolean') {
      errors.unionAffiliated = 'Union affiliated must be a boolean';
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // Convert specialties from comma-separated string to stored format
    let specialties: string | null = null;
    if (body.specialties) {
      if (typeof body.specialties === 'string') {
        // If it's already a string, store as-is (trim whitespace)
        specialties = body.specialties.trim() || null;
      } else if (Array.isArray(body.specialties)) {
        // If it's an array, convert to comma-separated string (filter out non-strings)
        const specialtiesArray = body.specialties as unknown[];
        specialties = specialtiesArray
          .filter((s: unknown): s is string => typeof s === 'string')
          .map((s: string) => s.trim())
          .filter(Boolean)
          .join(', ') || null;
      }
    }

    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name.trim(),
        city: body.city.trim(),
        state: body.state.trim(),
        phone: body.phone?.trim() || null,
        website: body.website?.trim() || null,
        tier: body.tier?.trim() || 'Basic',
        coverageRadius: body.coverageRadius ?? null,
        latitude: body.latitude ?? null,
        longitude: body.longitude ?? null,
        unionAffiliated: body.unionAffiliated ?? false,
        specialties,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

// DELETE company
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ 
      error: 'Database not configured', 
      message: 'Cannot delete companies without a database connection. Please configure DATABASE_URL and DIRECT_URL environment variables.' 
    }, { status: 503 });
  }

  try {
    const { id } = await params;
    await prisma.company.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
