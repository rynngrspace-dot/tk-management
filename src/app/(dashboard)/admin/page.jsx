"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, BarChart3, TrendingUp, Clock } from "lucide-react"
import { getMockData } from "@/lib/mock-data"

export default function AdminDashboardPage() {
  const { students, teachers, classes } = getMockData()

  const stats = [
    {
      title: "Total Siswa",
      value: students.length,
      icon: Users,
      gradient: "gradient-blue",
      shadowColor: "shadow-blue-500/20",
      change: "+3 bulan ini",
    },
    {
      title: "Total Guru",
      value: teachers.length,
      icon: GraduationCap,
      gradient: "gradient-emerald",
      shadowColor: "shadow-emerald-500/20",
      change: "+1 bulan ini",
    },
    {
      title: "Total Kelas",
      value: classes.length,
      icon: BookOpen,
      gradient: "gradient-amber",
      shadowColor: "shadow-amber-500/20",
      change: "3 kelompok aktif",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard Admin</h2>
        <p className="text-sm text-slate-500">Ringkasan data Sistem Manajemen TK</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.gradient} rounded-2xl p-5 text-white shadow-lg ${stat.shadowColor} card-hover relative overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Decorative circle */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute bottom-0 right-8 w-16 h-16 bg-white/5 rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">{stat.title}</p>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Placeholder */}
        <Card className="col-span-4 border-0 shadow-md shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Statistik Perkembangan Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-indigo-100 rounded-2xl bg-indigo-50/30 text-slate-400 flex-col gap-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100/50 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-indigo-300" />
              </div>
              <span className="font-medium text-sm">Akan terintegrasi Recharts/Chart.js</span>
              <span className="text-xs text-slate-400">Visualisasi data perkembangan siswa</span>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-3 border-0 shadow-md shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Guru Siti", action: "menilai siswa Ahmad Rizky", time: "2 jam yang lalu", gradient: "gradient-blue" },
                { name: "Guru Budi", action: "memperbarui data Kelas B", time: "5 jam yang lalu", gradient: "gradient-emerald" },
                { name: "Admin Utama", action: "menambahkan Kriteria Baru", time: "1 hari yang lalu", gradient: "gradient-amber" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200 group cursor-default">
                  <div className={`w-9 h-9 rounded-xl ${activity.gradient} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                    {activity.name.charAt(0)}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug text-slate-700">
                      <span className="font-semibold text-slate-800">{activity.name}</span>{" "}
                      <span className="text-slate-500">{activity.action}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
