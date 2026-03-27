import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request, { params }) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    const data = await request.json()
    
    // Check if NIS is being changed and if it already exists
    if (data.nis) {
      const existing = await prisma.student.findFirst({
        where: {
          nis: data.nis,
          id: { not: id }
        }
      })
      if (existing) {
        return NextResponse.json({ error: "NIS sudah terdaftar" }, { status: 400 })
      }
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        nis: data.nis,
        classId: data.classId,
        gender: data.gender !== undefined ? data.gender : undefined,
        dateOfBirth: data.dateOfBirth !== undefined ? (data.dateOfBirth ? new Date(data.dateOfBirth) : null) : undefined,
        parentName: data.parentName !== undefined ? data.parentName : undefined,
        parentPhone: data.parentPhone !== undefined ? data.parentPhone : undefined,
        address: data.address !== undefined ? data.address : undefined,
        allergies: data.allergies !== undefined ? data.allergies : undefined,
      },
      include: {
        class: true,
      }
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error("Failed to update student:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Data siswa tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Gagal memperbarui data siswa" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    // Invincible Deletion: Manually clean up all relations in correct order
    // 1. Delete all Assessments deeply linked to this student
    await prisma.assessment.deleteMany({
      where: {
        weeklyProgress: { studentId: id }
      }
    })

    // 2. Delete all WeeklyProgress records
    await prisma.weeklyProgress.deleteMany({ where: { studentId: id } })

    // 3. Delete all SawResults
    await prisma.sawResult.deleteMany({ where: { studentId: id } })

    // 4. Finally delete the Student
    await prisma.student.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Siswa berhasil dihapus" })
  } catch (error) {
    console.error("Failed to delete student:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Data siswa tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Gagal menghapus data siswa" }, { status: 500 })
  }
}
