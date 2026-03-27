import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req, { params }) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    const body = await req.json()
    const { code, name, weight, type } = body

    const updated = await prisma.criteria.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(name && { name }),
        ...(weight !== undefined && { weight: parseFloat(weight) }),
        ...(type && { type }),
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update criteria:", error)
    return NextResponse.json(
      { error: "Gagal mengupdate kriteria", details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    await prisma.criteria.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete criteria:", error)
    return NextResponse.json(
      { error: "Gagal menghapus kriteria", details: error.message },
      { status: 500 }
    )
  }
}
