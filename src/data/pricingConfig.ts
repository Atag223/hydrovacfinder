/**
 * Pricing Configuration for HydroVacFinder
 * 
 * This file contains all pricing tiers and coverage options.
 * Stripe price IDs should be added here once Stripe is integrated.
 */

export type CoverageLevel = '1-state' | '2-4-states' | '5-10-states' | '11-25-states' | 'nationwide';
export type ListingTier = 'verified' | 'featured' | 'premium';
export type BillingPeriod = 'monthly' | 'annual';

export interface CoverageOption {
  id: CoverageLevel;
  label: string;
  description: string;
}

export interface PricingTier {
  monthly: number;
  annual: number;
  // Stripe price IDs - to be added when Stripe is integrated
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
}

export interface HydrovacPackage {
  tier: ListingTier;
  name: string;
  pinColor: string;
  popular?: boolean;
  features: string[];
  pricing: Record<CoverageLevel, PricingTier>;
}

// Coverage options for the dropdown selector
export const coverageOptions: CoverageOption[] = [
  { id: '1-state', label: '1 State', description: 'Single state coverage' },
  { id: '2-4-states', label: '2 – 4 States', description: 'Multi-state regional coverage' },
  { id: '5-10-states', label: '5 – 10 States', description: 'Expanded regional coverage' },
  { id: '11-25-states', label: '11 – 25 States', description: 'Large regional coverage' },
  { id: 'nationwide', label: 'Nationwide', description: 'All 50 states coverage' },
];

// Hydro-Vac Company Packages with multi-state pricing
export const hydrovacPackages: HydrovacPackage[] = [
  {
    tier: 'verified',
    name: 'Verified',
    pinColor: '#3B82F6',
    features: [
      'Blue pin on map',
      'Company profile listing',
      'Phone number display',
      'Website link',
      'Service specialties',
      'Coverage radius display',
      'Click-to-call button',
    ],
    pricing: {
      '1-state': {
        monthly: 100,
        annual: 1000,
        // Stripe price IDs to be added
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '2-4-states': {
        monthly: 175,
        annual: 1750,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '5-10-states': {
        monthly: 250,
        annual: 2500,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '11-25-states': {
        monthly: 350,
        annual: 3500,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      'nationwide': {
        monthly: 400,
        annual: 4000,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
    },
  },
  {
    tier: 'featured',
    name: 'Featured',
    pinColor: '#22C55E',
    popular: true,
    features: [
      'Green pin on map',
      'Everything in Verified, plus:',
      'Higher listing placement',
      'Enhanced profile visibility',
      'Featured badge',
      'Priority in search results',
    ],
    pricing: {
      '1-state': {
        monthly: 125,
        annual: 1250,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '2-4-states': {
        monthly: 175,
        annual: 1750,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '5-10-states': {
        monthly: 275,
        annual: 2750,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '11-25-states': {
        monthly: 325,
        annual: 3250,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      'nationwide': {
        monthly: 350,
        annual: 3500,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
    },
  },
  {
    tier: 'premium',
    name: 'Premium',
    pinColor: '#EAB308',
    features: [
      'Gold pin on map',
      'Everything in Featured, plus:',
      'Top listing placement',
      'Premium badge',
      'Featured in state pages',
      'Maximum visibility',
      'Priority support',
    ],
    pricing: {
      '1-state': {
        monthly: 150,
        annual: 1500,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '2-4-states': {
        monthly: 175,
        annual: 1750,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '5-10-states': {
        monthly: 225,
        annual: 2250,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      '11-25-states': {
        monthly: 325,
        annual: 3250,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
      'nationwide': {
        monthly: 375,
        annual: 3750,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
      },
    },
  },
];

// State Page Ownership pricing
export const stateOwnership = {
  name: 'State Page Ownership',
  yearlyPrice: 2500,
  stripePriceIdAnnual: '', // To be added when Stripe is integrated
  features: [
    'Exclusive state page branding',
    'Your company featured at top',
    'Custom header image',
    'SEO benefits for your state',
    'Direct leads from state page',
    'Annual commitment',
  ],
};

// Disposal Facility Package pricing
export const disposalPackage = {
  name: 'Disposal Facility Verified',
  yearlyPrice: 1750,
  stripePriceIdAnnual: '', // To be added when Stripe is integrated
  features: [
    'Green pin on map',
    'Facility profile listing',
    'Materials accepted list',
    'Hours of operation',
    'Phone number display',
    'Navigate to location button',
    'Facility photos slideshow',
  ],
};

// Helper function to get pricing for a specific package and coverage
export function getPricing(tier: ListingTier, coverage: CoverageLevel): PricingTier {
  const pkg = hydrovacPackages.find((p) => p.tier === tier);
  if (!pkg) {
    throw new Error(`Package tier "${tier}" not found`);
  }
  return pkg.pricing[coverage];
}

// Helper function to get package by tier
export function getPackageByTier(tier: ListingTier): HydrovacPackage | undefined {
  return hydrovacPackages.find((p) => p.tier === tier);
}
