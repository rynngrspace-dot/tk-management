import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const criteria = await prisma.criteria.findMany({
      orderBy: { code: "asc" }
    })
    return NextResponse.json(criteria)
  } catch (error) {
    console.error("Failed to fetch criteria:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data kriteria", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { code, name, weight, type } = body

    if (!code || !name || weight === undefined) {
      return NextResponse.json({ error: "Code, name, dan weight wajib diisi" }, { status: 400 })
    }

    const weightVal = parseFloat(weight)
    if (isNaN(weightVal) || weightVal < 0 || weightVal > 1) {
      return NextResponse.json({ error: "Bobot harus berupa angka antara 0 dan 1" }, { status: 400 })
    }

    // Get all existing criteria to check total weight
    const existingCriteria = await prisma.criteria.findMany()
    const currentTotal = existingCriteria.reduce((sum, c) => sum + (c.weight || 0), 0)

    if (currentTotal + weightVal > 1.0001) {
      const remaining = Math.max(0, 1.00 - currentTotal)
      return NextResponse.json(
        { error: `Total bobot melebihi 1.00. Sisa bobot yang tersedia adalah ${remaining.toFixed(2)}` },
        { status: 400 }
      )
    }

    const newCriteria = await prisma.criteria.create({
      data: {
        code,
        name,
        weight: weightVal,
        type: type || "benefit"
      }
    })

    return NextResponse.json(newCriteria, { status: 201 })
  } catch (error) {
    console.error("Failed to create criteria:", error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Kode kriteria sudah digunakan" }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Gagal membuat kriteria", details: error.message },
      { status: 500 }
    )
  }
}
