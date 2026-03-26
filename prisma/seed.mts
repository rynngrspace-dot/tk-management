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

  // Seed Classes FIRST so we can assign them
  const classA = await prisma.class.upsert({
    where: { id: "A" },
    update: {},
    create: {
      id: "A",
      name: "Kelompok A (Usia 4-5 Tahun)",
    },
  })
  const classB = await prisma.class.upsert({
    where: { id: "B" },
    update: {},
    create: {
      id: "B",
      name: "Kelompok B (Usia 5-6 Tahun)",
    },
  })
  console.log(`✅ Classes: ${classA.name}, ${classB.name}`)

  const admin = await prisma.user.upsert({
    where: { email: "admin@tk.com" },
    update: { password: hashedPassword },
    create: {
      name: "Admin Al Islah",
      email: "admin@tk.com",
      password: hashedPassword,
      role: "admin",
    },
  })
  console.log(`✅ Admin: ${admin.email}`)

  const teacher1 = await prisma.user.upsert({
    where: { email: "nisa@tk.com" },
    update: { password: hashedPassword, classId: "A" },
    create: {
      name: "Ibu Nisa",
      email: "nisa@tk.com",
      password: hashedPassword,
      role: "teacher",
      classId: "A",
    },
  })
  console.log(`✅ Guru 1: ${teacher1.email} (Ibu Nisa) assigned to class A`)

  const teacher2 = await prisma.user.upsert({
    where: { email: "asep@tk.com" },
    update: { password: hashedPassword, classId: "B" },
    create: {
      name: "Pak Asep",
      email: "asep@tk.com",
      password: hashedPassword,
      role: "teacher",
      classId: "B",
    },
  })
  console.log(`✅ Guru 2: ${teacher2.email} (Pak Asep) assigned to class B`)

  // Seed Students
  const studentsToSeed = [
    { nis: "1001", name: "Ahmad Rizky", classId: "A" },
    { nis: "1002", name: "Bunga Pertiwi", classId: "A" },
    { nis: "1003", name: "Cahyo Wijaya", classId: "B" },
    { nis: "1004", name: "Dina Amelia", classId: "B" }
  ]

  for (const s of studentsToSeed) {
    await prisma.student.upsert({
      where: { nis: s.nis },
      update: {},
      create: s,
    })
  }
  console.log(`✅ Seeded ${studentsToSeed.length} students`)

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
