'use client';

import { useState } from 'react';
import { HydroVacCompany, DisposalFacility, FilterType, HYDROVAC_PIN_COLORS, DISPOSAL_PIN_COLOR } from '@/types';
import styles from './GoogleMap.module.css';

interface GoogleMapProps {
  companies: HydroVacCompany[];
  facilities: DisposalFacility[];
  activeFilter: FilterType;
}

// Convert lat/lng to x/y position on the map (approximate US bounds)
function latLngToPosition(lat: number, lng: number): { x: number; y: number } {
  // US bounds approximately: lat 24-50, lng -125 to -66
  const minLat = 24;
  const maxLat = 50;
  const minLng = -125;
  const maxLng = -66;
  
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

interface TooltipData {
  type: 'company' | 'facility';
  name: string;
  location: string;
  phone: string;
  details: string;
  website?: string;
  address?: string;
  tier: string;
}

export default function GoogleMap({ 
  companies, 
  facilities, 
  activeFilter,
}: GoogleMapProps) {
  const [hoveredItem, setHoveredItem] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (data: TooltipData, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.closest(`.${styles.mapContainer}`)?.getBoundingClientRect();
    if (parentRect) {
      setTooltipPosition({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top
      });
    }
    setHoveredItem(data);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const filteredCompanies = activeFilter === 'disposal' ? [] : companies;
  const filteredFacilities = activeFilter === 'hydrovac' ? [] : facilities;

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapWrapper}>
        {/* US Map Background */}
        <div className={styles.mapBackground}>
          <svg viewBox="0 0 960 600" className={styles.usSvg}>
            {/* Simplified US outline */}
            <path
              d="M158 453 L165 428 L190 405 L230 395 L280 380 L310 365 L345 355 L380 340 L420 330 L460 325 L500 315 L540 305 L580 300 L620 295 L660 290 L700 288 L740 290 L780 295 L820 305 L850 320 L870 340 L885 365 L890 390 L885 420 L870 450 L845 475 L810 495 L770 510 L725 520 L680 525 L635 528 L590 530 L545 528 L500 525 L455 520 L410 515 L365 508 L320 500 L280 490 L245 478 L210 468 L175 460 Z M730 150 L755 140 L785 145 L810 165 L825 195 L830 230 L822 265 L805 295 L780 318 L750 335 L715 345 L680 348 L645 345 L615 335 L590 318 L572 295 L562 265 L560 230 L568 195 L585 165 L612 145 L645 138 L680 140 L710 148 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            {/* State boundaries simplified */}
            <path
              d="M300 450 L300 380 L400 380 L400 450 M400 380 L500 380 L500 450 L400 450 M500 380 L600 380 L600 450 L500 450 M300 380 L300 300 L400 300 L400 380 M400 300 L500 300 L500 380 M500 300 L600 300 L600 380 M600 300 L700 300 L700 380 L600 380 M300 300 L300 220 L400 220 L400 300 M400 220 L500 220 L500 300 M500 220 L600 220 L600 300 M600 220 L700 220 L700 300"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        </div>
        
        {/* Pins Container */}
        <div className={styles.pinsContainer}>
          {/* Company Pins */}
          {filteredCompanies.map((company) => {
            const pos = latLngToPosition(company.latitude, company.longitude);
            return (
              <div
                key={company.id}
                className={styles.pin}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  backgroundColor: HYDROVAC_PIN_COLORS[company.tier],
                }}
                onMouseEnter={(e) => handleMouseEnter({
                  type: 'company',
                  name: company.name,
                  location: `${company.city}, ${company.state}`,
                  phone: company.phone,
                  details: company.serviceSpecialties.slice(0, 2).join(', '),
                  website: company.website,
                  tier: company.tier,
                }, e)}
                onMouseLeave={handleMouseLeave}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.pinIcon}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            );
          })}
          
          {/* Facility Pins */}
          {filteredFacilities.map((facility) => {
            const pos = latLngToPosition(facility.latitude, facility.longitude);
            return (
              <div
                key={facility.id}
                className={`${styles.pin} ${styles.facilityPin}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  backgroundColor: DISPOSAL_PIN_COLOR,
                }}
                onMouseEnter={(e) => handleMouseEnter({
                  type: 'facility',
                  name: facility.name,
                  location: `${facility.city}, ${facility.state}`,
                  phone: facility.phone,
                  details: facility.hours,
                  address: facility.address,
                  tier: 'verified',
                }, e)}
                onMouseLeave={handleMouseLeave}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.pinIcon}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {hoveredItem && (
          <div 
            className={styles.tooltip}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y - 10}px`,
            }}
          >
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipName}>{hoveredItem.name}</span>
              <span 
                className={styles.tooltipTier}
                style={{ 
                  backgroundColor: hoveredItem.type === 'company' 
                    ? HYDROVAC_PIN_COLORS[hoveredItem.tier as keyof typeof HYDROVAC_PIN_COLORS] 
                    : DISPOSAL_PIN_COLOR 
                }}
              >
                {hoveredItem.tier}
              </span>
            </div>
            <div className={styles.tooltipLocation}>{hoveredItem.location}</div>
            <div className={styles.tooltipPhone}>{hoveredItem.phone}</div>
            <div className={styles.tooltipDetails}>{hoveredItem.details}</div>
            <div className={styles.tooltipActions}>
              <a href={`tel:${hoveredItem.phone.replace(/\D/g, '')}`} className={styles.tooltipBtn}>
                Call Now
              </a>
              {hoveredItem.website && (
                <a href={hoveredItem.website} target="_blank" rel="noopener noreferrer" className={styles.tooltipBtnSecondary}>
                  Website
                </a>
              )}
              {hoveredItem.address && (
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hoveredItem.address}, ${hoveredItem.location}`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.tooltipBtnSecondary}
                >
                  Directions
                </a>
              )}
            </div>
          </div>
        )}

        {/* Map Info */}
        <div className={styles.mapInfo}>
          <span>{filteredCompanies.length + filteredFacilities.length} locations shown</span>
        </div>
      </div>
    </div>
  );
}
