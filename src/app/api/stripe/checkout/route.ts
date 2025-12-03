import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { 
  hydrovacPackages, 
  type ListingTier, 
  type CoverageLevel 
} from '@/data/pricingConfig';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set. Stripe checkout will not work.');
}

// Initialize Stripe with the secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    })
  : null;

// Product configuration for one-time payments
// These are used when no Stripe Price ID is configured
interface ProductConfig {
  name: string;
  description: string;
  priceInCents: number;
}

type StaticProductType = 'state-company' | 'state-disposal';
type HydrovacProductType = `hydrovac-${ListingTier}`;
type ProductType = StaticProductType | HydrovacProductType;

const staticProductConfigs: Record<StaticProductType, ProductConfig> = {
  'state-company': {
    name: 'State Page Company Ownership',
    description: 'Exclusive state page branding and featured placement for 12 months',
    priceInCents: 250000, // $2,500
  },
  'state-disposal': {
    name: 'Disposal Facility Featured Listing',
    description: 'Featured spotlight on state disposal page for 12 months',
    priceInCents: 175000, // $1,750
  },
};

// Get hydrovac package config dynamically
function getHydrovacProductConfig(
  tier: ListingTier, 
  coverage: CoverageLevel, 
  billingPeriod: 'monthly' | 'annual'
): ProductConfig | null {
  const pkg = hydrovacPackages.find(p => p.tier === tier);
  if (!pkg) return null;
  
  const pricing = pkg.pricing[coverage];
  if (!pricing) return null;
  
  const priceInCents = billingPeriod === 'monthly' 
    ? pricing.monthly * 100 
    : pricing.annual * 100;
  
  const periodLabel = billingPeriod === 'monthly' ? 'Monthly' : 'Annual';
  
  return {
    name: `${pkg.name} Package - ${periodLabel}`,
    description: `${pkg.name} listing with ${coverage.replace(/-/g, ' ')} coverage`,
    priceInCents,
  };
}

interface CheckoutRequest {
  // Product type for pre-configured products
  productType?: ProductType;
  // Or custom price ID from Stripe
  priceId?: string;
  // Subscription or one-time payment
  mode?: 'subscription' | 'payment';
  // Customer email for pre-filling checkout
  customerEmail?: string;
  // State for state-specific purchases
  state?: string;
  // Custom success URL
  successUrl?: string;
  // Custom cancel URL
  cancelUrl?: string;
  // Metadata to include with the purchase
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { 
          error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.',
          code: 'STRIPE_NOT_CONFIGURED'
        },
        { status: 503 }
      );
    }

    const body: CheckoutRequest = await request.json();
    const { 
      productType, 
      priceId, 
      mode = 'payment',
      customerEmail,
      state,
      successUrl,
      cancelUrl,
      metadata = {}
    } = body;

    // Validate request
    if (!productType && !priceId) {
      return NextResponse.json(
        { error: 'Either productType or priceId is required' },
        { status: 400 }
      );
    }

    // Get the origin for constructing URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Build line items
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    let paymentMode: 'subscription' | 'payment' = mode;

    if (priceId) {
      // Use existing Stripe Price ID
      lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];
    } else if (productType) {
      // Check if it's a static product or hydrovac product
      let config: ProductConfig | null = null;
      let isMonthlySubscription = false;
      
      if (productType === 'state-company' || productType === 'state-disposal') {
        // Static product
        config = staticProductConfigs[productType];
        paymentMode = 'payment'; // One-time payments for these products
      } else if (productType.startsWith('hydrovac-')) {
        // Hydrovac package - extract tier from productType
        const tier = productType.replace('hydrovac-', '') as ListingTier;
        const coverage = (metadata.coverage || '1-state') as CoverageLevel;
        const billingPeriod = (metadata.billingPeriod || 'annual') as 'monthly' | 'annual';
        
        config = getHydrovacProductConfig(tier, coverage, billingPeriod);
        isMonthlySubscription = billingPeriod === 'monthly';
        
        if (isMonthlySubscription) {
          paymentMode = 'subscription';
        }
      }
      
      if (!config) {
        return NextResponse.json(
          { error: 'Invalid productType' },
          { status: 400 }
        );
      }
      
      // Build line items based on payment type
      if (isMonthlySubscription) {
        lineItems = [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: config.name,
                description: config.description,
              },
              unit_amount: config.priceInCents,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ];
      } else {
        lineItems = [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: config.name,
                description: config.description,
              },
              unit_amount: config.priceInCents,
            },
            quantity: 1,
          },
        ];
      }
    } else {
      return NextResponse.json(
        { error: 'Either productType or priceId is required' },
        { status: 400 }
      );
    }

    // Build metadata
    const sessionMetadata: Record<string, string> = {
      ...metadata,
    };
    if (productType) {
      sessionMetadata.productType = productType;
    }
    if (state) {
      sessionMetadata.state = state;
    }

    // Extract tier from productType if it's a hydrovac product
    let tier = metadata.tier;
    if (!tier && productType?.startsWith('hydrovac-')) {
      // Capitalize first letter of tier (e.g., "verified" -> "Verified")
      const rawTier = productType.replace('hydrovac-', '');
      tier = rawTier.charAt(0).toUpperCase() + rawTier.slice(1);
    }
    if (tier) {
      sessionMetadata.tier = tier;
    }

    // Determine success URL - hydrovac products go to onboarding
    let finalSuccessUrl = successUrl;
    if (!finalSuccessUrl) {
      if (productType?.startsWith('hydrovac-')) {
        finalSuccessUrl = `${origin}/onboarding?session_id={CHECKOUT_SESSION_ID}`;
      } else {
        finalSuccessUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: paymentMode,
      success_url: finalSuccessUrl,
      cancel_url: cancelUrl || `${origin}/pricing?canceled=true`,
      customer_email: customerEmail,
      metadata: sessionMetadata,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
