const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function testWithDatabaseUrl() {
  console.log("\n--- Testing with DATABASE_URL ---");
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  try {
    const users = await prisma.user.findMany();
    console.log("Success with DATABASE_URL! Found users:", users);
  } catch (err) {
    console.error("Error with DATABASE_URL:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

async function main() {
  await testWithDatabaseUrl();
}

main();
