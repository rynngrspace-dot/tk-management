// @ts-ignore - Next.js resolves .ts imports at build time
import { PrismaClient } from "@/generated/prisma/client.ts"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as any

function createPrismaClient() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
