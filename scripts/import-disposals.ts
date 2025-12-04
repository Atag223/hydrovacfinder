import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("📥 Importing disposal facilities...");

  const filePath = path.join(process.cwd(), "src/data/disposal_sites.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const disposals = JSON.parse(raw);

  let imported = 0;
  let skipped = 0;

  for (const d of disposals) {
    try {
      const existing = await prisma.disposalFacility.findFirst({
        where: {
          name: d.name,
          city: d.city,
          state: d.state,
        },
      });

      if (existing) {
        skipped++;
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

      imported++;
    } catch (err) {
      console.error("❌ Error importing disposal:", d, err);
    }
  }

  console.log(`✅ Disposal import complete: ${imported} inserted, ${skipped} skipped`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
