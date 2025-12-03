'use client';

import { useState, useCallback } from 'react';
import { SearchRadius, FilterType, HydroVacCompany, DisposalFacility, SearchLocation } from '@/types';
import InteractiveMap from './InteractiveMap';
import styles from './MapSection.module.css';

interface MapSectionProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  companies: HydroVacCompany[];
  facilities: DisposalFacility[];
  onSearchLocationChange?: (location: SearchLocation | null, radius: SearchRadius) => void;
}

export default function MapSection({ activeFilter, onFilterChange, companies, facilities, onSearchLocationChange }: MapSectionProps) {
  const [searchInput, setSearchInput] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [searchRadius, setSearchRadius] = useState<SearchRadius>(50);
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleUseLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          setSearchInput(coords);
          setActiveSearchQuery(coords);
          setIsLocating(false);
          setIsSearching(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
          setLocationError('Unable to get your location. Please enter a location manually.');
        }
      );
    } else {
      setIsLocating(false);
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveSearchQuery(searchInput.trim());
      setIsSearching(true);
    }
  };

  const handleSearchComplete = useCallback((location: SearchLocation | null) => {
    setIsSearching(false);
    setSearchLocation(location);
    onSearchLocationChange?.(location, searchRadius);
  }, [onSearchLocationChange, searchRadius]);

  // Update location filtering when radius changes (if we have a location)
  const handleRadiusChange = useCallback((newRadius: SearchRadius) => {
    setSearchRadius(newRadius);
    if (searchLocation) {
      onSearchLocationChange?.(searchLocation, newRadius);
    }
  }, [searchLocation, onSearchLocationChange]);

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
                placeholder="Search by city, zip code, or state (e.g., Chicago, Illinois)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <button
              type="button"
              onClick={handleUseLocation}
              className={styles.locationBtn}
              disabled={isLocating || isSearching}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
              </svg>
              {isLocating ? 'Locating...' : 'Use My Location'}
            </button>

            <select
              value={searchRadius}
              onChange={(e) => handleRadiusChange(Number(e.target.value) as SearchRadius)}
              className={styles.radiusSelect}
            >
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
              <option value={75}>75 miles</option>
              <option value={100}>100+ miles</option>
            </select>

            <button type="submit" className={styles.searchBtn} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
          {locationError && <p className={styles.errorMessage}>{locationError}</p>}
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
                <span className={`${styles.pin} ${styles.pinRed}`}></span>
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
                <span>Disposal Site</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className={styles.mapContainer}>
          <InteractiveMap 
            companies={companies}
            facilities={facilities}
            activeFilter={activeFilter}
            searchQuery={activeSearchQuery}
            onSearchComplete={handleSearchComplete}
          />
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All Listings
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'hydrovac' ? styles.active : ''}`}
            onClick={() => onFilterChange('hydrovac')}
          >
            HydroVac Companies Only
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
