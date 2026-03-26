import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(request, { params }) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    const data = await request.json()
    
    // Check if Email is being changed and if it already exists
    if (data.email) {
      const existing = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: id }
        }
      })
      if (existing) {
        return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
      }
    }

    const updateData = {
      name: data.name,
      email: data.email,
      classId: data.classId || null,
    }

    // Only update password if provided
    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const updatedTeacher = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        class: true,
      }
    })

    const { password: _, ...safeTeacher } = updatedTeacher

    return NextResponse.json(safeTeacher)
  } catch (error) {
    console.error("Failed to update teacher:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Data guru tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Gagal memperbarui data guru" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Guru berhasil dihapus" })
  } catch (error) {
    console.error("Failed to delete teacher:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Data guru tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Gagal menghapus data guru" }, { status: 500 })
  }
}
