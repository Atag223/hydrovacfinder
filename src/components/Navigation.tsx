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

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="HydroVacFinder" width={40} height={40} className={styles.logoImage} />
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
          <Link href="/pricing" className={styles.navLink}>
            List Your Company
          </Link>
          {isAdmin && (
            <Link href="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
          <Link href="/pricing" className={styles.ctaBtn}>
            Get Listed
          </Link>
        </div>
      </div>
    </nav>
  );
}
