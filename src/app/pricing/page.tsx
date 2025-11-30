import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const hydrovacPackages = [
  {
    tier: 'verified',
    name: 'Verified',
    monthlyPrice: 100,
    yearlyPrice: 1000,
    pinColor: '#3B82F6',
    features: [
      'Blue pin on map',
      'Company profile listing',
      'Phone number display',
      'Website link',
      'Service specialties',
      'Coverage radius display',
      'Click-to-call button',
    ],
  },
  {
    tier: 'featured',
    name: 'Featured',
    monthlyPrice: 125,
    yearlyPrice: 1250,
    pinColor: '#22C55E',
    popular: true,
    features: [
      'Green pin on map',
      'Everything in Verified, plus:',
      'Higher listing placement',
      'Enhanced profile visibility',
      'Featured badge',
      'Priority in search results',
    ],
  },
  {
    tier: 'premium',
    name: 'Premium',
    monthlyPrice: 150,
    yearlyPrice: 1500,
    pinColor: '#EAB308',
    features: [
      'Gold pin on map',
      'Everything in Featured, plus:',
      'Top listing placement',
      'Premium badge',
      'Featured in state pages',
      'Maximum visibility',
      'Priority support',
    ],
  },
];

const stateOwnership = {
  name: 'State Page Ownership',
  yearlyPrice: 2500,
  features: [
    'Exclusive state page branding',
    'Your company featured at top',
    'Custom header image',
    'SEO benefits for your state',
    'Direct leads from state page',
    'Annual commitment',
  ],
};

