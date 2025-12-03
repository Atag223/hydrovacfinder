'use client';

import { useState, useSyncExternalStore, useCallback, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import styles from './page.module.css';
import { DateFilter, HydroVacTier, US_STATES } from '@/types';

type AdminTab = 'companies' | 'facilities' | 'analytics' | 'content';
type ContentSection = 'state-pages' | 'slideshows' | 'pricing' | 'homepage' | null;

const ADMIN_PASSWORD = 'Ajt223';

// Types for database models
interface DBCompany {
  id: number;
  name: string;
  city: string;
  state: string;
  phone: string | null;
  website: string | null;
  tier: string;
  coverageRadius: number | null;
  latitude: number | null;
  longitude: number | null;
  unionAffiliated: boolean;
  specialties: string | null;
  images?: { id: number; imageUrl: string }[];
}

interface DBDisposalFacility {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  materialsAccepted: string | null;
}

interface DBStateLandingPage {
  id: number;
  state: string;
  header: string | null;
  description: string | null;
  logoUrl: string | null;
  images?: { id: number; imageUrl: string }[];
}

interface DBPricingTier {
  id: number;
  name: string;
  monthly: number;
  annual: number;
  sortOrder: number;
}

interface DBSlideshowImage {
  id: number;
  imageUrl: string;
  state?: string;
}

// Custom hook to sync with sessionStorage using useSyncExternalStore
function useSessionStorageAuth() {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);
  
  const getSnapshot = useCallback(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  }, []);
  
  const getServerSnapshot = useCallback(() => {
    return false;
  }, []);
  
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

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
  const isAuthenticatedFromStorage = useSessionStorageAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Track manual login to avoid flickering
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const isAuthenticated = isAuthenticatedFromStorage || hasLoggedIn;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      setHasLoggedIn(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setHasLoggedIn(false);
    setPassword('');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Navigation />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loginContainer}>
              <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>Admin Login</h1>
                <p className={styles.loginSubtitle}>Please enter the admin password to continue</p>
                <form onSubmit={handleLogin} className={styles.loginForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Password</label>
                    <input
                      type="password"
                      className={styles.formInput}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      autoFocus
                      required
                    />
                  </div>
                  {error && <p className={styles.loginError}>{error}</p>}
                  <button type="submit" className={styles.loginBtn}>
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation isAdmin={true} />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerTop}>
              <div>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <p className={styles.subtitle}>Manage companies, facilities, and view analytics</p>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
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
  const [companies, setCompanies] = useState<DBCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<DBCompany | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<DBCompany | null>(null);
  const [isAddingCompany, setIsAddingCompany] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (company: DBCompany) => {
    try {
      const images = company.images?.map(img => img.imageUrl) || [];
      const payload = {
        name: company.name,
        city: company.city,
        state: company.state,
        phone: company.phone,
        website: company.website,
        tier: company.tier,
        coverageRadius: company.coverageRadius,
        latitude: company.latitude,
        longitude: company.longitude,
        unionAffiliated: company.unionAffiliated,
        specialties: company.specialties,
        images,
      };

      if (isAddingCompany) {
        const response = await fetch('/api/companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          await fetchCompanies();
        }
      } else {
        const response = await fetch(`/api/companies/${company.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          await fetchCompanies();
        }
      }
    } catch (error) {
      console.error('Error saving company:', error);
    }
    setEditingCompany(null);
    setIsAddingCompany(false);
  };

  const handleDeleteCompany = async (company: DBCompany) => {
    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCompanies(companies.filter(c => c.id !== company.id));
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    }
    setDeletingCompany(null);
  };

  const handleAddClick = () => {
    setIsAddingCompany(true);
    setEditingCompany({
      id: 0,
      name: '',
      city: '',
      state: '',
      phone: '',
      website: '',
      tier: 'Basic',
      coverageRadius: 100,
      latitude: null,
      longitude: null,
      unionAffiliated: false,
      specialties: '',
      images: [],
    });
  };

  if (loading) {
    return <div className={styles.panel}><p>Loading companies...</p></div>;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Hydro-Vac Companies</h2>
        <button className={styles.addBtn} onClick={handleAddClick}>+ Add Company</button>
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
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.city}, {company.state}</td>
                <td>
                  <TierBadge tier={company.tier.toLowerCase() as HydroVacTier} />
                </td>
                <td>{company.unionAffiliated ? 'Yes' : 'No'}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => setEditingCompany(company)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => setDeletingCompany(company)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Company Modal */}
      {editingCompany && (
        <CompanyModalDB
          company={editingCompany}
          isNew={isAddingCompany}
          onSave={handleSaveCompany}
          onClose={() => { setEditingCompany(null); setIsAddingCompany(false); }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCompany && (
        <DeleteConfirmModal
          title="Delete Company"
          message={`Are you sure you want to delete "${deletingCompany.name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteCompany(deletingCompany)}
          onCancel={() => setDeletingCompany(null)}
        />
      )}
    </div>
  );
}

