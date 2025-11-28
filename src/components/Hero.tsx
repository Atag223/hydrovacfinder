import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          America&apos;s #1 Hydro-Vac & Disposal Facility Directory
        </h1>
        <p className={styles.subtitle}>
          Find Hydro-Vac companies and disposal sites anywhere in the U.S. — fast.
        </p>
        <div className={styles.cta}>
          <a href="#map-section" className={styles.primaryBtn}>
            Find Companies Near You
          </a>
          <a href="/pricing" className={styles.secondaryBtn}>
            List Your Company
          </a>
        </div>
      </div>
      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
