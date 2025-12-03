'use client';

import { useState, useMemo, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MapSection from '@/components/MapSection';
import Listings from '@/components/Listings';
import Footer from '@/components/Footer';
import { FilterType, SearchLocation, SearchRadius, calculateDistanceMiles, HydroVacCompany, DisposalFacility } from '@/types';
import { hydroVacCompanies, disposalFacilities } from '@/data/companyData';

// Extend types with distance for sorting
interface CompanyWithDistance extends HydroVacCompany {
  distance?: number;
}

interface FacilityWithDistance extends DisposalFacility {
  distance?: number;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
  const [searchRadius, setSearchRadius] = useState<SearchRadius>(50);

  const handleSearchLocationChange = useCallback((location: SearchLocation | null, radius: SearchRadius) => {
    setSearchLocation(location);
    setSearchRadius(radius);
  }, []);

  // Filter and sort companies by distance from search location
  const filteredCompanies = useMemo<CompanyWithDistance[]>(() => {
    if (!searchLocation) {
      return hydroVacCompanies;
    }

    return hydroVacCompanies
      .map((company) => {
        const distance = calculateDistanceMiles(
          searchLocation.latitude,
          searchLocation.longitude,
          company.latitude,
          company.longitude
        );
        return { ...company, distance };
      })
      .filter((company) => company.distance! <= searchRadius)
      .sort((a, b) => a.distance! - b.distance!);
  }, [searchLocation, searchRadius]);

  // Filter and sort facilities by distance from search location
  const filteredFacilities = useMemo<FacilityWithDistance[]>(() => {
    if (!searchLocation) {
      return disposalFacilities;
    }

    return disposalFacilities
      .map((facility) => {
        const distance = calculateDistanceMiles(
          searchLocation.latitude,
          searchLocation.longitude,
          facility.latitude,
          facility.longitude
        );
        return { ...facility, distance };
      })
      .filter((facility) => facility.distance! <= searchRadius)
      .sort((a, b) => a.distance! - b.distance!);
  }, [searchLocation, searchRadius]);

  return (
    <>
      <Navigation isAdmin={true} />
      <main>
        <Hero />
        <MapSection 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          companies={filteredCompanies}
          facilities={filteredFacilities}
          onSearchLocationChange={handleSearchLocationChange}
        />
        <Listings 
          companies={filteredCompanies} 
          facilities={filteredFacilities} 
          activeFilter={activeFilter}
          searchLocation={searchLocation}
        />
      </main>
      <Footer />
    </>
  );
}
