import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken, setAuthCookie } from "@/lib/auth"

export async function POST(request) {
  try {

    console.log("DATABASE_URL:", process.env.DATABASE_URL)

    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      )
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      classId: user.classId,
    })

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        classId: user.classId,
      },
    })

    // Set httpOnly cookie
    setAuthCookie(response, token)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { 
        error: "Terjadi kesalahan server",      
        details: error.message,
      },
      { status: 500 }
    )
  }
}
