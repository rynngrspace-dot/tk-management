import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(req) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    let classId = searchParams.get('classId')
    const week = searchParams.get('week')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const studentId = searchParams.get('studentId')

    // Access control for teachers
    if (session.role === "teacher") {
      classId = session.classId
    }

    const filters = {}
    if (week) filters.week = parseInt(week)
    if (month) filters.month = month
    if (year) filters.year = parseInt(year)
    
    if (session.role === "parent") {
      filters.studentId = session.studentId
    } else if (studentId) {
      filters.studentId = parseInt(studentId)
    }
    
    // Jika filter per kelas
    if (classId) {
      filters.student = { classId }
    }

    const progress = await prisma.weeklyProgress.findMany({
      where: filters,
      include: {
        student: {
          select: { id: true, name: true, nis: true, classId: true }
        },
        assessments: {
          include: { 
            criteria: {
              select: { id: true, code: true, name: true, weight: true, type: true }
            }
          }
        }
      },
      orderBy: {
        student: { name: 'asc' }
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Failed to fetch progress:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data progres", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const session = await getSession()
    if (!session || (session.role !== "admin" && session.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { week, month, year, studentsData } = body

    if (!week || !month || !year || !studentsData || !Array.isArray(studentsData)) {
      return NextResponse.json({ error: "Data input tidak lengkap atau format salah" }, { status: 400 })
    }

    // Process each student's weekly progress in a sequential manner or transaction
    for (const student of studentsData) {
      const { studentId, note, scores } = student

      // Teacher ownership check
      if (session.role === "teacher") {
         const studentCheck = await prisma.student.findUnique({
           where: { id: parseInt(studentId) },
           select: { classId: true }
         })
         if (!studentCheck || studentCheck.classId !== session.classId) {
            continue; // Skip unauthorized students
         }
      }

      // Upsert WeeklyProgress (find by studentId, week, month, year)
      const progress = await prisma.weeklyProgress.upsert({
        where: {
          studentId_week_month_year: {
            studentId: parseInt(studentId),
            week: parseInt(week),
            month,
            year: parseInt(year),
          }
        },
        update: {
          note: note || null
        },
        create: {
          studentId: parseInt(studentId),
          week: parseInt(week),
          month,
          year: parseInt(year),
          note: note || null
        }
      })

      // Upsert Assessments for this WeeklyProgress
      if (scores && Array.isArray(scores)) {
        for (const scoreItem of scores) {
          if (scoreItem.score !== null && scoreItem.score !== undefined && scoreItem.score !== "") {
            await prisma.assessment.upsert({
              where: {
                weeklyProgressId_criteriaId: {
                  weeklyProgressId: progress.id,
                  criteriaId: parseInt(scoreItem.criteriaId)
                }
              },
              update: {
                score: parseFloat(scoreItem.score)
              },
              create: {
                weeklyProgressId: progress.id,
                criteriaId: parseInt(scoreItem.criteriaId),
                score: parseFloat(scoreItem.score)
              }
            })
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: "Data progres mingguan berhasil disimpan" })
  } catch (error) {
    console.error("Failed to save progress:", error)
    return NextResponse.json(
      { error: "Gagal menyimpan progres", details: error.message },
      { status: 500 }
    )
  }
}
