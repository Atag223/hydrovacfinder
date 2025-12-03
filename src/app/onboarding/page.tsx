'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { US_STATES } from '@/types';
import styles from './page.module.css';

interface OnboardingFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  email: string;
  latitude: string;
  longitude: string;
}

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<string>('');
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    website: '',
    email: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided. Please complete the checkout process first.');
      setIsValidating(false);
      return;
    }

    // Validate the session and get tier info
    const validateSession = async () => {
      try {
        const response = await fetch(`/api/onboarding/validate?session_id=${sessionId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Invalid session');
        }
        
        setTier(data.tier || 'Basic');
        if (data.email) {
          setFormData(prev => ({ ...prev, email: data.email }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to validate session');
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [sessionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      // Redirect to success page
      router.push('/onboarding/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingState}>
          <p>Validating your payment...</p>
        </div>
      </div>
    );
  }

  if (error && !sessionId) {
    return (
      <div className={styles.card}>
        <div className={styles.iconWrapper} style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fca5a5 100%)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className={styles.title}>Session Error</h1>
        <p className={styles.subtitle}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      
      <h1 className={styles.title}>Complete Your Profile</h1>
      {tier && <span className={styles.tierBadge}>{tier} Tier</span>}
      <p className={styles.subtitle}>
        Payment successful! Please fill in your company details to complete your listing.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">
            Company Name<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Company Name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="address">
            Street Address<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className={styles.input}
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="city">
              City<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className={styles.input}
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="state">
              State<span className={styles.required}>*</span>
            </label>
            <select
              id="state"
              name="state"
              className={styles.select}
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">Select State</option>
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="phone">
              Phone<span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={styles.input}
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email<span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@company.com"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="website">
            Website <span className={styles.optional}>(optional)</span>
          </label>
          <input
            type="url"
            id="website"
            name="website"
            className={styles.input}
            value={formData.website}
            onChange={handleChange}
            placeholder="https://www.yourcompany.com"
          />
        </div>

        <hr className={styles.divider} />

        <div>
          <h3 className={styles.sectionTitle}>Location Coordinates <span className={styles.optional}>(optional)</span></h3>
          <p className={styles.sectionDesc}>
            Provide coordinates for accurate map placement. Leave blank and we&apos;ll geocode from your address.
          </p>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="latitude">Latitude</label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              className={styles.input}
              value={formData.latitude}
              onChange={handleChange}
              placeholder="e.g., 29.7604"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="longitude">Longitude</label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              className={styles.input}
              value={formData.longitude}
              onChange={handleChange}
              placeholder="e.g., -95.3698"
            />
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <Suspense fallback={<div className={styles.card}><div className={styles.loadingState}><p>Loading...</p></div></div>}>
            <OnboardingForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
