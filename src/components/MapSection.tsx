'use client';

import { useState } from 'react';
import { SearchRadius, FilterType } from '@/types';
import styles from './MapSection.module.css';

interface MapSectionProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function MapSection({ activeFilter, onFilterChange }: MapSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRadius, setSearchRadius] = useState<SearchRadius>(50);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchQuery(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
          alert('Unable to get your location. Please enter a location manually.');
        }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    console.log('Searching for:', searchQuery, 'within', searchRadius, 'miles');
  };

  return (
    <section id="map-section" className={styles.mapSection}>
      <div className={styles.container}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by city, zip code, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <button
              type="button"
              onClick={handleUseLocation}
              className={styles.locationBtn}
              disabled={isLocating}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
              </svg>
              {isLocating ? 'Locating...' : 'Use My Location'}
            </button>

            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value) as SearchRadius)}
              className={styles.radiusSelect}
            >
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
              <option value={75}>75 miles</option>
              <option value={100}>100+ miles</option>
            </select>

            <button type="submit" className={styles.searchBtn}>
              Search
            </button>
          </form>
        </div>

        {/* Map Legend */}
        <div className={styles.legendContainer}>
          <div className={styles.legend}>
            <span className={styles.legendTitle}>Hydro-Vac Companies:</span>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <span className={`${styles.pin} ${styles.pinGray}`}></span>
                <span>Basic</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.pin} ${styles.pinBlue}`}></span>
                <span>Verified</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.pin} ${styles.pinGreen}`}></span>
                <span>Featured</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.pin} ${styles.pinGold}`}></span>
                <span>Premium</span>
              </div>
            </div>
          </div>
          <div className={styles.legend}>
            <span className={styles.legendTitle}>Disposal Facilities:</span>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <span className={`${styles.pin} ${styles.pinGreen}`}></span>
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Placeholder */}
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapOverlay}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p>Interactive Map</p>
              <span>United States & Canada Coverage</span>
              <small>Map integration with Leaflet or Google Maps would be implemented here</small>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All Companies Nationwide
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'hydrovac' ? styles.active : ''}`}
            onClick={() => onFilterChange('hydrovac')}
          >
            Hydro-Vac Companies Only
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'disposal' ? styles.active : ''}`}
            onClick={() => onFilterChange('disposal')}
          >
            Disposal Facilities Only
          </button>
        </div>
      </div>
    </section>
  );
}
