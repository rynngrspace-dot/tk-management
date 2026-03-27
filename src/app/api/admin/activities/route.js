import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the most recent entries from Class, Student, User, and WeeklyProgress
    // We'll take more than just the dashboard to show a full list
    const [recentProgress, recentStudents, recentClasses, recentUsers] = await Promise.all([
      prisma.weeklyProgress.findMany({
        take: 30,
        orderBy: { updatedAt: 'desc' },
        include: {
          student: {
            select: {
              name: true,
              class: { 
                select: { 
                  name: true,
                  teachers: { select: { name: true }, take: 1 }
                } 
              }
            }
          }
        }
      }),
      prisma.student.findMany({
        take: 20,
        orderBy: { updatedAt: 'desc' },
        include: { class: { select: { name: true } } }
      }),
      prisma.class.findMany({
        take: 20,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.user.findMany({
        where: { role: "teacher" },
        take: 20,
        orderBy: { updatedAt: 'desc' },
      })
    ]);

    // Normalize and merge activities
    const activities = [
      ...recentProgress.map(p => ({
        id: `p-${p.id}`,
        name: p.student.name,
        actor: p.student.class?.teachers?.[0]?.name || "Guru",
        action: `Update Progres Minggu ${p.week}`,
        time: p.updatedAt,
        context: p.student.class?.name || "??",
        type: "assessment"
      })),
      ...recentStudents.map(s => ({
        id: `s-${s.id}`,
        name: s.name,
        actor: "Admin",
        action: s.createdAt.getTime() === s.updatedAt.getTime() ? "Siswa Baru Terdaftar" : "Update Data Siswa",
        time: s.updatedAt,
        context: s.class?.name || "??",
        type: "student"
      })),
      ...recentClasses.map(c => ({
        id: `c-${c.id}`,
        name: c.name,
        actor: "Admin",
        action: c.createdAt.getTime() === c.updatedAt.getTime() ? "Kelompok Baru Dibuat" : "Update Data Kelompok",
        time: c.updatedAt,
        context: c.id,
        type: "class"
      })),
      ...recentUsers.map(u => ({
        id: `u-${u.id}`,
        name: u.name,
        actor: "Admin",
        action: u.createdAt.getTime() === u.updatedAt.getTime() ? "Guru Baru Terdaftar" : "Update Data Guru",
        time: u.updatedAt,
        context: "Staff",
        type: "teacher"
      }))
    ]
    .sort((a, b) => b.time - a.time)
    .slice(0, 100); // Return up to 100 recent activities

    return NextResponse.json(activities);

  } catch (error) {
    console.error("Activities API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
