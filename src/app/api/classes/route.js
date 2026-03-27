import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || (session.role !== "admin" && session.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const classes = await prisma.class.findMany({
      orderBy: { id: "asc" },
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
          },
          take: 1, // Usually one main teacher shown in list
        },
        _count: {
          select: { students: true }
        }
      }
    })
    return NextResponse.json(classes)
  } catch (error) {
    console.error("Failed to fetch classes:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data kelas" },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, name } = await req.json()

    if (!id || !name) {
      return NextResponse.json({ error: "ID dan Nama kelas wajib diisi" }, { status: 400 })
    }

    // Check if ID already exists
    const existing = await prisma.class.findUnique({ where: { id } })
    if (existing) {
      return NextResponse.json({ error: "ID Kelas sudah digunakan" }, { status: 400 })
    }

    const newClass = await prisma.class.create({
      data: { id, name }
    })

    return NextResponse.json(newClass)
  } catch (error) {
    console.error("Failed to create class:", error)
    return NextResponse.json(
      { error: "Gagal membuat kelas baru" },
      { status: 500 }
    )
  }
}
