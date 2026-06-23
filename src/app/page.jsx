"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    
    if (!userRole) {
      router.replace("/login");
    } else if (userRole === "admin") {
      router.replace("/dashboard/admin");
    } else if (userRole === "parent") {
      router.replace("/dashboard/parent");
    } else if (userRole === "teacher") {
      router.replace("/dashboard/teacher");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
}
