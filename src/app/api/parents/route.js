import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parents = await prisma.user.findMany({
      where: { role: "parent" },
      include: {
        student: {
          select: { id: true, name: true, nis: true, classId: true }
        }
      },
      orderBy: { name: "asc" },
    })

    // Remove password
    const safeParents = parents.map(p => {
      const { password, ...rest } = p
      return rest
    })

    return NextResponse.json(safeParents)
  } catch (error) {
    console.error("Failed to fetch parents:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data orang tua" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.name || !data.email || !data.password || !data.studentId) {
      return NextResponse.json(
        { error: "Nama, Email, Password, dan Hubungan Siswa harus diisi" },
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

    const newParent = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "parent",
        studentId: parseInt(data.studentId),
      },
      include: {
        student: true
      }
    })

    const { password: _, ...safeParent } = newParent

    return NextResponse.json(safeParent, { status: 201 })
  } catch (error) {
    console.error("Failed to create parent:", error)
    return NextResponse.json(
      { error: "Gagal menambah data orang tua" },
      { status: 500 }
    )
  }
}
