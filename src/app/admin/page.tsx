'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import styles from './page.module.css';
import { hydroVacCompanies, disposalFacilities } from '@/data/companyData';
import { DateFilter, HydroVacTier, HydroVacCompany, DisposalFacility, US_STATES } from '@/types';

type AdminTab = 'companies' | 'facilities' | 'analytics' | 'content';
type ContentSection = 'state-pages' | 'slideshows' | 'pricing' | 'homepage' | null;

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
  const [companies, setCompanies] = useState<HydroVacCompany[]>(hydroVacCompanies);
  const [editingCompany, setEditingCompany] = useState<HydroVacCompany | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<HydroVacCompany | null>(null);
  const [isAddingCompany, setIsAddingCompany] = useState(false);

  const handleSaveCompany = (company: HydroVacCompany) => {
    if (isAddingCompany) {
      setCompanies([...companies, { ...company, id: `company-${Date.now()}` }]);
    } else {
      setCompanies(companies.map(c => c.id === company.id ? company : c));
    }
    setEditingCompany(null);
    setIsAddingCompany(false);
  };

  const handleDeleteCompany = (company: HydroVacCompany) => {
    setCompanies(companies.filter(c => c.id !== company.id));
    setDeletingCompany(null);
  };

  const handleAddClick = () => {
    setIsAddingCompany(true);
    setEditingCompany({
      id: '',
      name: '',
      city: '',
      state: '',
      phone: '',
      website: '',
      serviceSpecialties: [],
      coverageRadius: 100,
      unionAffiliation: false,
      tier: 'basic',
      latitude: 0,
      longitude: 0,
      profileViews: 0,
      clickToCalls: 0,
      websiteClicks: 0,
      directionRequests: 0,
    });
  };

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
                  <TierBadge tier={company.tier} />
                </td>
                <td>{company.unionAffiliation ? `Yes - ${company.unionLocalNumber}` : 'No'}</td>
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
        <CompanyModal
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
  const [facilities, setFacilities] = useState<DisposalFacility[]>(disposalFacilities);
  const [editingFacility, setEditingFacility] = useState<DisposalFacility | null>(null);
  const [deletingFacility, setDeletingFacility] = useState<DisposalFacility | null>(null);
  const [managingImages, setManagingImages] = useState<DisposalFacility | null>(null);
  const [isAddingFacility, setIsAddingFacility] = useState(false);

  const handleSaveFacility = (facility: DisposalFacility) => {
    if (isAddingFacility) {
      setFacilities([...facilities, { ...facility, id: `facility-${Date.now()}` }]);
    } else {
      setFacilities(facilities.map(f => f.id === facility.id ? facility : f));
    }
    setEditingFacility(null);
    setIsAddingFacility(false);
  };

  const handleDeleteFacility = (facility: DisposalFacility) => {
    setFacilities(facilities.filter(f => f.id !== facility.id));
    setDeletingFacility(null);
  };

  const handleSaveImages = (facility: DisposalFacility, images: string[]) => {
    setFacilities(facilities.map(f => f.id === facility.id ? { ...f, images } : f));
    setManagingImages(null);
  };

  const handleAddClick = () => {
    setIsAddingFacility(true);
    setEditingFacility({
      id: '',
      name: '',
      address: '',
      city: '',
      state: '',
      materialsAccepted: [],
      hours: '',
      phone: '',
      tier: 'verified',
      latitude: 0,
      longitude: 0,
      clicks: 0,
    });
  };

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
                    <button className={styles.imageBtn} onClick={() => setManagingImages(facility)}>Images</button>
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
        <FacilityModal
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

      {/* Images Management Modal */}
      {managingImages && (
        <ImagesModal
          facility={managingImages}
          onSave={(images) => handleSaveImages(managingImages, images)}
          onClose={() => setManagingImages(null)}
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

function CompanyModal({
  company,
  isNew,
  onSave,
  onClose,
}: {
  company: HydroVacCompany;
  isNew: boolean;
  onSave: (company: HydroVacCompany) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<HydroVacCompany>(company);
  const [specialtiesInput, setSpecialtiesInput] = useState(company.serviceSpecialties.join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      serviceSpecialties: specialtiesInput.split(',').map(s => s.trim()).filter(Boolean),
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tier</label>
                <select
                  className={styles.formSelect}
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as HydroVacTier })}
                >
                  <option value="basic">Basic</option>
                  <option value="verified">Verified</option>
                  <option value="featured">Featured</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Coverage Radius (miles)</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={formData.coverageRadius}
                  onChange={(e) => setFormData({ ...formData, coverageRadius: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  className={styles.formInput}
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  className={styles.formInput}
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <input
                    type="checkbox"
                    checked={formData.unionAffiliation}
                    onChange={(e) => setFormData({ ...formData, unionAffiliation: e.target.checked })}
                  />{' '}
                  Union Affiliated
                </label>
              </div>
              {formData.unionAffiliation && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Union Local Number</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.unionLocalNumber || ''}
                    onChange={(e) => setFormData({ ...formData, unionLocalNumber: e.target.value })}
                  />
                </div>
              )}
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

function FacilityModal({
  facility,
  isNew,
  onSave,
  onClose,
}: {
  facility: DisposalFacility;
  isNew: boolean;
  onSave: (facility: DisposalFacility) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<DisposalFacility>(facility);
  const [materialsInput, setMaterialsInput] = useState(facility.materialsAccepted.join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      materialsAccepted: materialsInput.split(',').map(s => s.trim()).filter(Boolean),
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
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hours</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.hours}
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
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  className={styles.formInput}
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
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

function ImagesModal({
  facility,
  onSave,
  onClose,
}: {
  facility: DisposalFacility;
  onSave: (images: string[]) => void;
  onClose: () => void;
}) {
  const [images, setImages] = useState<string[]>(facility.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(images);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Manage Images - {facility.name}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
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
                <p className={styles.noImages}>No images added yet.</p>
              ) : (
                images.map((url, index) => (
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
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>Save Images</button>
          </div>
        </form>
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
  const [headerText, setHeaderText] = useState('');
  const [seoText, setSeoText] = useState('');
  const [saved, setSaved] = useState(false);

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
          onChange={(e) => setSelectedState(e.target.value)}
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
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Choose a state to manage slideshows</option>
          {US_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      {selectedState && (
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
              images.map((url, index) => (
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

function PricingEditor({ onClose }: { onClose: () => void }) {
  const [basicPrice, setBasicPrice] = useState('0');
  const [verifiedPrice, setVerifiedPrice] = useState('99');
  const [featuredPrice, setFeaturedPrice] = useState('199');
  const [premiumPrice, setPremiumPrice] = useState('399');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.editorContent}>
      <h4 className={styles.editorSubtitle}>Monthly Pricing Tiers</h4>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Basic ($/month)</label>
          <input
            type="number"
            className={styles.formInput}
            value={basicPrice}
            onChange={(e) => setBasicPrice(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Verified ($/month)</label>
          <input
            type="number"
            className={styles.formInput}
            value={verifiedPrice}
            onChange={(e) => setVerifiedPrice(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Featured ($/month)</label>
          <input
            type="number"
            className={styles.formInput}
            value={featuredPrice}
            onChange={(e) => setFeaturedPrice(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Premium ($/month)</label>
          <input
            type="number"
            className={styles.formInput}
            value={premiumPrice}
            onChange={(e) => setPremiumPrice(e.target.value)}
          />
        </div>
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
  const [heroTitle, setHeroTitle] = useState('Find Hydro-Vac Services Near You');
  const [heroSubtitle, setHeroSubtitle] = useState('Connect with trusted hydro excavation companies across the nation');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
      <div className={styles.editorActions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
