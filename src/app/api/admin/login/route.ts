import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

// Constant-time string comparison to prevent timing attacks
function secureCompare(a: string, b: string): boolean {
  try {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    
    // If lengths differ, we still do a comparison to maintain constant time
    // but we know the result will be false
    if (bufferA.length !== bufferB.length) {
      // Compare against itself to maintain constant time
      timingSafeEqual(bufferA, bufferA);
      return false;
    }
    
    return timingSafeEqual(bufferA, bufferB);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { error: 'Admin authentication not configured' },
        { status: 500 }
      );
    }

    // Ensure password is a string before comparison
    if (typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid password format' },
        { status: 400 }
      );
    }
    
    if (secureCompare(password, adminPassword)) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
