"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ListChecks, Calendar, Sparkles, BookOpen } from "lucide-react"
import { getMockData } from "@/lib/mock-data"

export default function TeacherDashboardPage() {
  const [teacherName, setTeacherName] = useState("")
  const [stats, setStats] = useState({ studentCount: 0, classId: "" })

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Guru"
    setTeacherName(name)
    
    const { teachers, students, classes } = getMockData()
    const teacher = teachers.find(t => t.name === name) || teachers[0]
    
    if (teacher) {
      const classData = classes.find(c => c.id === teacher.classId)
      const myStudents = students.filter(s => s.classId === teacher.classId)
      setStats({
        studentCount: myStudents.length,
        classId: teacher.classId,
        className: classData ? classData.name : "Belum Ditugaskan"
      })
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="gradient-primary rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 right-20 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-indigo-200 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Dashboard Guru
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Selamat Datang, {teacherName} 👋</h2>
          <p className="text-indigo-200 text-sm mt-1">Kelola perkembangan siswa dan penilaian dari dashboard ini</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-0 shadow-md shadow-blue-100/50 bg-white/80 backdrop-blur-sm card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Siswa Saya</CardTitle>
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center shadow-sm shadow-blue-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-800">{stats.studentCount}</div>
            <p className="text-xs font-medium text-slate-400 mt-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              Di {stats.className}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md shadow-emerald-100/50 bg-white/80 backdrop-blur-sm card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Penilaian Selesai</CardTitle>
            <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <ListChecks className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-800">4</div>
            <p className="text-xs font-medium text-slate-400 mt-1.5">Bulan ini</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md shadow-amber-100/50 bg-white/80 backdrop-blur-sm card-hover overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jadwal Hari Ini</CardTitle>
            <div className="w-10 h-10 rounded-xl gradient-amber flex items-center justify-center shadow-sm shadow-amber-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-800">Sentra Bermain</div>
            <p className="text-xs font-medium text-slate-400 mt-1.5">08:00 - 10:00</p>
          </CardContent>
        </Card>
      </div>

      {/* Guide Card */}
      <Card className="border-0 shadow-md shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Panduan Penggunaan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { step: "1", text: <>Pergi ke halaman <strong className="text-slate-800">Siswa Saya</strong> untuk melihat daftar murid di kelompok Anda.</>, gradient: "gradient-blue" },
            { step: "2", text: <>Gunakan menu <strong className="text-slate-800">Penilaian</strong> untuk memberikan skor/nilai perkembangan pada siswa sesuai kriteria SAW yang ditentukan Admin.</>, gradient: "gradient-emerald" },
            { step: "3", text: <>Analisis peringkat perkembangan siswa pada halaman <strong className="text-slate-800">Hasil SAW</strong>.</>, gradient: "gradient-amber" },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className={`w-7 h-7 rounded-lg ${item.gradient} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm`}>
                {item.step}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
