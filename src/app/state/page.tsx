'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { US_STATES } from '@/types';

function StateDirectoryContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'hydrovac' | 'disposal' | 'all'>(
    type === 'hydrovac' ? 'hydrovac' : type === 'disposal' ? 'disposal' : 'all'
  );

  const filteredStates = US_STATES.filter((state) =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTitle = () => {
    if (activeTab === 'hydrovac') return 'Hydro-Vac Companies by State';
    if (activeTab === 'disposal') return 'Disposal Facilities by State';
    return 'State Directory';
  };

  const getSubtitle = () => {
    if (activeTab === 'hydrovac') return 'Find Hydro-Vac companies in your state';
    if (activeTab === 'disposal') return 'Find disposal facilities in your state';
    return 'Find Hydro-Vac companies and disposal facilities by state';
  };

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>{getTitle()}</h1>
          <p className={styles.subtitle}>{getSubtitle()}</p>
          
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'hydrovac' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('hydrovac')}
            >
              Hydro-Vac Companies
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'disposal' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('disposal')}
            >
              Disposal Facilities
            </button>
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </section>

        <section className={styles.statesSection}>
          <div className={styles.container}>
            <div className={styles.statesGrid}>
              {filteredStates.map((state) => (
                <Link
                  key={state}
                  href={`/state/${state.toLowerCase().replace(/\s+/g, '-')}${activeTab !== 'all' ? `?type=${activeTab}` : ''}`}
                  className={styles.stateCard}
                >
                  <span className={styles.stateName}>{state}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function StateDirectoryPage() {
  return (
    <Suspense fallback={
      <>
        <Navigation />
        <main className={styles.main}>
          <section className={styles.hero}>
            <h1 className={styles.title}>State Directory</h1>
            <p className={styles.subtitle}>Loading...</p>
          </section>
        </main>
        <Footer />
      </>
    }>
      <StateDirectoryContent />
    </Suspense>
  );
}
