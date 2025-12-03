import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    })
  : null;

interface OnboardingRequest {
  sessionId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website?: string;
  email: string;
  latitude?: number | null;
  longitude?: number | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: OnboardingRequest = await request.json();
    const { 
      sessionId, 
      name, 
      address, 
      city, 
      state, 
      phone, 
      website, 
      email,
      latitude,
      longitude,
    } = body;

    // Validate required fields
    if (!sessionId || !name || !address || !city || !state || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the Stripe session
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 503 }
      );
    }

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      );
    }

    // Get tier from session metadata
    const tier = session.metadata?.tier || 'Basic';

    // Create the company record in the database
    const company = await prisma.company.create({
      data: {
        name,
        address,
        city,
        state,
        phone,
        website: website || null,
        email,
        tier,
        latitude: latitude || null,
        longitude: longitude || null,
        unionAffiliated: false,
      },
    });

    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        tier: company.tier,
      },
    });
  } catch (error) {
    console.error('Error processing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to process onboarding. Please try again.' },
      { status: 500 }
    );
  }
}
