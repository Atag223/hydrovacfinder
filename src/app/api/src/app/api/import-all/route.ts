import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import companies from "@/data/companies_export.json";
import disposals from "@/data/disposal_sites.json";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let companiesInserted = 0;
    let companiesSkipped = 0;
    let disposalsInserted = 0;
    let disposalsSkipped = 0;

    // Import Companies
    for (const c of companies as any[]) {
      const existing = await prisma.company.findFirst({
        where: {
          name: c.name,
          city: c.city,
          state: c.state,
        },
      });

      if (existing) {
        companiesSkipped++;
        continue;
      }

      await prisma.company.create({
        data: {
          name: c.name,
          city: c.city,
          state: c.state,
          phone: c.phone || null,
          website: c.website || null,
          tier: c.tier || "Basic",
          coverageRadius: c.coverageRadius || null,
          latitude: c.latitude ? Number(c.latitude) : null,
          longitude: c.longitude ? Number(c.longitude) : null,
          unionAffiliated: c.unionAffiliated || false,
          specialties: c.specialties || null,
          email: c.email || null,
          address: c.address || null,
        },
      });

      companiesInserted++;
    }

    // Import Disposal Facilities
    for (const d of disposals as any[]) {
      const existing = await prisma.disposalFacility.findFirst({
        where: {
          name: d.name,
          city: d.city,
          state: d.state,
        },
      });

      if (existing) {
        disposalsSkipped++;
        continue;
      }

      await prisma.disposalFacility.create({
        data: {
          name: d.name,
          address: d.address || null,
          city: d.city || null,
          state: d.state || null,
          phone: d.phone || null,
          hours: d.hours || null,
          latitude: d.latitude ? Number(d.latitude) : null,
          longitude: d.longitude ? Number(d.longitude) : null,
          materialsAccepted: d.materialsAccepted || null,
        },
      });

      disposalsInserted++;
    }

    return NextResponse.json({
      success: true,
      message: "Import complete",
      companiesInserted,
      companiesSkipped,
      disposalsInserted,
      disposalsSkipped,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Import failed", details: (error as any).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
