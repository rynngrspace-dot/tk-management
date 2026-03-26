import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret"
const TOKEN_NAME = "tk-auth-token"
const TOKEN_MAX_AGE = 60 * 60 * 24 // 24 hours

/**
 * Sign a JWT token with user payload
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

/**
 * Set auth cookie on response
 */
export function setAuthCookie(response, token) {
  response.cookies.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  })
  return response
}

/**
 * Get current user session from cookie
 */
export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

/**
 * Clear auth cookie (logout)
 */
export function clearAuthCookie(response) {
  response.cookies.set(TOKEN_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  return response
}
