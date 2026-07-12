import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period')
    let classId = searchParams.get('classId')

    if (session.role === "teacher") {
      classId = session.classId
    }

    const filters = {}
    if (period) filters.period = period
    
    if (session.role === "parent") {
      const parentStudent = await prisma.student.findUnique({
        where: { id: session.studentId },
        select: { classId: true }
      })
      if (parentStudent) {
        filters.student = { classId: parentStudent.classId }
      } else {
        return NextResponse.json([])
      }
    } else if (classId) {
      filters.student = { classId }
    }

    const results = await prisma.sawResult.findMany({
      where: filters,
      include: {
        student: { 
          select: { 
            id: true, 
            name: true, 
            nis: true, 
            classId: true,
            class: { select: { name: true } }
          } 
        }
      },
      orderBy: { totalScore: 'desc' }
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Failed to fetch SAW results:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data Hasil SAW" },
      { status: 500 }
    )
  }
}
