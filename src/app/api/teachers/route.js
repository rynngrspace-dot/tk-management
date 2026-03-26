import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "teacher" },
      include: {
        class: true,
      },
      orderBy: { name: "asc" },
    })
    
    // Remove password from response
    const safeTeachers = teachers.map(t => {
      const { password, ...rest } = t
      return rest
    })
    
    return NextResponse.json(safeTeachers)
  } catch (error) {
    console.error("Failed to fetch teachers:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data guru" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Nama, Email, dan Password harus diisi" },
        { status: 400 }
      )
    }

    // Check if Email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const newTeacher = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "teacher",
        classId: data.classId || null,
      },
      include: {
        class: true,
      }
    })

    const { password: _, ...safeTeacher } = newTeacher

    return NextResponse.json(safeTeacher, { status: 201 })
  } catch (error) {
    console.error("Failed to create teacher:", error)
    return NextResponse.json(
      { error: "Gagal menambah data guru" },
      { status: 500 }
    )
  }
}
