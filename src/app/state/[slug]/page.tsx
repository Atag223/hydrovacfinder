'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Listings from '@/components/Listings';
import { mockHydroVacCompanies, mockDisposalFacilities } from '@/data/mockData';
import { FilterType, US_STATES } from '@/types';
import styles from './page.module.css';

function formatStateName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function StatePage() {
  const params = useParams();
  const slug = params.slug as string;
  const stateName = formatStateName(slug);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter companies and facilities by state
  const stateCompanies = mockHydroVacCompanies.filter(
    company => company.state.toLowerCase() === stateName.toLowerCase()
  );
  const stateFacilities = mockDisposalFacilities.filter(
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

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Hydro-Vac Companies & Disposal Facilities in {stateName}
            </h1>
            <p className={styles.subtitle}>
              Find the best hydro-vac services and disposal sites in {stateName}
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

        <section className={styles.mapSection}>
          <div className={styles.container}>
            <div className={styles.mapPlaceholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p>{stateName} Map</p>
              <span>Showing companies and facilities in {stateName}</span>
            </div>
          </div>
        </section>

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
