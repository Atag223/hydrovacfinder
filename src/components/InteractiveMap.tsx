'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HydroVacCompany, DisposalFacility, FilterType, HYDROVAC_PIN_COLORS, DISPOSAL_PIN_COLOR } from '@/types';
import styles from './InteractiveMap.module.css';

// Public access token for demo purposes - in production, use environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoiaHlkcm92YWNmaW5kZXIiLCJhIjoiY200c2RnNmRuMDAydjJrc2QyNWZ0Nmp4aiJ9.HKQhJlTLTcwDTH-RtU0-jQ';

interface InteractiveMapProps {
  companies: HydroVacCompany[];
  facilities: DisposalFacility[];
  activeFilter: FilterType;
  searchQuery: string;
  onSearchComplete?: () => void;
}

interface SelectedItem {
  type: 'company' | 'facility';
  data: HydroVacCompany | DisposalFacility;
}

export default function InteractiveMap({
  companies,
  facilities,
  activeFilter,
  searchQuery,
  onSearchComplete,
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3.5,
      minZoom: 2,
      maxZoom: 18,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    // Close popup when clicking on the map
    map.current.on('click', (e) => {
      const target = e.originalEvent.target as HTMLElement;
      if (!target.closest(`.${styles.marker}`)) {
        setSelectedItem(null);
        setPopupPosition(null);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Create marker element
  const createMarkerElement = useCallback((
    color: string,
    type: 'company' | 'facility',
    item: HydroVacCompany | DisposalFacility
  ) => {
    const el = document.createElement('div');
    el.className = styles.marker;
    el.style.backgroundColor = color;
    
    if (type === 'facility') {
      el.classList.add(styles.facilityMarker);
    }

    el.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" class="${styles.markerIcon}">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = el.getBoundingClientRect();
      const containerRect = mapContainer.current?.getBoundingClientRect();
      
      if (containerRect) {
        setPopupPosition({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top,
        });
      }
      
      setSelectedItem({ type, data: item });
    });

    return el;
  }, []);

  // Update markers when filter changes or map loads
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter data based on active filter
    const filteredCompanies = activeFilter === 'disposal' ? [] : companies;
    const filteredFacilities = activeFilter === 'hydrovac' ? [] : facilities;

    // Add company markers
    filteredCompanies.forEach((company) => {
      const color = HYDROVAC_PIN_COLORS[company.tier];
      const el = createMarkerElement(color, 'company', company);
      
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([company.longitude, company.latitude])
        .addTo(map.current!);
      
      markersRef.current.push(marker);
    });

    // Add facility markers
    filteredFacilities.forEach((facility) => {
      const el = createMarkerElement(DISPOSAL_PIN_COLOR, 'facility', facility);
      
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([facility.longitude, facility.latitude])
        .addTo(map.current!);
      
      markersRef.current.push(marker);
    });
  }, [companies, facilities, activeFilter, isMapLoaded, createMarkerElement]);

  // Handle search
  useEffect(() => {
    if (!map.current || !searchQuery || !isMapLoaded) return;

    // Use Mapbox Geocoding API to search for the location
    const geocodeSearch = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?country=us&access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          
          map.current?.flyTo({
            center: [lng, lat],
            zoom: 10,
            essential: true,
          });

          setSelectedItem(null);
          setPopupPosition(null);
        }
        
        onSearchComplete?.();
      } catch (error) {
        console.error('Geocoding error:', error);
        onSearchComplete?.();
      }
    };

    geocodeSearch();
  }, [searchQuery, isMapLoaded, onSearchComplete]);

  // Get tier label for display
  const getTierLabel = (tier: string) => {
    const labels: Record<string, string> = {
      basic: 'Basic',
      verified: 'Verified',
      featured: 'Featured',
      premium: 'Premium',
    };
    return labels[tier] || tier;
  };

  // Get tier color
  const getTierColor = (type: 'company' | 'facility', tier: string) => {
    if (type === 'facility') return DISPOSAL_PIN_COLOR;
    return HYDROVAC_PIN_COLORS[tier as keyof typeof HYDROVAC_PIN_COLORS] || '#9CA3AF';
  };

  const filteredCompanies = activeFilter === 'disposal' ? [] : companies;
  const filteredFacilities = activeFilter === 'hydrovac' ? [] : facilities;
  const totalLocations = filteredCompanies.length + filteredFacilities.length;

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} className={styles.map} />
      
      {!isMapLoaded && (
        <div className={styles.loading}>
          <span>Loading map...</span>
        </div>
      )}

      {/* Detail Card Popup */}
      {selectedItem && popupPosition && (
        <div
          className={styles.detailCard}
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y - 10}px`,
          }}
        >
          <button
            className={styles.closeBtn}
            onClick={() => {
              setSelectedItem(null);
              setPopupPosition(null);
            }}
            aria-label="Close"
          >
            &times;
          </button>
          
          <div className={styles.cardHeader}>
            <span className={styles.cardName}>
              {selectedItem.type === 'company'
                ? (selectedItem.data as HydroVacCompany).name
                : (selectedItem.data as DisposalFacility).name}
            </span>
            <span
              className={styles.cardTier}
              style={{
                backgroundColor: getTierColor(
                  selectedItem.type,
                  selectedItem.type === 'company'
                    ? (selectedItem.data as HydroVacCompany).tier
                    : 'verified'
                ),
              }}
            >
              {selectedItem.type === 'company'
                ? getTierLabel((selectedItem.data as HydroVacCompany).tier)
                : 'Disposal'}
            </span>
          </div>
          
          <div className={styles.cardLocation}>
            {selectedItem.type === 'company'
              ? `${(selectedItem.data as HydroVacCompany).city}, ${(selectedItem.data as HydroVacCompany).state}`
              : `${(selectedItem.data as DisposalFacility).city}, ${(selectedItem.data as DisposalFacility).state}`}
          </div>
          
          <div className={styles.cardPhone}>
            {selectedItem.type === 'company'
              ? (selectedItem.data as HydroVacCompany).phone
              : (selectedItem.data as DisposalFacility).phone}
          </div>
          
          {selectedItem.type === 'company' && (
            <div className={styles.cardDetails}>
              {(selectedItem.data as HydroVacCompany).serviceSpecialties.slice(0, 2).join(', ')}
            </div>
          )}
          
          {selectedItem.type === 'facility' && (
            <div className={styles.cardDetails}>
              {(selectedItem.data as DisposalFacility).hours}
            </div>
          )}
          
          <div className={styles.cardActions}>
            <a
              href={`tel:${(selectedItem.type === 'company'
                ? (selectedItem.data as HydroVacCompany).phone
                : (selectedItem.data as DisposalFacility).phone
              ).replace(/\D/g, '')}`}
              className={styles.cardBtnPrimary}
            >
              Call Now
            </a>
            
            {selectedItem.type === 'company' && (selectedItem.data as HydroVacCompany).website && (
              <a
                href={(selectedItem.data as HydroVacCompany).website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardBtnSecondary}
              >
                Website
              </a>
            )}
            
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                selectedItem.type === 'company'
                  ? `${(selectedItem.data as HydroVacCompany).city}, ${(selectedItem.data as HydroVacCompany).state}`
                  : `${(selectedItem.data as DisposalFacility).address}, ${(selectedItem.data as DisposalFacility).city}, ${(selectedItem.data as DisposalFacility).state}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardBtnSecondary}
            >
              Directions
            </a>
          </div>
        </div>
      )}

      {/* Map Info */}
      <div className={styles.mapInfo}>
        <span>{totalLocations} locations shown</span>
      </div>
    </div>
  );
}
