import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { verifyToken, setAuthCookie } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("tk-auth-token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Tidak ada akses" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { class: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 })
    }

    const { password, ...safeUser } = user
    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Failed to fetch profile:", error)
    return NextResponse.json({ error: "Gagal mengambil data profil" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("tk-auth-token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Tidak ada akses" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 })
    }

    const data = await request.json()

    // Validate email uniquely
    if (data.email) {
      const existing = await prisma.user.findFirst({
        where: { email: data.email, id: { not: payload.id } }
      })
      if (existing) {
        return NextResponse.json({ error: "Email sudah digunakan oleh akun lain" }, { status: 400 })
      }
    }

    const updateData = {}
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email

    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: updateData,
    })

    const { password, ...safeUser } = updatedUser
    
    // We should ideally update the JWT if email/name changed, but since localStorage controls some UI,
    // and a page refresh reads localStorage anyway, we just return success. 
    // Wait, let's actually rehydrate the cookie since it contains name and email.
    const { signToken } = await import("@/lib/auth")
    const newToken = signToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      classId: updatedUser.classId
    })
    
    const response = NextResponse.json({ success: true, user: safeUser })
    setAuthCookie(response, newToken)

    return response
  } catch (error) {
    console.error("Failed to update profile:", error)
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 })
  }
}