function FacilitiesPanel() {
  const [facilities, setFacilities] = useState<DBDisposalFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFacility, setEditingFacility] = useState<DBDisposalFacility | null>(null);
  const [deletingFacility, setDeletingFacility] = useState<DBDisposalFacility | null>(null);
  const [isAddingFacility, setIsAddingFacility] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch('/api/disposals');
      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFacility = async (facility: DBDisposalFacility) => {
    try {
      const payload = {
        name: facility.name,
        address: facility.address,
        city: facility.city,
        state: facility.state,
        phone: facility.phone,
        hours: facility.hours,
        latitude: facility.latitude,
        longitude: facility.longitude,
        materialsAccepted: facility.materialsAccepted,
      };

      if (isAddingFacility) {
        const response = await fetch('/api/disposals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          await fetchFacilities();
        }
      } else {
        const response = await fetch(`/api/disposals/${facility.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          await fetchFacilities();
        }
      }
    } catch (error) {
      console.error('Error saving facility:', error);
    }
    setEditingFacility(null);
    setIsAddingFacility(false);
  };

  const handleDeleteFacility = async (facility: DBDisposalFacility) => {
    try {
      const response = await fetch(`/api/disposals/${facility.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFacilities(facilities.filter(f => f.id !== facility.id));
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
    setDeletingFacility(null);
  };

  const handleAddClick = () => {
    setIsAddingFacility(true);
    setEditingFacility({
      id: 0,
      name: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      hours: '',
      latitude: null,
      longitude: null,
      materialsAccepted: '',
    });
  };

  if (loading) {
    return <div className={styles.panel}><p>Loading facilities...</p></div>;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Disposal Facilities</h2>
        <button className={styles.addBtn} onClick={handleAddClick}>+ Add Facility</button>
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
            {facilities.map((facility) => (
              <tr key={facility.id}>
                <td>{facility.name}</td>
                <td>{facility.city}, {facility.state}</td>
                <td>{facility.hours}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => setEditingFacility(facility)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => setDeletingFacility(facility)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Facility Modal */}
      {editingFacility && (
        <FacilityModalDB
          facility={editingFacility}
          isNew={isAddingFacility}
          onSave={handleSaveFacility}
          onClose={() => { setEditingFacility(null); setIsAddingFacility(false); }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingFacility && (
        <DeleteConfirmModal
          title="Delete Facility"
          message={`Are you sure you want to delete "${deletingFacility.name}"? This action cannot be undone.`}
          onConfirm={() => handleDeleteFacility(deletingFacility)}
          onCancel={() => setDeletingFacility(null)}
        />
      )}
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
  const [activeSection, setActiveSection] = useState<ContentSection>(null);

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
          <button className={styles.manageBtn} onClick={() => setActiveSection('state-pages')}>Manage State Pages</button>
        </div>
        <div className={styles.contentCard}>
          <h3 className={styles.contentTitle}>Disposal Facility Slideshows</h3>
          <p className={styles.contentDesc}>
            Add, edit, or delete slideshow images for disposal facility state pages.
          </p>
          <button className={styles.manageBtn} onClick={() => setActiveSection('slideshows')}>Manage Slideshows</button>
        </div>
        <div className={styles.contentCard}>
          <h3 className={styles.contentTitle}>Pricing Page</h3>
          <p className={styles.contentDesc}>
            Update pricing page text, graphics, and package details.
          </p>
          <button className={styles.manageBtn} onClick={() => setActiveSection('pricing')}>Edit Pricing Page</button>
        </div>
        <div className={styles.contentCard}>
          <h3 className={styles.contentTitle}>Homepage Content</h3>
          <p className={styles.contentDesc}>
            Edit hero section, headlines, and other homepage content.
          </p>
          <button className={styles.manageBtn} onClick={() => setActiveSection('homepage')}>Edit Homepage</button>
        </div>
      </div>

      {/* Content Section Modals */}
      {activeSection === 'state-pages' && (
        <ContentModal
          title="State Landing Pages"
          onClose={() => setActiveSection(null)}
        >
          <StatePagesEditor onClose={() => setActiveSection(null)} />
        </ContentModal>
      )}
      {activeSection === 'slideshows' && (
        <ContentModal
          title="Disposal Facility Slideshows"
          onClose={() => setActiveSection(null)}
        >
          <SlideshowsEditor onClose={() => setActiveSection(null)} />
        </ContentModal>
      )}
      {activeSection === 'pricing' && (
        <ContentModal
          title="Pricing Page Editor"
          onClose={() => setActiveSection(null)}
        >
          <PricingEditor onClose={() => setActiveSection(null)} />
        </ContentModal>
      )}
      {activeSection === 'homepage' && (
        <ContentModal
          title="Homepage Content Editor"
          onClose={() => setActiveSection(null)}
        >
          <HomepageEditor onClose={() => setActiveSection(null)} />
        </ContentModal>
      )}
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

// Modal Components

function DeleteConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeBtn} onClick={onCancel}>×</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.deleteMessage}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={styles.confirmDeleteBtn} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function ContentModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

function StatePagesEditor({ onClose }: { onClose: () => void }) {
  const [selectedState, setSelectedState] = useState('');
  const [pages, setPages] = useState<DBStateLandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<DBStateLandingPage | null>(null);
  const [headerText, setHeaderText] = useState('');
  const [seoText, setSeoText] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [companyImages, setCompanyImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/state');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching state pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const page = pages.find(p => p.state === state);
    if (page) {
      setCurrentPage(page);
      setHeaderText(page.header || '');
      setSeoText(page.description || '');
      setCompanyLogoUrl(page.logoUrl || '');
      setCompanyImages(page.images?.map(img => img.imageUrl) || []);
    } else {
      setCurrentPage(null);
      setHeaderText('');
      setSeoText('');
      setCompanyLogoUrl('');
      setCompanyImages([]);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddImage = () => {
    const trimmedUrl = newImageUrl.trim();
    if (trimmedUrl && isValidUrl(trimmedUrl) && !companyImages.includes(trimmedUrl)) {
      setCompanyImages([...companyImages, trimmedUrl]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setCompanyImages(companyImages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const payload = {
        state: selectedState,
        header: headerText,
        description: seoText,
        logoUrl: companyLogoUrl,
        images: companyImages,
      };

      if (currentPage) {
        await fetch(`/api/state/${currentPage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      await fetchPages();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving state page:', error);
    }
  };

  if (loading) {
    return <div className={styles.editorContent}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.editorContent}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select State</label>
        <select
          className={styles.formSelect}
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
        >
          <option value="">Choose a state to edit</option>
          {US_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      {selectedState && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Page Header</label>
            <input
              type="text"
              className={styles.formInput}
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder={`Hydro-Vac Services in ${selectedState}`}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>SEO Description</label>
            <textarea
              className={styles.formTextarea}
              value={seoText}
              onChange={(e) => setSeoText(e.target.value)}
              rows={4}
              placeholder="Enter SEO-optimized description for this state page..."
            />
          </div>

          {/* Company Advertising Section */}
          <h4 className={styles.editorSubtitle}>Company Advertising (State Landing Page Purchaser)</h4>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Company Logo URL</label>
            <input
              type="url"
              className={styles.formInput}
              value={companyLogoUrl}
              onChange={(e) => setCompanyLogoUrl(e.target.value)}
              placeholder="Enter company logo image URL"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Company Images (Trucks, Equipment, etc.)</label>
            <div className={styles.imageInputRow}>
              <input
                type="url"
                className={styles.formInput}
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
              <button type="button" className={styles.addImageBtn} onClick={handleAddImage}>Add</button>
            </div>
            <div className={styles.imageList}>
              {companyImages.length === 0 ? (
                <p className={styles.noImages}>No company images added yet.</p>
              ) : (
                companyImages.map((url, index) => (
                  <div key={index} className={styles.imageItem}>
                    <span className={styles.imageUrl}>{url}</span>
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.editorActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="button" className={styles.saveBtn} onClick={handleSave}>
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SlideshowsEditor({ onClose }: { onClose: () => void }) {
  const [selectedState, setSelectedState] = useState('');
  const [images, setImages] = useState<DBSlideshowImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const fetchImages = async (state: string) => {
    if (!state) {
      setImages([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/disposals/slideshow?state=${encodeURIComponent(state)}`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching slideshow images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    fetchImages(state);
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim() || !selectedState) return;
    try {
      const response = await fetch('/api/disposals/slideshow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: selectedState, imageUrl: newImageUrl.trim() }),
      });
      if (response.ok) {
        const newImage = await response.json();
        setImages([...images, newImage]);
        setNewImageUrl('');
      }
    } catch (error) {
      console.error('Error adding slideshow image:', error);
    }
  };

  const handleRemoveImage = async (id: number) => {
    try {
      const response = await fetch(`/api/disposals/slideshow/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setImages(images.filter(img => img.id !== id));
      }
    } catch (error) {
      console.error('Error removing slideshow image:', error);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.editorContent}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select State</label>
        <select
          className={styles.formSelect}
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
        >
          <option value="">Choose a state to manage slideshows</option>
          {US_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      {selectedState && (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className={styles.imageInputRow}>
                <input
                  type="url"
                  className={styles.formInput}
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
                <button type="button" className={styles.addImageBtn} onClick={handleAddImage}>Add</button>
              </div>
              <div className={styles.imageList}>
                {images.length === 0 ? (
                  <p className={styles.noImages}>No slideshow images for {selectedState}.</p>
                ) : (
                  images.map((img) => (
                    <div key={img.id} className={styles.imageItem}>
                      <span className={styles.imageUrl}>{img.imageUrl}</span>
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => handleRemoveImage(img.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className={styles.editorActions}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button type="button" className={styles.saveBtn} onClick={handleSave}>
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function PricingEditor({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<DBPricingTier[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const response = await fetch('/api/pricing');
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          // Create default tiers if none exist
          const defaultTiers = [
            { name: 'Basic', monthly: 0, annual: 0, sortOrder: 1 },
            { name: 'Verified', monthly: 99, annual: 990, sortOrder: 2 },
            { name: 'Featured', monthly: 199, annual: 1990, sortOrder: 3 },
            { name: 'Premium', monthly: 399, annual: 3990, sortOrder: 4 },
          ];
          setTiers(defaultTiers.map((t, i) => ({ ...t, id: -(i + 1) })) as DBPricingTier[]);
        } else {
          setTiers(data);
        }
      }
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTierChange = (id: number, field: string, value: number) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSave = async () => {
    try {
      for (const tier of tiers) {
        if (tier.id < 0) {
          // New tier - create it
          await fetch('/api/pricing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: tier.name,
              monthly: tier.monthly,
              annual: tier.annual,
              sortOrder: tier.sortOrder,
            }),
          });
        } else {
          // Existing tier - update it
          await fetch(`/api/pricing/${tier.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: tier.name,
              monthly: tier.monthly,
              annual: tier.annual,
              sortOrder: tier.sortOrder,
            }),
          });
        }
      }
      await fetchTiers();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving pricing tiers:', error);
    }
  };

  if (loading) {
    return <div className={styles.editorContent}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.editorContent}>
      <h4 className={styles.editorSubtitle}>Pricing Tiers</h4>
      <div className={styles.formGrid}>
        {tiers.map((tier) => (
          <div key={tier.id} className={styles.formGroup}>
            <label className={styles.formLabel}>{tier.name} ($/month)</label>
            <input
              type="number"
              className={styles.formInput}
              value={tier.monthly}
              onChange={(e) => handleTierChange(tier.id, 'monthly', parseFloat(e.target.value) || 0)}
            />
            <label className={styles.formLabel}>{tier.name} ($/year)</label>
            <input
              type="number"
              className={styles.formInput}
              value={tier.annual}
              onChange={(e) => handleTierChange(tier.id, 'annual', parseFloat(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
      <div className={styles.editorActions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function HomepageEditor({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [slideshowEnabled, setSlideshowEnabled] = useState(false);
  const [slideshowImages, setSlideshowImages] = useState<DBSlideshowImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchHomepageContent();
    fetchSlideshowImages();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      const response = await fetch('/api/homepage');
      if (response.ok) {
        const data = await response.json();
        setHeroTitle(data.heroTitle || '');
        setHeroSubtitle(data.heroSubtitle || '');
        setMainImage(data.mainImage || '');
        setSlideshowEnabled(data.slideshowEnabled || false);
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlideshowImages = async () => {
    try {
      const response = await fetch('/api/homepage/slideshow');
      if (response.ok) {
        const data = await response.json();
        setSlideshowImages(data);
      }
    } catch (error) {
      console.error('Error fetching slideshow images:', error);
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return;
    try {
      const response = await fetch('/api/homepage/slideshow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newImageUrl.trim() }),
      });
      if (response.ok) {
        const newImage = await response.json();
        setSlideshowImages([...slideshowImages, newImage]);
        setNewImageUrl('');
      }
    } catch (error) {
      console.error('Error adding slideshow image:', error);
    }
  };

  const handleRemoveImage = async (id: number) => {
    try {
      const response = await fetch(`/api/homepage/slideshow/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSlideshowImages(slideshowImages.filter(img => img.id !== id));
      }
    } catch (error) {
      console.error('Error removing slideshow image:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroTitle,
          heroSubtitle,
          mainImage,
          slideshowEnabled,
        }),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error saving homepage content:', error);
    }
  };

  if (loading) {
    return <div className={styles.editorContent}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.editorContent}>
      <h4 className={styles.editorSubtitle}>Hero Section</h4>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Hero Title</label>
        <input
          type="text"
          className={styles.formInput}
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Hero Subtitle</label>
        <textarea
          className={styles.formTextarea}
          value={heroSubtitle}
          onChange={(e) => setHeroSubtitle(e.target.value)}
          rows={3}
        />
      </div>

      <h4 className={styles.editorSubtitle}>Hero Image</h4>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          <input
            type="checkbox"
            checked={slideshowEnabled}
            onChange={(e) => setSlideshowEnabled(e.target.checked)}
          />{' '}
          Enable Slideshow (instead of single image)
        </label>
      </div>

      {!slideshowEnabled ? (
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Main Hero Image URL</label>
          <input
            type="url"
            className={styles.formInput}
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="Enter hero image URL"
          />
        </div>
      ) : (
        <>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Slideshow Images</label>
            <div className={styles.imageInputRow}>
              <input
                type="url"
                className={styles.formInput}
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
              <button type="button" className={styles.addImageBtn} onClick={handleAddImage}>Add</button>
            </div>
            <div className={styles.imageList}>
              {slideshowImages.length === 0 ? (
                <p className={styles.noImages}>No slideshow images added yet.</p>
              ) : (
                slideshowImages.map((img) => (
                  <div key={img.id} className={styles.imageItem}>
                    <span className={styles.imageUrl}>{img.imageUrl}</span>
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveImage(img.id)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <div className={styles.editorActions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// New Modal Components for Database Types

function CompanyModalDB({
  company,
  isNew,
  onSave,
  onClose,
}: {
  company: DBCompany;
  isNew: boolean;
  onSave: (company: DBCompany) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<DBCompany>(company);
  const [specialtiesInput, setSpecialtiesInput] = useState(company.specialties || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      specialties: specialtiesInput,
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{isNew ? 'Add Company' : 'Edit Company'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Company Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>City</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>State</label>
                <select
                  className={styles.formSelect}
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone</label>
                <input
                  type="tel"
                  className={styles.formInput}
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tier</label>
                <select
                  className={styles.formSelect}
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                >
                  <option value="Basic">Basic</option>
                  <option value="Verified">Verified</option>
                  <option value="Featured">Featured</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Coverage Radius (miles)</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={formData.coverageRadius ?? ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setFormData({ ...formData, coverageRadius: isNaN(val) ? null : val });
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  className={styles.formInput}
                  value={formData.latitude ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFormData({ ...formData, latitude: isNaN(val) ? null : val });
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  className={styles.formInput}
                  value={formData.longitude ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFormData({ ...formData, longitude: isNaN(val) ? null : val });
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <input
                    type="checkbox"
                    checked={formData.unionAffiliated}
                    onChange={(e) => setFormData({ ...formData, unionAffiliated: e.target.checked })}
                  />{' '}
                  Union Affiliated
                </label>
              </div>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Service Specialties (comma-separated)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={specialtiesInput}
                  onChange={(e) => setSpecialtiesInput(e.target.value)}
                  placeholder="Hydro Excavation, Daylighting, Potholing"
                />
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>
              {isNew ? 'Add Company' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FacilityModalDB({
  facility,
  isNew,
  onSave,
  onClose,
}: {
  facility: DBDisposalFacility;
  isNew: boolean;
  onSave: (facility: DBDisposalFacility) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<DBDisposalFacility>(facility);
  const [materialsInput, setMaterialsInput] = useState(facility.materialsAccepted || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      materialsAccepted: materialsInput,
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{isNew ? 'Add Facility' : 'Edit Facility'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Facility Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Address</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>City</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>State</label>
                <select
                  className={styles.formSelect}
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone</label>
                <input
                  type="tel"
                  className={styles.formInput}
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hours</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.hours || ''}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="Mon-Fri: 6AM-5PM"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  className={styles.formInput}
                  value={formData.latitude ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFormData({ ...formData, latitude: isNaN(val) ? null : val });
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  className={styles.formInput}
                  value={formData.longitude ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFormData({ ...formData, longitude: isNaN(val) ? null : val });
                  }}
                />
              </div>
              <div className={styles.formGroupFull}>
                <label className={styles.formLabel}>Materials Accepted (comma-separated)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={materialsInput}
                  onChange={(e) => setMaterialsInput(e.target.value)}
                  placeholder="Drilling Mud, Industrial Waste, Contaminated Soil"
                />
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>
              {isNew ? 'Add Facility' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
