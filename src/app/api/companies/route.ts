import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

// Validation error response type
interface ValidationErrors {
  [field: string]: string;
}

// POST create a new company
export async function POST(request: Request) {
  try {
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
      if (typeof body.coverageRadius !== 'number' || !Number.isInteger(body.coverageRadius)) {
        errors.coverageRadius = 'Coverage radius must be an integer';
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
        // If it's an array, convert to comma-separated string
        specialties = body.specialties.map((s: string) => s.trim()).filter(Boolean).join(', ') || null;
      }
    }

    const company = await prisma.company.create({
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

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
