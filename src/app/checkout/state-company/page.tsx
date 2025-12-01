'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';

function CheckoutContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const state = searchParams.get('state') || '';

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
          productType: 'state-company',
          state: state,
          metadata: {
            purchaseType: 'state-company-ownership',
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
      <div className={styles.iconWrapper}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      </div>
      
      <h1 className={styles.title}>State Company Page Purchase</h1>
      <p className={styles.subtitle}>
        Secure Your Exclusive Statewide Placement
        {state && ` in ${state}`}
      </p>
      
      <div className={styles.priceBox}>
        <span className={styles.price}>$2,500</span>
        <span className={styles.period}>/year</span>
      </div>
      
      <div className={styles.features}>
        <h3>What&apos;s Included:</h3>
        <ul>
          <li>Featured placement on state directory page</li>
          <li>Custom image advertisement</li>
          <li>Custom promotional text</li>
          <li>Exclusive statewide visibility</li>
          <li>12 months of advertising</li>
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
      
      <Link href="/state" className={styles.backLink}>
        ← Back to State Directory
      </Link>
    </div>
  );
}

export default function StateCompanyCheckoutPage() {
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
