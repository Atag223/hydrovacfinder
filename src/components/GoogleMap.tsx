'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { HydroVacCompany, DisposalFacility, FilterType, HYDROVAC_PIN_COLORS, DISPOSAL_PIN_COLOR } from '@/types';
import styles from './GoogleMap.module.css';

interface GoogleMapProps {
  companies: HydroVacCompany[];
  facilities: DisposalFacility[];
  activeFilter: FilterType;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function GoogleMap({ 
  companies, 
  facilities, 
  activeFilter,
  center = { lat: 39.8283, lng: -98.5795 }, // Center of US
  zoom = 4
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update markers function
  const updateMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof window === 'undefined' || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add company markers
    if (activeFilter === 'all' || activeFilter === 'hydrovac') {
      companies.forEach(company => {
        const marker = new window.google.maps.Marker({
          position: { lat: company.latitude, lng: company.longitude },
          map,
          title: company.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: HYDROVAC_PIN_COLORS[company.tier],
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px;">${company.name}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${company.city}, ${company.state}</p>
              <p style="margin: 0 0 8px 0; font-size: 12px;">${company.phone}</p>
              <a href="tel:${company.phone.replace(/\D/g, '')}" style="display: inline-block; padding: 6px 12px; background: #22c55e; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; margin-right: 8px;">Call Now</a>
              <a href="${company.website}" target="_blank" style="display: inline-block; padding: 6px 12px; background: #1e40af; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">Website</a>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }

    // Add facility markers
    if (activeFilter === 'all' || activeFilter === 'disposal') {
      facilities.forEach(facility => {
        const marker = new window.google.maps.Marker({
          position: { lat: facility.latitude, lng: facility.longitude },
          map,
          title: facility.name,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 8,
            fillColor: DISPOSAL_PIN_COLOR,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 280px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px;">${facility.name}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${facility.address}, ${facility.city}, ${facility.state}</p>
              <p style="margin: 0 0 4px 0; font-size: 12px;">${facility.hours}</p>
              <p style="margin: 0 0 8px 0; font-size: 12px;">${facility.phone}</p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${facility.address}, ${facility.city}, ${facility.state}`)}" target="_blank" style="display: inline-block; padding: 6px 12px; background: #1e40af; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">Get Directions</a>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }
  }, [companies, facilities, activeFilter]);

  // Load Google Maps script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return;
    }

    // Check if Google Maps is already loaded
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGoogleMaps()) return;

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;
    if (typeof window === 'undefined' || !window.google) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = newMap;
    updateMarkers();
  }, [isLoaded, center, zoom, updateMarkers]);

  // Update markers when filter changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [activeFilter, updateMarkers]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={styles.mapPlaceholder}>
        <div className={styles.mapOverlay}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p>Interactive Map</p>
          <span>United States & Canada Coverage</span>
          <small>Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable Google Maps</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapRef} className={styles.map} />
      {!isLoaded && (
        <div className={styles.loading}>
          <span>Loading map...</span>
        </div>
      )}
    </div>
  );
}
