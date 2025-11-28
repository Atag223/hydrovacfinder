'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MapSection from '@/components/MapSection';
import Listings from '@/components/Listings';
import Footer from '@/components/Footer';
import { FilterType } from '@/types';
import { mockHydroVacCompanies, mockDisposalFacilities } from '@/data/mockData';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  return (
    <>
      <Navigation isAdmin={true} />
      <main>
        <Hero />
        <MapSection 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          companies={mockHydroVacCompanies}
          facilities={mockDisposalFacilities}
        />
        <Listings 
          companies={mockHydroVacCompanies} 
          facilities={mockDisposalFacilities} 
          activeFilter={activeFilter}
        />
      </main>
      <Footer />
    </>
  );
}
