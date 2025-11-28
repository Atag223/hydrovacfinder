'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import styles from './page.module.css';
import { mockHydroVacCompanies, mockDisposalFacilities } from '@/data/mockData';
import { DateFilter, HydroVacTier } from '@/types';

type AdminTab = 'companies' | 'facilities' | 'analytics' | 'content';

const mockAnalytics = {
  today: {
    totalVisits: 1245,
    visitsByState: { Texas: 324, California: 289, Illinois: 156, 'New York': 142, Florida: 98 },
    topStatePages: [
      { state: 'Texas', views: 456 },
      { state: 'California', views: 389 },
      { state: 'Illinois', views: 234 },
      { state: 'New York', views: 198 },
    ],
    companyMetrics: {
      profileViews: 856,
      clickToCalls: 234,
      websiteClicks: 312,
      directionRequests: 145,
      disposalClicks: 89,
    },
  },
  '7days': {
    totalVisits: 8543,
    visitsByState: { Texas: 2156, California: 1892, Illinois: 1023, 'New York': 945, Florida: 687 },
    topStatePages: [
      { state: 'Texas', views: 3124 },
      { state: 'California', views: 2678 },
      { state: 'Illinois', views: 1567 },
      { state: 'New York', views: 1234 },
    ],
    companyMetrics: {
      profileViews: 5892,
      clickToCalls: 1567,
      websiteClicks: 2134,
      directionRequests: 987,
      disposalClicks: 623,
    },
  },
  '30days': {
    totalVisits: 35678,
    visitsByState: { Texas: 8945, California: 7823, Illinois: 4234, 'New York': 3892, Florida: 2845 },
    topStatePages: [
      { state: 'Texas', views: 12456 },
      { state: 'California', views: 10234 },
      { state: 'Illinois', views: 6234 },
      { state: 'New York', views: 5123 },
    ],
    companyMetrics: {
      profileViews: 24567,
      clickToCalls: 6534,
      websiteClicks: 8923,
      directionRequests: 4123,
      disposalClicks: 2567,
    },
  },
  allTime: {
    totalVisits: 156234,
    visitsByState: { Texas: 39234, California: 34123, Illinois: 18567, 'New York': 17023, Florida: 12456 },
    topStatePages: [
      { state: 'Texas', views: 54234 },
      { state: 'California', views: 44567 },
      { state: 'Illinois', views: 27234 },
      { state: 'New York', views: 22345 },
    ],
    companyMetrics: {
      profileViews: 107234,
      clickToCalls: 28567,
      websiteClicks: 39023,
      directionRequests: 18023,
      disposalClicks: 11234,
    },
  },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('companies');
  const [dateFilter, setDateFilter] = useState<DateFilter>('7days');

  return (
    <>
      <Navigation isAdmin={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.subtitle}>Manage companies, facilities, and view analytics</p>
          </header>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'companies' ? styles.active : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              Hydro-Vac Companies
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'facilities' ? styles.active : ''}`}
              onClick={() => setActiveTab('facilities')}
            >
              Disposal Facilities
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'content' ? styles.active : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content Management
            </button>
          </div>

          <div className={styles.content}>
            {activeTab === 'companies' && <CompaniesPanel />}
            {activeTab === 'facilities' && <FacilitiesPanel />}
            {activeTab === 'analytics' && (
              <AnalyticsPanel 
                dateFilter={dateFilter} 
                onDateFilterChange={setDateFilter} 
              />
            )}
            {activeTab === 'content' && <ContentPanel />}
          </div>
        </div>
      </main>
    </>
  );
}

function CompaniesPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Hydro-Vac Companies</h2>
        <button className={styles.addBtn}>+ Add Company</button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Location</th>
              <th>Tier</th>
              <th>Union</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockHydroVacCompanies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.city}, {company.state}</td>
                <td>
                  <TierBadge tier={company.tier} />
                </td>
                <td>{company.unionAffiliation ? `Yes - ${company.unionLocalNumber}` : 'No'}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn}>Edit</button>
                    <button className={styles.deleteBtn}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FacilitiesPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Disposal Facilities</h2>
        <button className={styles.addBtn}>+ Add Facility</button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Location</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDisposalFacilities.map((facility) => (
              <tr key={facility.id}>
                <td>{facility.name}</td>
                <td>{facility.city}, {facility.state}</td>
                <td>{facility.hours}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn}>Edit</button>
                    <button className={styles.imageBtn}>Images</button>
                    <button className={styles.deleteBtn}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsPanel({ 
  dateFilter, 
  onDateFilterChange 
}: { 
  dateFilter: DateFilter; 
  onDateFilterChange: (filter: DateFilter) => void;
}) {
  const data = mockAnalytics[dateFilter];

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Analytics Overview</h2>
        <div className={styles.dateFilters}>
          <button 
            className={`${styles.dateBtn} ${dateFilter === 'today' ? styles.active : ''}`}
            onClick={() => onDateFilterChange('today')}
          >
            Today
          </button>
          <button 
            className={`${styles.dateBtn} ${dateFilter === '7days' ? styles.active : ''}`}
            onClick={() => onDateFilterChange('7days')}
          >
            Last 7 Days
          </button>
          <button 
            className={`${styles.dateBtn} ${dateFilter === '30days' ? styles.active : ''}`}
            onClick={() => onDateFilterChange('30days')}
          >
            Last 30 Days
          </button>
          <button 
            className={`${styles.dateBtn} ${dateFilter === 'allTime' ? styles.active : ''}`}
            onClick={() => onDateFilterChange('allTime')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{data.totalVisits.toLocaleString()}</span>
          <span className={styles.statLabel}>Total Site Visits</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{data.companyMetrics.profileViews.toLocaleString()}</span>
          <span className={styles.statLabel}>Company Profile Views</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{data.companyMetrics.clickToCalls.toLocaleString()}</span>
          <span className={styles.statLabel}>Click-to-Call</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{data.companyMetrics.websiteClicks.toLocaleString()}</span>
          <span className={styles.statLabel}>Website Clicks</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{data.companyMetrics.directionRequests.toLocaleString()}</span>
          <span className={styles.statLabel}>Direction Requests</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{data.companyMetrics.disposalClicks.toLocaleString()}</span>
          <span className={styles.statLabel}>Disposal Facility Clicks</span>
        </div>
      </div>

      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <h3 className={styles.analyticsTitle}>Visits by State</h3>
          <ul className={styles.statList}>
            {Object.entries(data.visitsByState).map(([state, visits]) => (
              <li key={state} className={styles.statItem}>
                <span>{state}</span>
                <span>{visits.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.analyticsCard}>
          <h3 className={styles.analyticsTitle}>Top State Landing Pages</h3>
          <ul className={styles.statList}>
            {data.topStatePages.map(({ state, views }) => (
              <li key={state} className={styles.statItem}>
                <span>{state}</span>
                <span>{views.toLocaleString()} views</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ContentPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Content Management</h2>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.contentCard}>
          <h3 className={styles.contentTitle}>State Landing Pages</h3>
          <p className={styles.contentDesc}>
            Edit headers, SEO text, and images for state-specific landing pages.
          </p>
          <button className={styles.manageBtn}>Manage State Pages</button>
        </div>
        <div className={styles.contentCard}>
          <h3 className={styles.contentTitle}>Disposal Facility Slideshows</h3>
          <p className={styles.contentDesc}>
            Add, edit, or delete slideshow images for disposal facility state pages.
          </p>
          <button className={styles.manageBtn}>Manage Slideshows</button>
        </div>
        <div className={styles.contentCard}>
          <h3 className={styles.contentTitle}>Pricing Page</h3>
          <p className={styles.contentDesc}>
            Update pricing page text, graphics, and package details.
          </p>
          <button className={styles.manageBtn}>Edit Pricing Page</button>
        </div>
        <div className={styles.contentCard}>
          <h3 className={styles.contentTitle}>Homepage Content</h3>
          <p className={styles.contentDesc}>
            Edit hero section, headlines, and other homepage content.
          </p>
          <button className={styles.manageBtn}>Edit Homepage</button>
        </div>
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: HydroVacTier }) {
  const tierStyles: Record<HydroVacTier, string> = {
    basic: styles.tierBasic,
    verified: styles.tierVerified,
    featured: styles.tierFeatured,
    premium: styles.tierPremium,
  };

  return (
    <span className={`${styles.tierBadge} ${tierStyles[tier]}`}>
      {tier}
    </span>
  );
}
