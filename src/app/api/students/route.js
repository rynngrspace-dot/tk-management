import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    let classId = searchParams.get("classId")

    // If teacher, they can only see their own class
    if (session.role === "teacher") {
      classId = session.classId
    }

    const filter = classId ? { classId } : {}

    const students = await prisma.student.findMany({
      where: filter,
      include: {
        class: true,
      },
      orderBy: { name: "asc" },
    })
    
    return NextResponse.json(students)
  } catch (error) {
    console.error("Failed to fetch students:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data siswa" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || (session.role !== "admin" && session.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    // Safety check for teachers: they can only add to their class
    if (session.role === "teacher" && data.classId !== session.classId) {
       return NextResponse.json({ error: "Anda hanya bisa menambah siswa ke kelas Anda sendiri" }, { status: 403 })
    }

    if (!data.name || !data.nis || !data.classId) {
      return NextResponse.json(
        { error: "Nama, NIS, dan Kelas harus diisi" },
        { status: 400 }
      )
    }

    // Check if NIS already exists
    const existingStudent = await prisma.student.findUnique({
      where: { nis: data.nis },
    })
    
    if (existingStudent) {
      return NextResponse.json(
        { error: "NIS sudah terdaftar" },
        { status: 400 }
      )
    }

    const newStudent = await prisma.student.create({
      data: {
        name: data.name,
        nis: data.nis,
        classId: data.classId,
        gender: data.gender || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        parentName: data.parentName || null,
        parentPhone: data.parentPhone || null,
        address: data.address || null,
        allergies: data.allergies || null,
      },
      include: {
        class: true,
      }
    })

    return NextResponse.json(newStudent, { status: 201 })
  } catch (error) {
    console.error("Failed to create student:", error)
    return NextResponse.json(
      { error: "Gagal menambah data siswa" },
      { status: 500 }
    )
  }
}
