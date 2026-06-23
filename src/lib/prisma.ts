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
  // Use DATABASE_URL (the pooler) by default as it is accessible locally and in production,
  // falling back to DIRECT_URL if DATABASE_URL is not set.
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL

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
