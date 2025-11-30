'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navigation.module.css';

interface NavigationProps {
  isAdmin?: boolean;
}

export default function Navigation({ isAdmin = false }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="HydroVacFinder" width={80} height={80} className={styles.logoImage} />
          <span className={styles.logoText}>HydroVacFinder</span>
        </Link>

        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburger}></span>
        </button>

        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.open : ''}`}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <div 
            className={styles.dropdown}
            onMouseEnter={() => setStateDropdownOpen(true)}
            onMouseLeave={() => setStateDropdownOpen(false)}
          >
            <button className={styles.dropdownBtn}>
              State Directory
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {stateDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/state?type=hydrovac" className={styles.dropdownItem}>
                  Hydro-Vac Companies
                </Link>
                <Link href="/state?type=disposal" className={styles.dropdownItem}>
                  Disposal Facilities
                </Link>
              </div>
            )}
          </div>
          <Link href="/pricing" className={styles.navLink}>
            List Your Company
          </Link>
          {isAdmin && (
            <Link href="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
