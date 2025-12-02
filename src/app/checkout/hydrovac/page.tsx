'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  getPackageByTier, 
  coverageOptions,
  type ListingTier,
  type CoverageLevel,
} from '@/data/pricingConfig';
import styles from './page.module.css';

function CheckoutContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const searchParams = useSearchParams();
  
  const tier = (searchParams.get('tier') || 'verified') as ListingTier;
  const coverage = (searchParams.get('coverage') || '1-state') as CoverageLevel;
  
  const pkg = getPackageByTier(tier);
  const coverageOption = coverageOptions.find(opt => opt.id === coverage);
  
  if (!pkg || !coverageOption) {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Invalid Package Selection</h1>
        <p className={styles.subtitle}>Please go back and select a valid package.</p>
        <Link href="/pricing" className={styles.backLink}>
          ← Back to Pricing
        </Link>
      </div>
    );
  }
  
  const pricing = pkg.pricing[coverage];
  const displayPrice = billingPeriod === 'monthly' ? pricing.monthly : pricing.annual;
  const periodLabel = billingPeriod === 'monthly' ? '/month' : '/year';

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType: `hydrovac-${tier}`,
          mode: billingPeriod === 'monthly' ? 'subscription' : 'payment',
          metadata: {
            purchaseType: 'hydrovac-listing',
            tier: tier,
            coverage: coverage,
            billingPeriod: billingPeriod,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper} style={{ background: `linear-gradient(135deg, ${pkg.pinColor}40 0%, ${pkg.pinColor} 100%)` }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      
      <h1 className={styles.title}>{pkg.name} Package</h1>
      <p className={styles.subtitle}>
        {coverageOption.label} Coverage
      </p>
      
      {/* Billing Period Toggle */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          background: '#f1f5f9', 
          borderRadius: '0.5rem', 
          padding: '0.25rem' 
        }}>
          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s',
              background: billingPeriod === 'monthly' ? 'white' : 'transparent',
              color: billingPeriod === 'monthly' ? '#1e3a5f' : '#64748b',
              boxShadow: billingPeriod === 'monthly' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod('annual')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s',
              background: billingPeriod === 'annual' ? 'white' : 'transparent',
              color: billingPeriod === 'annual' ? '#1e3a5f' : '#64748b',
              boxShadow: billingPeriod === 'annual' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Annual (Save 2 months)
          </button>
        </div>
      </div>
      
      <div className={styles.priceBox} style={{ background: `linear-gradient(135deg, ${pkg.pinColor}cc 0%, ${pkg.pinColor} 100%)` }}>
        <span className={styles.price}>${displayPrice.toLocaleString()}</span>
        <span className={styles.period}>{periodLabel}</span>
      </div>
      
      <div className={styles.features}>
        <h3>What&apos;s Included:</h3>
        <ul>
          {pkg.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}
      
      <button 
        className={styles.checkoutButton}
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </button>
      
      <div className={styles.securePayment}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Secure payment powered by Stripe</span>
      </div>
      
      <Link href="/pricing" className={styles.backLink}>
        ← Back to Pricing
      </Link>
    </div>
  );
}

export default function HydrovacCheckoutPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <Suspense fallback={<div className={styles.card}>Loading...</div>}>
            <CheckoutContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
