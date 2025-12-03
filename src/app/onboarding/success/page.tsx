import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function OnboardingSuccessPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            
            <h1 className={styles.title}>Welcome to HydroVacFinder!</h1>
            <p className={styles.subtitle}>Your company profile has been created successfully.</p>
            
            <div className={styles.details}>
              <h3>What&apos;s Next?</h3>
              <p>
                Your listing is now active and visible to customers searching for hydro-vac services 
                in your area. You can start receiving leads immediately!
              </p>
            </div>
            
            <div className={styles.nextSteps}>
              <h3>Coming Soon</h3>
              <ul>
                <li>Upload company photos and logo</li>
                <li>Add service specialties</li>
                <li>Set your coverage area</li>
                <li>View profile analytics</li>
              </ul>
            </div>
            
            <Link href="/" className={styles.backLink}>
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
