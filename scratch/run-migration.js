const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();
  console.log("Connected to database.");
  try {
    console.log("Running SQL migrations...");
    // Add column if not exists
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "studentId" INTEGER;`);
    console.log("Added column studentId to User table.");
    
    // Add constraint
    try {
      await client.query(`
        ALTER TABLE "User" 
        ADD CONSTRAINT "User_studentId_fkey" 
        FOREIGN KEY ("studentId") 
        REFERENCES "Student"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
      `);
      console.log("Added constraint User_studentId_fkey.");
    } catch (e) {
      if (e.code === '42710') { // duplicate_object
        console.log("Constraint User_studentId_fkey already exists.");
      } else {
        throw e;
      }
    }
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
