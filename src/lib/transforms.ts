/**
 * Shared utility functions and types for transforming database models
 * to frontend types.
 */

import { HydroVacCompany, DisposalFacility } from '@/types';

// Database company type from API
export interface DBCompany {
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
export interface DBDisposalFacility {
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

/**
 * Transform database company to frontend type
 * @param dbCompany Company from the database API
 * @returns HydroVacCompany or null if missing required coordinates
 */
export function transformCompany(dbCompany: DBCompany): HydroVacCompany | null {
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
    serviceSpecialties: dbCompany.specialties 
      ? dbCompany.specialties.split(',').map(s => s.trim()) 
      : ['Hydro Excavation'],
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

/**
 * Transform database facility to frontend type
 * @param dbFacility Facility from the database API
 * @returns DisposalFacility or null if missing required coordinates
 */
export function transformFacility(dbFacility: DBDisposalFacility): DisposalFacility | null {
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
    materialsAccepted: dbFacility.materialsAccepted 
      ? dbFacility.materialsAccepted.split(',').map(s => s.trim()) 
      : [],
    hours: dbFacility.hours || '',
    phone: dbFacility.phone || '',
    tier: 'verified',
    latitude: dbFacility.latitude,
    longitude: dbFacility.longitude,
    clicks: 0,
  };
}
