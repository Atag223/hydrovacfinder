'use client';

import { useState, Suspense, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Listings from '@/components/Listings';
import StateCompanyAd from '@/components/StateCompanyAd';
import StateDisposalSlideshowAd from '@/components/StateDisposalSlideshowAd';
import { FilterType, US_STATES, HydroVacCompany, DisposalFacility } from '@/types';
import styles from './page.module.css';

// Database company type from API
interface DBCompany {
  id: number;
  name: string;
  city: string;
  state: string;
  phone: string | null;
  website: string | null;
  tier: string;
  coverageRadius: number | null;
  latitude: number | null;
  longitude: number | null;
  unionAffiliated: boolean;
  specialties: string | null;
}

// Database disposal facility type from API
interface DBDisposalFacility {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  materialsAccepted: string | null;
}

// Transform database company to frontend type
function transformCompany(dbCompany: DBCompany): HydroVacCompany | null {
  // Skip companies without valid coordinates
  if (dbCompany.latitude === null || dbCompany.longitude === null) {
    return null;
  }

  return {
    id: String(dbCompany.id),
    name: dbCompany.name,
    city: dbCompany.city,
    state: dbCompany.state,
    phone: dbCompany.phone || '',
    website: dbCompany.website || '',
    serviceSpecialties: dbCompany.specialties ? dbCompany.specialties.split(',').map(s => s.trim()) : ['Hydro Excavation'],
    coverageRadius: dbCompany.coverageRadius || 100,
    unionAffiliation: dbCompany.unionAffiliated,
    tier: dbCompany.tier.toLowerCase() as HydroVacCompany['tier'],
    latitude: dbCompany.latitude,
    longitude: dbCompany.longitude,
    profileViews: 0,
    clickToCalls: 0,
    websiteClicks: 0,
    directionRequests: 0,
  };
}

// Transform database facility to frontend type
function transformFacility(dbFacility: DBDisposalFacility): DisposalFacility | null {
  // Skip facilities without valid coordinates
  if (dbFacility.latitude === null || dbFacility.longitude === null) {
    return null;
  }

  return {
    id: String(dbFacility.id),
    name: dbFacility.name,
    address: dbFacility.address || '',
    city: dbFacility.city || '',
    state: dbFacility.state || '',
    materialsAccepted: dbFacility.materialsAccepted ? dbFacility.materialsAccepted.split(',').map(s => s.trim()) : [],
    hours: dbFacility.hours || '',
    phone: dbFacility.phone || '',
    tier: 'verified',
    latitude: dbFacility.latitude,
    longitude: dbFacility.longitude,
    clicks: 0,
  };
}

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
  const [stateCompanies, setStateCompanies] = useState<HydroVacCompany[]>([]);
  const [stateFacilities, setStateFacilities] = useState<DisposalFacility[]>([]);
  const [loading, setLoading] = useState(true);

  // Validate state
  const isValidState = US_STATES.some(
    state => state.toLowerCase() === stateName.toLowerCase()
  );

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      if (!isValidState) {
        setLoading(false);
        return;
      }

      try {
        const [companiesRes, facilitiesRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/disposals'),
        ]);

        if (companiesRes.ok) {
          const dbCompanies: DBCompany[] = await companiesRes.json();
          const transformedCompanies = dbCompanies
            .map(transformCompany)
            .filter((c): c is HydroVacCompany => c !== null)
            .filter(c => c.state.toLowerCase() === stateName.toLowerCase());
          setStateCompanies(transformedCompanies);
        }

        if (facilitiesRes.ok) {
          const dbFacilities: DBDisposalFacility[] = await facilitiesRes.json();
          const transformedFacilities = dbFacilities
            .map(transformFacility)
            .filter((f): f is DisposalFacility => f !== null)
            .filter(f => f.state.toLowerCase() === stateName.toLowerCase());
          setStateFacilities(transformedFacilities);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [stateName, isValidState]);

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

  if (loading) {
    return (
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
