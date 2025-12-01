'use client';

import { useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Listings from '@/components/Listings';
import StateCompanyAd from '@/components/StateCompanyAd';
import StateDisposalSlideshowAd from '@/components/StateDisposalSlideshowAd';
import { hydroVacCompanies, disposalFacilities } from '@/data/companyData';
import { FilterType, US_STATES } from '@/types';
import styles from './page.module.css';

function formatStateName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function StatePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const stateName = formatStateName(slug);
  const pageType = searchParams.get('type') as 'hydrovac' | 'disposal' | null;
  const [activeFilter, setActiveFilter] = useState<FilterType>(pageType || 'all');

  // Filter companies and facilities by state
  const stateCompanies = hydroVacCompanies.filter(
    company => company.state.toLowerCase() === stateName.toLowerCase()
  );
  const stateFacilities = disposalFacilities.filter(
    facility => facility.state.toLowerCase() === stateName.toLowerCase()
  );

  // Validate state
  const isValidState = US_STATES.some(
    state => state.toLowerCase() === stateName.toLowerCase()
  );

  if (!isValidState) {
    return (
      <>
        <Navigation />
        <main className={styles.main}>
          <div className={styles.notFound}>
            <h1>State Not Found</h1>
            <p>The state &quot;{stateName}&quot; was not found in our directory.</p>
            <Link href="/state" className={styles.backLink}>
              ← Back to State Directory
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Dynamic title and subtitle based on page type
  const getTitle = () => {
    if (pageType === 'hydrovac') return `Hydro-Vac Companies in ${stateName}`;
    if (pageType === 'disposal') return `Disposal Facilities in ${stateName}`;
    return `Hydro-Vac Companies & Disposal Facilities in ${stateName}`;
  };

  const getSubtitle = () => {
    if (pageType === 'hydrovac') return `Find the best hydro-vac services in ${stateName}`;
    if (pageType === 'disposal') return `Find disposal sites in ${stateName}`;
    return `Find the best hydro-vac services and disposal sites in ${stateName}`;
  };

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              {getTitle()}
            </h1>
            <p className={styles.subtitle}>
              {getSubtitle()}
            </p>
          </div>
        </section>

        <section className={styles.seoContent}>
          <div className={styles.container}>
            <h2>About Hydro-Vac Services in {stateName}</h2>
            <p>
              {stateName} offers a variety of hydro-vac services for commercial, industrial, 
              and utility projects. Our verified directory includes companies offering vacuum 
              excavation, slot trenching, daylighting, and other specialized services. Whether 
              you need pipeline excavation, utility locating, or emergency services, you&apos;ll 
              find qualified providers in our {stateName} directory.
            </p>
          </div>
        </section>

        {/* Advertisement Section - Replaces map based on page type */}
        {pageType === 'hydrovac' && (
          <StateCompanyAd stateName={stateName} />
        )}
        
        {pageType === 'disposal' && (
          <StateDisposalSlideshowAd stateName={stateName} />
        )}
        
        {!pageType && (
          <>
            <StateCompanyAd stateName={stateName} />
            <StateDisposalSlideshowAd stateName={stateName} />
          </>
        )}

        <section className={styles.filterSection}>
          <div className={styles.container}>
            <div className={styles.filterTabs}>
              <button
                className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All ({stateCompanies.length + stateFacilities.length})
              </button>
              <button
                className={`${styles.filterTab} ${activeFilter === 'hydrovac' ? styles.active : ''}`}
                onClick={() => setActiveFilter('hydrovac')}
              >
                Hydro-Vac Companies ({stateCompanies.length})
              </button>
              <button
                className={`${styles.filterTab} ${activeFilter === 'disposal' ? styles.active : ''}`}
                onClick={() => setActiveFilter('disposal')}
              >
                Disposal Facilities ({stateFacilities.length})
              </button>
            </div>
          </div>
        </section>

        <Listings
          companies={stateCompanies}
          facilities={stateFacilities}
          activeFilter={activeFilter}
        />

        {stateCompanies.length === 0 && stateFacilities.length === 0 && (
          <section className={styles.noResults}>
            <div className={styles.container}>
              <h3>No Companies Found</h3>
              <p>
                We don&apos;t have any listed companies or facilities in {stateName} yet. 
                If you operate in this state, consider listing your company!
              </p>
              <a href="/pricing" className={styles.ctaBtn}>
                List Your Company
              </a>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function StatePage() {
  return (
    <Suspense fallback={
      <>
        <Navigation />
        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.title}>Loading...</h1>
              <p className={styles.subtitle}>Please wait</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    }>
      <StatePageContent />
    </Suspense>
  );
}
