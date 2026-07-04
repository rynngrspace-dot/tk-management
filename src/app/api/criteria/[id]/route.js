import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req, { params }) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    const body = await req.json()
    const { code, name, weight, type } = body

    let weightVal = undefined
    if (weight !== undefined) {
      weightVal = parseFloat(weight)
      if (isNaN(weightVal) || weightVal < 0 || weightVal > 1) {
        return NextResponse.json({ error: "Bobot harus berupa angka antara 0 dan 1" }, { status: 400 })
      }

      // Get other criteria to check total weight
      const otherCriteria = await prisma.criteria.findMany({
        where: { id: { not: id } }
      })
      const otherTotal = otherCriteria.reduce((sum, c) => sum + (c.weight || 0), 0)

      if (otherTotal + weightVal > 1.0001) {
        const remaining = Math.max(0, 1.00 - otherTotal)
        return NextResponse.json(
          { error: `Total bobot melebihi 1.00. Sisa bobot yang tersedia adalah ${remaining.toFixed(2)}` },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.criteria.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(name && { name }),
        ...(weightVal !== undefined && { weight: weightVal }),
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
