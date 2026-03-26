import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(req) {
  try {
    const session = await getSession()
    if (!session || (session.role !== "admin" && session.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    let { month, year, period, classId } = body

    // Enforce teacher's class
    if (session.role === "teacher") {
      classId = session.classId
    }

    if (!month || !year || !period) {
      return NextResponse.json({ error: "Parameter wajib: month, year, period" }, { status: 400 })
    }

    // 1. Dapatkan daftar kriteria
    const criteriaList = await prisma.criteria.findMany()
    if (criteriaList.length === 0) {
      return NextResponse.json({ error: "Belum ada kriteria, matriks tidak bisa dihitung" }, { status: 400 })
    }

    // 2. Kumpulkan semua nilai assessment dari progress mingguan untuk kelas dan periode tsb
    const filterStudent = classId ? { classId: classId.toString() } : {}
    
    const progressRecords = await prisma.weeklyProgress.findMany({
      where: {
        month: month.toString(),
        year: parseInt(year),
        student: filterStudent
      },
      include: {
        assessments: true
      }
    })

    if (progressRecords.length === 0) {
      return NextResponse.json({ message: "Tidak ada data nilai yang diproses pada periode ini" }, { status: 404 })
    }

    // Agregasi nilai per siswa per kriteria (rata-rata jika ada minggu 1,2,3, dst)
    const studentData = {} // { studentId: { criteriaId: avgScore } }
    const studentTrack = {}

    progressRecords.forEach(prog => {
      const sId = prog.studentId
      if (!studentTrack[sId]) studentTrack[sId] = { sums: {}, counts: {} }
      
      prog.assessments.forEach(ass => {
        const cId = ass.criteriaId
        if (!studentTrack[sId].sums[cId]) {
          studentTrack[sId].sums[cId] = 0
          studentTrack[sId].counts[cId] = 0
        }
        studentTrack[sId].sums[cId] += ass.score
        studentTrack[sId].counts[cId] += 1
      })
    })

    const studentAverageScores = {}
    const cMaxMin = {} // { cId: { max: X, min: Y } }

    Object.keys(studentTrack).forEach(sId => {
      studentAverageScores[sId] = {}
      criteriaList.forEach(c => {
        const sum = studentTrack[sId].sums[c.id] || 0
        const count = studentTrack[sId].counts[c.id] || 0
        const avg = count > 0 ? sum / count : 0
        
        studentAverageScores[sId][c.id] = avg

        if (!cMaxMin[c.id]) cMaxMin[c.id] = { max: avg, min: avg }
        if (avg > cMaxMin[c.id].max) cMaxMin[c.id].max = avg
        if (avg < cMaxMin[c.id].min) cMaxMin[c.id].min = avg
      })
    })

    // 3. Normalisasi
    const normalized = {}
    Object.keys(studentAverageScores).forEach(sId => {
      normalized[sId] = {}
      criteriaList.forEach(c => {
        const raw = studentAverageScores[sId][c.id]
        let norm = 0
        if (c.type === "benefit") {
           norm = cMaxMin[c.id].max > 0 ? raw / cMaxMin[c.id].max : 0
        } else {
           norm = raw > 0 ? cMaxMin[c.id].min / raw : 0
        }
        normalized[sId][c.id] = norm
      })
    })

    // 4. Pembobotan & Hasil Akhir
    const bulkUpsert = []
    for (const sId of Object.keys(normalized)) {
      let totalScore = 0
      criteriaList.forEach(c => {
        totalScore += (normalized[sId][c.id] || 0) * c.weight
      })

      // Predikat (Maturitas TK)
      let status = "Perlu Bimbingan (BB)"
      if (totalScore >= 0.85) status = "Berkembang Sangat Baik (BSB)"
      else if (totalScore >= 0.70) status = "Berkembang Sesuai Harapan (BSH)"
      else if (totalScore >= 0.50) status = "Mulai Berkembang (MB)"

      bulkUpsert.push({
        studentId: parseInt(sId),
        period: period,
        totalScore: parseFloat(totalScore.toFixed(3)),
        status
      })
    }

    // 5. Simpan ke database
    for (const record of bulkUpsert) {
      await prisma.sawResult.upsert({
        where: {
          studentId_period: {
            studentId: record.studentId,
            period: record.period
          }
        },
        update: {
          totalScore: record.totalScore,
          status: record.status
        },
        create: {
          studentId: record.studentId,
          period: record.period,
          totalScore: record.totalScore,
          status: record.status
        }
      })
    }

    return NextResponse.json({ success: true, processedStudents: bulkUpsert.length })
  } catch (error) {
    console.error("Calculation Error:", error)
    return NextResponse.json({ error: "Gagal menghitung SAW", details: error.message }, { status: 500 })
  }
}
