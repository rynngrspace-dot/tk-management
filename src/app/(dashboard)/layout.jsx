"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [role, setRole] = useState(null)
  const [userName, setUserName] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    const username = localStorage.getItem("userName")

    if (!userRole) {
      router.push("/login")
      return
    }

    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      router.push("/login")
    } else if (pathname.startsWith("/dashboard/teacher") && userRole !== "teacher") {
      router.push("/login")
    } else if (pathname.startsWith("/dashboard/parent") && userRole !== "parent") {
      router.push("/login")
    } else {
      setRole(userRole)
      setUserName(username || "Pengguna")
    }
  }, [pathname, router])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname])

  if (!role) return null

  return (
    <div className="min-h-screen bg-background bg-dots">
      <Navbar
        userName={userName}
        role={role}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />
      <Sidebar
        role={role}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div
        className={`p-4 md:p-6 lg:p-8 mt-14 h-[calc(100vh-3.5rem)] overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? "sm:ml-18" : "sm:ml-64"
          }`}
      >
        <div className="animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  )
}
