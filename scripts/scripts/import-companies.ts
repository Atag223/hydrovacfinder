import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("📥 Importing companies...");

  const filePath = path.join(process.cwd(), "src/data/companies_export.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const companies = JSON.parse(raw);

  let imported = 0;
  let skipped = 0;

  for (const c of companies) {
    try {
      const existing = await prisma.company.findFirst({
        where: {
          name: c.name,
          city: c.city,
          state: c.state,
        },
      });

      if (existing) {
        skipped++;
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

      imported++;
    } catch (err) {
      console.error("❌ Error importing company:", c, err);
    }
  }

  console.log(`✅ Company import complete: ${imported} inserted, ${skipped} skipped`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
