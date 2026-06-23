const dotenv = require("dotenv");
dotenv.config();

const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  try {
    console.log("Querying ortu@tk.com from database...");
    const user = await prisma.user.findUnique({
      where: { email: "ortu@tk.com" }
    });
    console.log("Result:", user);
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
