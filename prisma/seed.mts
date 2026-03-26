import "dotenv/config"
import bcrypt from "bcryptjs"
// @ts-ignore - works with node --experimental-strip-types
import { PrismaClient } from "../src/generated/prisma/client.ts"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  const hashedPassword = await bcrypt.hash("123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@tk.com" },
    update: {},
    create: {
      name: "Admin Utama",
      email: "admin@tk.com",
      password: hashedPassword,
      role: "admin",
    },
  })
  console.log(`✅ Admin: ${admin.email}`)

  const teacher = await prisma.user.upsert({
    where: { email: "guru@tk.com" },
    update: {},
    create: {
      name: "Siti Nurhaliza",
      email: "guru@tk.com",
      password: hashedPassword,
      role: "teacher",
    },
  })
  console.log(`✅ Guru: ${teacher.email}`)

  console.log("🎉 Seeding selesai!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
