import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "change-me-now";
  const password = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password },
    create: { email: adminEmail, password },
  });

  const employees = [
    {
      name: "Ada Lovelace",
      email: "ada.lovelace@example.com",
      post: "Software Engineer",
      department: "Engineering",
      salary: 85000,
    },
    {
      name: "Alan Turing",
      email: "alan.turing@example.com",
      post: "Engineering Manager",
      department: "Engineering",
      salary: 105000,
    },
  ];

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { email: employee.email },
      update: employee,
      create: employee,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
