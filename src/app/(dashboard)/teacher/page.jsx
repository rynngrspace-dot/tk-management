"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ListChecks, Calendar, Sparkles, BookOpen, Clock, AlertCircle } from "lucide-react"

export default function TeacherDashboardPage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [teacherName, setTeacherName] = useState("")

  useEffect(() => {
    setTeacherName(localStorage.getItem("userName") || "Guru")
    
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(json => {
        setData(json)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Teacher Dashboard fetch error:", err)
        setIsLoading(false)
      })
  }, [])

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="gradient-primary rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-100 text-xs font-bold uppercase tracking-[2px]">
              <Sparkles className="w-4 h-4" />
              Portal Guru TK Terpadu
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Selamat Datang, {teacherName} 👋</h2>
            <p className="text-indigo-100/80 text-sm font-medium">Kelola perkembangan siswa dan penilaian dari dashboard ini</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-3xl shrink-0">
             <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Status Kelompok</div>
             <div className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {data?.stats?.className || "Memuat..."}
             </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg shadow-blue-100/50 bg-white/90 backdrop-blur-sm card-hover overflow-hidden rounded-3xl group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-blue-50/50">
            <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Siswa Saya</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
              <Users className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
               <div className="h-9 w-16 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              <div className="text-4xl font-extrabold text-slate-800 tabular-nums">{data?.stats?.students || 0}</div>
            )}
            <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1.5 uppercase tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Di {data?.stats?.className || "Kelompok"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg shadow-emerald-100/50 bg-white/90 backdrop-blur-sm card-hover overflow-hidden rounded-3xl group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-emerald-50/50">
            <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Penilaian Selesai</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
              <ListChecks className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
               <div className="h-9 w-16 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              <div className="text-4xl font-extrabold text-slate-800 tabular-nums">{data?.stats?.progressThisMonth || 0}</div>
            )}
            <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wide">Bulan ini</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-amber-100/50 bg-white/90 backdrop-blur-sm card-hover overflow-hidden rounded-3xl group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-amber-50/50">
            <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Jadwal Hari Ini</CardTitle>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300">
              <Calendar className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-lg font-extrabold text-slate-800 tracking-tight">Sentra Bermain</div>
            <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1.5 uppercase tracking-wide">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              08:00 - 10:00 WIB
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
         {/* Guide Card */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/90 backdrop-blur-sm rounded-3xl">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2 italic">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Langkah Penggunaan Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              { step: "1", text: <>Pergi ke halaman <strong className="text-slate-800 underline decoration-blue-200 decoration-2">Siswa Saya</strong> untuk melihat daftar murid di kelompok Anda.</>, color: "bg-blue-50 text-blue-600 border-blue-100" },
              { step: "2", text: <>Gunakan menu <strong className="text-slate-800 underline decoration-emerald-200 decoration-2">Penilaian</strong> untuk memberikan skor/nilai perkembangan pada siswa sesuai kriteria SAW.</>, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
              { step: "3", text: <>Analisis peringkat perkembangan siswa pada halaman <strong className="text-slate-800 underline decoration-amber-200 decoration-2">Hasil SAW</strong>.</>, color: "bg-amber-50 text-amber-600 border-amber-100" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center text-sm font-black shrink-0 border shadow-sm`}>
                  {item.step}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity for Teacher */}
         <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Aktivitas Terakhir di Kelas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-6 animate-pulse space-y-3">
                    <div className="h-4 bg-slate-100 w-1/2 rounded" />
                    <div className="h-3 bg-slate-50 w-3/4 rounded" />
                  </div>
                ))
              ) : data?.activities?.length > 0 ? (
                data.activities.map((activity, idx) => (
                  <div key={idx} className="p-5 hover:bg-slate-50 transition-all flex justify-between items-center group">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{activity.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{formatTime(activity.time)}</p>
                      <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 mt-1 inline-block">FIXED</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text center">Belum Ada Input Penilaian</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
