import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function StateCompanyCheckoutPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            
            <h1 className={styles.title}>State Company Page Purchase</h1>
            <p className={styles.subtitle}>Secure Your Exclusive Statewide Placement</p>
            
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
            
            <div className={styles.comingSoon}>
              <p>Stripe Checkout Coming Soon</p>
              <span>Payment integration will be enabled shortly.</span>
            </div>
            
            <Link href="/state" className={styles.backLink}>
              ← Back to State Directory
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
