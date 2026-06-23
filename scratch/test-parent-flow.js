const dotenv = require("dotenv");
dotenv.config();

// We will fetch against our local development server
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("🚀 Starting verification tests for Parent Flow...");

  let cookie = "";

  // 1. Test Login as parent (ortu@tk.com)
  console.log("\n1. Testing Login as ortu@tk.com...");
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ortu@tk.com", password: "123" })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(`Login failed: ${data.error || res.statusText}`);
    }

    console.log("✅ Login successful!");
    console.log("   User Name:", data.user.name);
    console.log("   User Role:", data.user.role);
    console.log("   Student ID:", data.user.studentId);

    // Save auth cookie from response headers
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      cookie = setCookie.split(";")[0];
      console.log("✅ Session Cookie obtained.");
    } else {
      console.log("⚠️ No set-cookie header found (may fail subsequent requests).");
    }

    const parentStudentId = data.user.studentId;

    // 2. Test fetching student details
    console.log("\n2. Fetching student details as parent...");
    const resStudent = await fetch(`${BASE_URL}/api/students`, {
      headers: { Cookie: cookie }
    });

    if (!resStudent.ok) {
      throw new Error(`Fetch students failed: ${resStudent.status}`);
    }

    const students = await resStudent.json();
    console.log(`✅ Fetched ${students.length} student record(s).`);
    if (students.length > 0) {
      const s = students[0];
      console.log(`   Student Name: ${s.name} (NIS: ${s.nis})`);
      if (s.id !== parentStudentId) {
        throw new Error(`Security breach! Returned student ID ${s.id} does not match parent's student ID ${parentStudentId}`);
      }
      console.log("   ✅ Security Check Passed: Parent can only access their own child.");
    }

    // 3. Test fetching weekly progress
    console.log("\n3. Fetching weekly progress reports as parent...");
    const resProgress = await fetch(`${BASE_URL}/api/progress`, {
      headers: { Cookie: cookie }
    });

    if (!resProgress.ok) {
      throw new Error(`Fetch progress failed: ${resProgress.status}`);
    }

    const progress = await resProgress.json();
    console.log(`✅ Fetched ${progress.length} progress reports.`);
    const nonMatching = progress.filter(p => p.studentId !== parentStudentId);
    if (nonMatching.length > 0) {
      throw new Error(`Security breach! Returned progress reports for other students.`);
    }
    console.log("   ✅ Security Check Passed: Parent can only access progress reports of their own child.");

    // 4. Test fetching SAW rankings
    console.log("\n4. Fetching SAW rankings as parent...");
    const resSaw = await fetch(`${BASE_URL}/api/saw`, {
      headers: { Cookie: cookie }
    });

    if (!resSaw.ok) {
      throw new Error(`Fetch SAW failed: ${resSaw.status}`);
    }

    const sawResults = await resSaw.json();
    console.log(`✅ Fetched ${sawResults.length} SAW rankings for child's class.`);
    if (sawResults.length > 0) {
      const myRank = sawResults.findIndex(r => r.studentId === parentStudentId) + 1;
      const myResult = sawResults.find(r => r.studentId === parentStudentId);
      console.log(`   Child Class: Kelompok ${myResult?.student?.classId || 'A'}`);
      console.log(`   Child Rank: Rank ${myRank} of ${sawResults.length} students`);
      console.log(`   Child Score: ${myResult?.totalScore} (${myResult?.status})`);
      
      const differentClass = sawResults.filter(r => r.student?.classId !== myResult?.student?.classId);
      if (differentClass.length > 0) {
        throw new Error(`Security breach! Returned SAW rankings for other classes.`);
      }
      console.log("   ✅ Security Check Passed: Parent can only access SAW rankings for their child's class.");
    }

    console.log("\n🎉 ALL TESTS COMPLETED SUCCESSFULLY! PARENT FLOW INTEGRATION IS SECURE AND FUNCTIONAL.");

  } catch (err) {
    console.error("\n❌ Test failed:", err.message);
  }
}

// Wait 1 second before running to ensure dev server is fully up
setTimeout(runTests, 1000);
