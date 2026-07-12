import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function PUT(req, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: newId, name } = await req.json()

    if (!newId || !name) {
      return NextResponse.json({ error: "ID dan Nama kelas wajib diisi" }, { status: 400 })
    }

    // Update the class. Note: If changing ID, Prisma handles relation updates if configured, 
    // but usually it's better to just update name if ID is the primary key.
    // However, if the user wants to change "A" to "A1", we should handle it.

    const updatedClass = await prisma.class.update({
      where: { id: oldId },
      data: { id: newId, name }
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error("Failed to update class:", error)
    return NextResponse.json(
      { error: "Gagal memperbarui kelas" },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if class has students or teachers
    const classCheck = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: { students: true, teachers: true }
        }
      }
    })

    if (!classCheck) {
      return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 })
    }

    if (classCheck._count.students > 0 || classCheck._count.teachers > 0) {
      return NextResponse.json({
        error: "Kelas tidak bisa dihapus karena masih memiliki siswa atau guru. Kosongkan kelas terlebih dahulu."
      }, { status: 400 })
    }

    await prisma.class.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete class:", error)
    return NextResponse.json(
      { error: "Gagal menghapus kelas" },
      { status: 500 }
    )
  }
}
