'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { US_STATES } from '@/types';

export default function StateDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = US_STATES.filter((state) =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>State Directory</h1>
          <p className={styles.subtitle}>
            Find Hydro-Vac companies and disposal facilities by state
          </p>
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
                  href={`/state/${state.toLowerCase().replace(/\s+/g, '-')}`}
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
