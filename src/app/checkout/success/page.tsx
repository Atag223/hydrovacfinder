import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function CheckoutSuccessPage() {
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
            
            <h1 className={styles.title}>Payment Successful!</h1>
            <p className={styles.subtitle}>Thank you for your purchase. Your listing is being activated.</p>
            
            <div className={styles.details}>
              <h3>What happens next?</h3>
              <p>We&apos;ve received your payment and our team will begin setting up your listing immediately.</p>
            </div>
            
            <div className={styles.nextSteps}>
              <h3>Next Steps</h3>
              <ul>
                <li>You&apos;ll receive a confirmation email shortly</li>
                <li>Our team will contact you within 24 hours</li>
                <li>We&apos;ll collect your company information and images</li>
                <li>Your listing will go live within 48 hours</li>
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
