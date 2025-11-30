'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MapSection from '@/components/MapSection';
import Listings from '@/components/Listings';
import Footer from '@/components/Footer';
import { FilterType } from '@/types';
import { hydroVacCompanies, disposalFacilities } from '@/data/companyData';

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
          companies={hydroVacCompanies}
          facilities={disposalFacilities}
        />
        <Listings 
          companies={hydroVacCompanies} 
          facilities={disposalFacilities} 
          activeFilter={activeFilter}
        />
      </main>
      <Footer />
    </>
  );
}
