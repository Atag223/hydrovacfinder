import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>HydroVacFinder.com</h1>
          <p className={styles.tagline}>America&apos;s #1 Hydro-Vac &amp; Disposal Facility Directory</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Find Hydro-Vac Services or Disposal Sites Near You</h2>
          <p className={styles.heroSubtitle}>
            HydroVac Finder is a nationwide platform connecting Hydro-Vac Companies and Disposal Facilities 
            with contractors, utilities, pipeline crews, municipalities, and project managers across the United States.
          </p>
          <div className={styles.heroMission}>
            <strong>Our Mission:</strong> Make it fast and easy to locate the closest hydro-vac service or disposal site — 
            reducing downtime, cutting travel costs, and increasing visibility for companies listed on our platform.
          </div>
        </div>
      </section>

      {/* Search & Navigation Section */}
      <section className={styles.searchSection}>
        <div className={styles.searchContent}>
          <h3 className={styles.searchTitle}>Search &amp; Navigation</h3>
          <p className={styles.searchDescription}>
            Filter by company type and search radius to find the perfect match for your needs.
          </p>
          <div className={styles.searchFilters}>
            <button className={styles.filterButton}>Hydro-Vac Companies</button>
            <button className={styles.filterButton}>Disposal Facilities</button>
          </div>
          <div className={styles.radiusOptions}>
            <button className={styles.radiusButton}>25 miles</button>
            <button className={styles.radiusButton}>50 miles</button>
            <button className={styles.radiusButton}>75 miles</button>
            <button className={styles.radiusButton}>100 miles</button>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Listings</h3>
        <p className={styles.sectionSubtitle}>
          Browse Hydro-Vac Companies and Disposal Facilities across the United States
        </p>
        <div className={styles.listingsGrid}>
          {/* Hydro-Vac Companies */}
          <div className={styles.listingCard}>
            <h4 className={styles.listingCardTitle}>Hydro-Vac Companies</h4>
            <ul className={styles.tierList}>
              <li>
                <span className={`${styles.tierBadge} ${styles.tierPremium}`}>Premium</span>
                Top placement with maximum visibility
              </li>
              <li>
                <span className={`${styles.tierBadge} ${styles.tierFeatured}`}>Featured</span>
                Mid-tier with enhanced visibility
              </li>
              <li>
                <span className={`${styles.tierBadge} ${styles.tierVerified}`}>Verified</span>
                Standard tier listing
              </li>
            </ul>
            <div className={styles.listingDetails}>
              <p><strong>Each listing includes:</strong></p>
              <p>• Company name, City &amp; State</p>
              <p>• Phone number &amp; Website link</p>
              <p>• Services offered &amp; Coverage radius</p>
              <p>• Union affiliation (Yes/No + Local # if applicable)</p>
              <p>• &quot;Call Now&quot; &amp; &quot;Visit Website&quot; buttons</p>
            </div>
          </div>

          {/* Disposal Facilities */}
          <div className={styles.listingCard}>
            <h4 className={styles.listingCardTitle}>Disposal Facilities</h4>
            <ul className={styles.tierList}>
              <li>
                <span className={`${styles.tierBadge} ${styles.tierVerified}`}>Verified</span>
                Verified tier only
              </li>
            </ul>
            <div className={styles.listingDetails}>
              <p><strong>Each listing includes:</strong></p>
              <p>• Facility name &amp; Address</p>
              <p>• Materials accepted</p>
              <p>• Hours of operation</p>
              <p>• Phone number</p>
              <p>• Navigate to Location link</p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Packages Section */}
      <section className={styles.packagesSection}>
        <div className={styles.packagesContent}>
          <h3 className={styles.sectionTitle}>Membership Packages</h3>
          <p className={styles.sectionSubtitle}>
            Choose the package that fits your business needs
          </p>
          <div className={styles.packagesGrid}>
            {/* Verified Package */}
            <div className={styles.packageCard}>
              <h4 className={styles.packageName}>Verified</h4>
              <div className={styles.packagePrice}>$100<span className={styles.packagePriceSmall}>/month</span></div>
              <div className={styles.packagePriceSmall}>or $1,000/year</div>
              <ul className={styles.packageFeatures}>
                <li>Standard tier listing</li>
                <li>Company profile page</li>
                <li>Click-to-call functionality</li>
                <li>Website link</li>
              </ul>
            </div>

            {/* Featured Package */}
            <div className={`${styles.packageCard} ${styles.packageCardFeatured}`}>
              <h4 className={styles.packageName}>Featured</h4>
              <div className={styles.packagePrice}>$125<span className={styles.packagePriceSmall}>/month</span></div>
              <div className={styles.packagePriceSmall}>or $1,250/year</div>
              <ul className={styles.packageFeatures}>
                <li>Enhanced visibility</li>
                <li>Mid-tier placement</li>
                <li>Company profile page</li>
                <li>Click-to-call functionality</li>
                <li>Website link</li>
              </ul>
            </div>

            {/* Premium Package */}
            <div className={`${styles.packageCard} ${styles.packageCardPremium}`}>
              <h4 className={styles.packageName}>Premium</h4>
              <div className={styles.packagePrice}>$150<span className={styles.packagePriceSmall}>/month</span></div>
              <div className={styles.packagePriceSmall}>or $1,500/year</div>
              <ul className={styles.packageFeatures}>
                <li>Top placement</li>
                <li>Maximum visibility</li>
                <li>Company profile page</li>
                <li>Click-to-call functionality</li>
                <li>Website link</li>
                <li>Priority support</li>
              </ul>
            </div>

            {/* State Page Ownership */}
            <div className={styles.packageCard}>
              <h4 className={styles.packageName}>State Page Ownership</h4>
              <div className={styles.packagePrice}>$2,500<span className={styles.packagePriceSmall}>/year</span></div>
              <ul className={styles.packageFeatures}>
                <li>Exclusive state page presence</li>
                <li>Banner image placement</li>
                <li>Maximum regional visibility</li>
                <li>SEO benefits</li>
              </ul>
            </div>

            {/* Disposal Facility */}
            <div className={styles.packageCard}>
              <h4 className={styles.packageName}>Disposal Facility</h4>
              <div className={styles.packagePrice}>$2,000<span className={styles.packagePriceSmall}>/year</span></div>
              <ul className={styles.packageFeatures}>
                <li>Verified listing</li>
                <li>Facility profile page</li>
                <li>Navigate to location link</li>
                <li>Contact information display</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className={styles.referralSection}>
        <div className={styles.referralContent}>
          <h3 className={styles.referralTitle}>Referral Program</h3>
          <div className={styles.referralAmount}>Earn $150</div>
          <p className={styles.referralDescription}>
            per referral for every Featured signup (Hydro-Vac or Disposal). No limit on referrals!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>HydroVacFinder.com</div>
          <p className={styles.footerTagline}>&quot;America&apos;s #1 Hydro-Vac &amp; Disposal Facility Directory&quot;</p>
          <div className={styles.footerContact}>
            <p>Contact us:</p>
            <p>
              <a href="mailto:info@hydrovacfinder.com">info@hydrovacfinder.com</a>
            </p>
            <p>
              <a href="tel:574-339-6004">Phone: 574-339-6004</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
