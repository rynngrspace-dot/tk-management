const { PrismaClient } = require("./src/generated/prisma")
const prisma = new PrismaClient()

async function check() {
  const users = await prisma.user.findMany()
  console.log(JSON.stringify(users, null, 2))
  process.exit(0)
}

check()
