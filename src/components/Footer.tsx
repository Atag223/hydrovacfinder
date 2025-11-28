import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>🚚</span>
              <span className={styles.logoText}>HydroVacFinder.com</span>
            </Link>
            <p className={styles.tagline}>
              America&apos;s #1 Hydro-Vac & Disposal Facility Directory
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Company</h4>
              <Link href="/pricing" className={styles.link}>List Your Company</Link>
              <Link href="/pricing" className={styles.link}>Pricing</Link>
              <Link href="/pricing#referral" className={styles.link}>Referral Program</Link>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Resources</h4>
              <Link href="/#map-section" className={styles.link}>Find Companies</Link>
              <Link href="/state" className={styles.link}>State Directory</Link>
              <Link href="/#map-section" className={styles.link}>Disposal Facilities</Link>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Contact</h4>
              <a href="mailto:info@hydrovacfinder.com" className={styles.link}>
                info@hydrovacfinder.com
              </a>
              <a href="tel:+18005551234" className={styles.link}>
                1-800-555-1234
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} HydroVacFinder.com. All rights reserved.
          </p>
          <div className={styles.legal}>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
