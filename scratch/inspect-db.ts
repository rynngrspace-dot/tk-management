import prisma from "../src/lib/prisma";

async function main() {
  const students = await prisma.student.findMany({
    include: {
      parents: true
    }
  });
  console.log("=== STUDENTS ===");
  console.log(JSON.stringify(students, null, 2));

  const users = await prisma.user.findMany();
  console.log("=== USERS ===");
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
