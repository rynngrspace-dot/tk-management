import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { id: "asc" },
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
