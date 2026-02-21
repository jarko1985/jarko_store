import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const countries = require("../src/data/countries.json") as {
  name: string;
  code: string;
}[];

async function main() {
  console.log("Seeding countries...");
  for (const country of countries) {
    await prisma.country.upsert({
      where: { name: country.name },
      create: {
        name: country.name,
        code: country.code,
      },
      update: {
        name: country.name,
        code: country.code,
      },
    });
  }
  console.log("Countries seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
