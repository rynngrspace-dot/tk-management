// // @ts-ignore - Next.js resolves .ts imports at build time
// import { PrismaClient } from "@/generated/prisma/client"
// import { PrismaPg } from "@prisma/adapter-pg"

// const globalForPrisma = globalThis as any

// function createPrismaClient() {
//   const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
//   const adapter = new PrismaPg({ connectionString })
//   return new PrismaClient({ adapter })
// }

// const prisma = globalForPrisma.prisma ?? createPrismaClient()

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// export default prisma


// @ts-ignore
import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as any

function createPrismaClient() {
  const isProduction = process.env.NODE_ENV === "production"

  const connectionString = isProduction
    ? process.env.DATABASE_URL // 🔥 pakai pooler di Vercel
    : process.env.DIRECT_URL   // 🔥 pakai direct di local

  const adapter = new PrismaPg({
    connectionString,
  })

  return new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma