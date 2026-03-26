import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getSession();
    console.log("Stats API Session:", session);
    
    if (!session) {
      console.log("Stats API: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const role = session.role;

    // Security: Teachers can only see their own class stats
    const targetClassId = role === "teacher" ? session.classId : classId;
    console.log("Stats API Role:", role, "TargetClassId:", targetClassId);

    // If teacher has no class, don't throw 400, just return empty stats
    if (role === "teacher" && !targetClassId) {
      return NextResponse.json({
        stats: { students: 0, teachers: 0, classes: 0, className: "Belum Ditugaskan", progressThisMonth: 0 },
        activities: [],
        warning: "Guru belum memiliki Kelompok/Kelas yang ditugaskan."
      });
    }

    // Ensure targetClassId is string for filtering
    const studentFilter = targetClassId ? { classId: String(targetClassId) } : {};
    
    // Monthly Progress Count
    const now = new Date();
    const currentMonth = now.toLocaleString('id-ID', { month: 'long' }); // e.g. "Agustus"
    const currentYear = now.getFullYear();

    const [studentsCount, teachersCount, classesCount, progressCount] = await Promise.all([
      prisma.student.count({ where: studentFilter }),
      prisma.user.count({ where: { role: "teacher" } }),
      prisma.class.count(),
      prisma.weeklyProgress.count({ 
        where: { 
          student: studentFilter,
          month: currentMonth,
          year: currentYear
        } 
      })
    ]);

    // 2. Class Info (for Teacher)
    let classInfo = null;
    if (targetClassId) {
      classInfo = await prisma.class.findUnique({
        where: { id: targetClassId },
        select: { name: true }
      });
    }

    // 3. Recent Activity (WeeklyProgress)
    const activityFilter = targetClassId ? { student: { classId: targetClassId } } : {};
    const recentProgress = await prisma.weeklyProgress.findMany({
      where: activityFilter,
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        student: {
          select: {
            name: true,
            class: { select: { name: true } }
          }
        }
      }
    });

    const activities = recentProgress.map(p => ({
      name: p.student.name,
      action: `Update Progres Minggu ${p.week} (${p.month})`,
      time: p.updatedAt,
      class: p.student.class?.name || "??",
      type: "assessment"
    }));

    return NextResponse.json({
      stats: {
        students: studentsCount,
        teachers: teachersCount,
        classes: classesCount,
        className: classInfo?.name || null,
        progressThisMonth: progressCount
      },
      activities
    });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