const disposalPackage = {
  name: 'Disposal Facility Verified',
  yearlyPrice: 2000,
  features: [
    'Green pin on map',
    'Facility profile listing',
    'Materials accepted list',
    'Hours of operation',
    'Phone number display',
    'Navigate to location button',
    'Facility photos slideshow',
  ],
};

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Get Listed on HydroVacFinder</h1>
          <p className={styles.subtitle}>
            Choose the perfect plan to grow your business and reach more customers
          </p>
        </section>

        {/* Why Companies Pay Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why Companies Pay to Be Listed on HydroVacFinder.com</h2>
          <div className={styles.whyPayGrid}>
            <div className={styles.whyPayCard}>
              <div className={styles.whyPayNumber}>1</div>
              <h3 className={styles.whyPayTitle}>You get found by the people who actually control the work.</h3>
              <p className={styles.whyPayDesc}>
                HydroVacFinder.com is actively used nationwide by project managers from major construction firms, utility companies, pipeline contractors, and large industrial clients. These are the people who make the call on who gets hired — not random web traffic.
              </p>
            </div>
            <div className={styles.whyPayCard}>
              <div className={styles.whyPayNumber}>2</div>
              <h3 className={styles.whyPayTitle}>You show up where customers are already searching.</h3>
              <p className={styles.whyPayDesc}>
                Contractors aren&apos;t digging through Google anymore. They go straight to HydroVacFinder.com because it&apos;s the only directory built exclusively for hydro-vac companies and disposal sites. Paying members get pushed to the top and get seen first.
              </p>
            </div>
            <div className={styles.whyPayCard}>
              <div className={styles.whyPayNumber}>3</div>
              <h3 className={styles.whyPayTitle}>Your competitors are being seen — if you&apos;re not listed, you&apos;re invisible.</h3>
              <p className={styles.whyPayDesc}>
                The directory is filling up fast. When PMs zoom into a state or a city, the first companies they see are Featured and Premium members. If someone else is showing up instead of you, they&apos;re getting the calls you should be getting.
              </p>
            </div>
            <div className={styles.whyPayCard}>
              <div className={styles.whyPayNumber}>4</div>
              <h3 className={styles.whyPayTitle}>Increased call volume and higher-quality leads.</h3>
              <p className={styles.whyPayDesc}>
                Paid listings get priority placement on state pages, more profile visibility, and better exposure on the interactive map. That means more inbound calls from real contractors needing trucks, not tire-kickers.
              </p>
            </div>
            <div className={styles.whyPayCard}>
              <div className={styles.whyPayNumber}>5</div>
              <h3 className={styles.whyPayTitle}>Your brand gains credibility instantly.</h3>
              <p className={styles.whyPayDesc}>
                A Verified, Featured, or Premium badge on the largest hydro-vac directory in the country separates you from small outfits and unverified listings. PMs trust companies that show up professionally and are easy to contact.
              </p>
            </div>
            <div className={styles.whyPayCard}>
              <div className={styles.whyPayNumber}>6</div>
              <h3 className={styles.whyPayTitle}>It eliminates downtime and keeps your trucks working.</h3>
              <p className={styles.whyPayDesc}>
                Idle trucks cost money. A paid listing puts your business in front of crews who need subs right now — whether it&apos;s an emergency dig, a last-minute call-out, or a scheduled long-term project.
              </p>
            </div>
          </div>
        </section>

        {/* Hydro-Vac Company Packages */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Hydro-Vac Company Packages</h2>
          <div className={styles.pricingGrid}>
            {hydrovacPackages.map((pkg) => (
              <div 
                key={pkg.tier} 
                className={`${styles.pricingCard} ${pkg.popular ? styles.popular : ''}`}
              >
                {pkg.popular && <span className={styles.popularBadge}>Most Popular</span>}
                <div className={styles.cardHeader}>
                  <div 
                    className={styles.pinIndicator} 
                    style={{ backgroundColor: pkg.pinColor }}
                  ></div>
                  <h3 className={styles.planName}>{pkg.name}</h3>
                </div>
                <div className={styles.pricing}>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>${pkg.monthlyPrice}</span>
                    <span className={styles.period}>/month</span>
                  </div>
                  <div className={styles.yearlyPrice}>
                    or ${pkg.yearlyPrice.toLocaleString()}/year (save 2 months)
                  </div>
                </div>
                <ul className={styles.features}>
                  {pkg.features.map((feature, index) => (
                    <li key={index} className={styles.feature}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={styles.ctaButton}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* State Page Ownership */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>State Page Ownership</h2>
          <div className={styles.specialCard}>
            <div className={styles.specialContent}>
              <div>
                <h3 className={styles.specialTitle}>{stateOwnership.name}</h3>
                <p className={styles.specialDesc}>
                  Own your state&apos;s landing page and get exclusive visibility for all hydro-vac searches in your state.
                </p>
                <ul className={styles.specialFeatures}>
                  {stateOwnership.features.map((feature, index) => (
                    <li key={index}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.specialPricing}>
                <span className={styles.specialPrice}>${stateOwnership.yearlyPrice.toLocaleString()}</span>
                <span className={styles.specialPeriod}>/year</span>
                <button className={styles.ctaButtonGold}>
                  Claim Your State
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Disposal Facility Package */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Disposal Facility Package</h2>
          <div className={styles.specialCard}>
            <div className={styles.specialContent}>
              <div>
                <h3 className={styles.specialTitle}>{disposalPackage.name}</h3>
                <p className={styles.specialDesc}>
                  Get your disposal facility listed and help hydro-vac companies find you easily.
                </p>
                <ul className={styles.specialFeatures}>
                  {disposalPackage.features.map((feature, index) => (
                    <li key={index}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.specialPricing}>
                <span className={styles.specialPrice}>${disposalPackage.yearlyPrice.toLocaleString()}</span>
                <span className={styles.specialPeriod}>/year</span>
                <button className={styles.ctaButtonGreen}>
                  List Your Facility
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Referral Program */}
        <section id="referral" className={styles.section}>
          <h2 className={styles.sectionTitle}>Referral Program</h2>
          <div className={styles.referralCard}>
            <div className={styles.referralContent}>
              <div className={styles.referralIcon}>💰</div>
              <h3 className={styles.referralTitle}>Earn $150 Per Referral</h3>
              <p className={styles.referralDesc}>
                Refer a Hydro-Vac company or Disposal Facility that signs up for a Featured or higher package,
                and earn $150 for each successful referral. Unlimited referrals!
              </p>
              <button className={styles.ctaButton}>
                Join Referral Program
              </button>
            </div>
          </div>
        </section>

        {/* Payment Info */}
        <section className={styles.paymentInfo}>
          <p>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Secure payments powered by Stripe. Cancel anytime.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
