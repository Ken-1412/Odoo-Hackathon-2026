import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Generating 1,000+ records...');

  // 1. Setup Base Data
  const depts = ['IT', 'HR', 'Finance', 'Engineering', 'Sales'];
  const cats = ['Laptops', 'Monitors', 'Furniture', 'Vehicles', 'Network Gear'];

  // Create Departments and Categories
  for (const name of depts) await prisma.department.create({ data: { name } });
  for (const name of cats) await prisma.assetCategory.create({ data: { name } });

  const allDepts = await prisma.department.findMany();
  const allCats = await prisma.assetCategory.findMany();

  // 2. Generate 800 Users
  const userPromises = Array.from({ length: 800 }).map(() => 
    prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        departmentId: faker.helpers.arrayElement(allDepts).id,
      },
    })
  );
  await Promise.all(userPromises);
  console.log('✅ Created 800 Users');

  // 3. Generate 400 Assets
  const assetPromises = Array.from({ length: 400 }).map(() => 
    prisma.asset.create({
      data: {
        name: faker.commerce.productName(),
        categoryId: faker.helpers.arrayElement(allCats).id,
        departmentId: faker.helpers.arrayElement(allDepts).id,
      },
    })
  );
  await Promise.all(assetPromises);
  console.log('✅ Created 400 Assets');

  console.log('🚀 Seeding finished successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());