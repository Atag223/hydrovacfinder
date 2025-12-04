'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MapSection from '@/components/MapSection';
import Listings from '@/components/Listings';
import Footer from '@/components/Footer';
import { FilterType, SearchLocation, SearchRadius, calculateDistanceMiles, HydroVacCompany, DisposalFacility } from '@/types';

// Extend types with distance for sorting
interface CompanyWithDistance extends HydroVacCompany {
  distance?: number;
}

interface FacilityWithDistance extends DisposalFacility {
  distance?: number;
}

// Database company type from API
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
}

// Database disposal facility type from API
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

// Transform database company to frontend type
function transformCompany(dbCompany: DBCompany): HydroVacCompany | null {
  // Skip companies without valid coordinates
  if (dbCompany.latitude === null || dbCompany.longitude === null) {
    return null;
  }

  return {
    id: String(dbCompany.id),
    name: dbCompany.name,
    city: dbCompany.city,
    state: dbCompany.state,
    phone: dbCompany.phone || '',
    website: dbCompany.website || '',
    serviceSpecialties: dbCompany.specialties ? dbCompany.specialties.split(',').map(s => s.trim()) : ['Hydro Excavation'],
    coverageRadius: dbCompany.coverageRadius || 100,
    unionAffiliation: dbCompany.unionAffiliated,
    tier: dbCompany.tier.toLowerCase() as HydroVacCompany['tier'],
    latitude: dbCompany.latitude,
    longitude: dbCompany.longitude,
    profileViews: 0,
    clickToCalls: 0,
    websiteClicks: 0,
    directionRequests: 0,
  };
}

// Transform database facility to frontend type
function transformFacility(dbFacility: DBDisposalFacility): DisposalFacility | null {
  // Skip facilities without valid coordinates
  if (dbFacility.latitude === null || dbFacility.longitude === null) {
    return null;
  }

  return {
    id: String(dbFacility.id),
    name: dbFacility.name,
    address: dbFacility.address || '',
    city: dbFacility.city || '',
    state: dbFacility.state || '',
    materialsAccepted: dbFacility.materialsAccepted ? dbFacility.materialsAccepted.split(',').map(s => s.trim()) : [],
    hours: dbFacility.hours || '',
    phone: dbFacility.phone || '',
    tier: 'verified',
    latitude: dbFacility.latitude,
    longitude: dbFacility.longitude,
    clicks: 0,
  };
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
  const [searchRadius, setSearchRadius] = useState<SearchRadius>(50);
  const [companies, setCompanies] = useState<HydroVacCompany[]>([]);
  const [facilities, setFacilities] = useState<DisposalFacility[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [companiesRes, facilitiesRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/disposals'),
        ]);

        if (companiesRes.ok) {
          const dbCompanies: DBCompany[] = await companiesRes.json();
          const transformedCompanies = dbCompanies
            .map(transformCompany)
            .filter((c): c is HydroVacCompany => c !== null);
          setCompanies(transformedCompanies);
        }

        if (facilitiesRes.ok) {
          const dbFacilities: DBDisposalFacility[] = await facilitiesRes.json();
          const transformedFacilities = dbFacilities
            .map(transformFacility)
            .filter((f): f is DisposalFacility => f !== null);
          setFacilities(transformedFacilities);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearchLocationChange = useCallback((location: SearchLocation | null, radius: SearchRadius) => {
    setSearchLocation(location);
    setSearchRadius(radius);
  }, []);

  // Filter and sort companies by distance from search location
  const filteredCompanies = useMemo<CompanyWithDistance[]>(() => {
    if (!searchLocation) {
      return companies;
    }

    return companies
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
  }, [companies, searchLocation, searchRadius]);

  // Filter and sort facilities by distance from search location
  const filteredFacilities = useMemo<FacilityWithDistance[]>(() => {
    if (!searchLocation) {
      return facilities;
    }

    return facilities
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
  }, [facilities, searchLocation, searchRadius]);

  if (loading) {
    return (
      <>
        <Navigation isAdmin={true} />
        <main>
          <Hero />
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading companies and facilities...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
