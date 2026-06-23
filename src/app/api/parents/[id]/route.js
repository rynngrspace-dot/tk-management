import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getSession } from "@/lib/auth"

export async function PUT(request, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      studentId: data.studentId ? parseInt(data.studentId) : null,
    }

    // Only update password if provided
    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const updatedParent = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
      }
    })

    const { password: _, ...safeParent } = updatedParent

    return NextResponse.json(safeParent)
  } catch (error) {
    console.error("Failed to update parent:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Data orang tua tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Gagal memperbarui data orang tua" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: paramId } = await params
    const id = parseInt(paramId)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Akun orang tua berhasil dihapus" })
  } catch (error) {
    console.error("Failed to delete parent:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Data orang tua tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Gagal menghapus data orang tua" }, { status: 500 })
  }
}
