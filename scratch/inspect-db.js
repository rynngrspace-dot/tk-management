const dotenv = require("dotenv");
dotenv.config();

const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma");

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const students = await prisma.student.findMany({
    include: {
      class: true,
      parents: true
    }
  });
  console.log("=== STUDENTS ===");
  console.log(JSON.stringify(students, null, 2));
  
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
}

main().catch(console.error);
