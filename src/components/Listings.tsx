'use client';

import { HydroVacCompany, DisposalFacility, FilterType, HydroVacTier } from '@/types';
import styles from './Listings.module.css';

interface ListingsProps {
  companies: HydroVacCompany[];
  facilities: DisposalFacility[];
  activeFilter: FilterType;
}

const tierOrder: Record<HydroVacTier, number> = {
  premium: 0,
  featured: 1,
  verified: 2,
  basic: 3,
};

function getTierBadgeClass(tier: HydroVacTier): string {
  switch (tier) {
    case 'premium':
      return styles.badgePremium;
    case 'featured':
      return styles.badgeFeatured;
    case 'verified':
      return styles.badgeVerified;
    default:
      return styles.badgeBasic;
  }
}

export default function Listings({ companies, facilities, activeFilter }: ListingsProps) {
  const sortedCompanies = [...companies].sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

  const showCompanies = activeFilter === 'all' || activeFilter === 'hydrovac';
  const showFacilities = activeFilter === 'all' || activeFilter === 'disposal';

  return (
    <section className={styles.listings}>
      <div className={styles.container}>
        {showCompanies && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Hydro-Vac Companies
              <span className={styles.count}>({sortedCompanies.length})</span>
            </h2>
            <div className={styles.grid}>
              {sortedCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        )}

        {showFacilities && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Disposal Facilities
              <span className={styles.count}>({facilities.length})</span>
            </h2>
            <div className={styles.grid}>
              {facilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CompanyCard({ company }: { company: HydroVacCompany }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleRow}>
          <h3 className={styles.cardTitle}>{company.name}</h3>
          <span className={`${styles.badge} ${getTierBadgeClass(company.tier)}`}>
            {company.tier}
          </span>
        </div>
        <p className={styles.location}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {company.city}, {company.state}
        </p>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Phone:</span>
          <span className={styles.value}>{company.phone}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Coverage:</span>
          <span className={styles.value}>{company.coverageRadius} miles</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Union:</span>
          <span className={styles.value}>
            {company.unionAffiliation ? `Yes - ${company.unionLocalNumber}` : 'No'}
          </span>
        </div>
        <div className={styles.specialties}>
          <span className={styles.label}>Services:</span>
          <div className={styles.tags}>
            {company.serviceSpecialties.map((specialty, index) => (
              <span key={index} className={styles.tag}>{specialty}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <a href={`tel:${company.phone.replace(/\D/g, '')}`} className={styles.callBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call Now
        </a>
        <a href={company.website} target="_blank" rel="noopener noreferrer" className={styles.websiteBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Visit Website
        </a>
      </div>
    </article>
  );
}

function FacilityCard({ facility }: { facility: DisposalFacility }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleRow}>
          <h3 className={styles.cardTitle}>{facility.name}</h3>
          <span className={`${styles.badge} ${styles.badgeVerified}`}>
            Verified
          </span>
        </div>
        <p className={styles.location}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {facility.address}, {facility.city}, {facility.state}
        </p>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Phone:</span>
          <span className={styles.value}>{facility.phone}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Hours:</span>
          <span className={styles.value}>{facility.hours}</span>
        </div>
        <div className={styles.specialties}>
          <span className={styles.label}>Materials Accepted:</span>
          <div className={styles.tags}>
            {facility.materialsAccepted.map((material, index) => (
              <span key={index} className={styles.tag}>{material}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${facility.address}, ${facility.city}, ${facility.state}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.directionsBtn}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 11l19-9-9 19-2-8-8-2z" />
          </svg>
          Navigate to Location
        </a>
      </div>
    </article>
  );
}
