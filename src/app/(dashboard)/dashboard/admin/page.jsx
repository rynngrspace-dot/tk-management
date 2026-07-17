"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, BarChart3, TrendingUp, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(json => {
        setData(json)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Dashboard fetch error:", err)
        setIsLoading(false)
      })
  }, [])

  const statsList = [
    {
      title: "Total Siswa",
      value: data?.stats?.students ?? 0,
      icon: Users,
      gradient: "gradient-blue",
      shadowColor: "shadow-blue-500/20",
      change: "Data Sekolah Real-time",
    },
    {
      title: "Total Guru",
      value: data?.stats?.teachers ?? 0,
      icon: GraduationCap,
      gradient: "gradient-emerald",
      shadowColor: "shadow-emerald-500/20",
      change: "Staff Aktif",
    },
    {
      title: "Total Kelas",
      value: data?.stats?.classes ?? 0,
      icon: BookOpen,
      gradient: "gradient-amber",
      shadowColor: "shadow-amber-500/20",
      change: "Kelompok Aktif",
    },
  ]
  const formatTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }

  const activityConfig = {
    assessment: { icon: BarChart3, color: "bg-indigo-50 border-indigo-100 text-indigo-600", activeColor: "group-hover:bg-indigo-600" },
    student: { icon: GraduationCap, color: "bg-emerald-50 border-emerald-100 text-emerald-600", activeColor: "group-hover:bg-emerald-600" },
    class: { icon: BookOpen, color: "bg-amber-50 border-amber-100 text-amber-600", activeColor: "group-hover:bg-amber-600" },
    teacher: { icon: Users, color: "bg-rose-50 border-rose-100 text-rose-600", activeColor: "group-hover:bg-rose-600" },
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-800 uppercase italic">Dashboard Admin</h2>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Sistem Monitoring TK Al Ishlah</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {statsList.map((stat, index) => (
          <div
            key={index}
            className={`${stat.gradient} rounded-2xl p-6 text-white shadow-lg ${stat.shadowColor} card-hover relative overflow-hidden transition-all duration-300 group`}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full transition-transform group-hover:scale-125 duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">{stat.title}</p>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              {isLoading ? (
                <div className="h-10 w-24 bg-white/20 animate-pulse rounded-lg mb-2" />
              ) : (
                <div className="text-4xl font-black mb-1 tabular-nums tracking-tight">{stat.value}</div>
              )}
              <div className="flex items-center gap-1.5 text-[9px] font-black text-white/70 uppercase tracking-wider">
                <div className="w-1 h-1 rounded-full bg-white/40" />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-0 shadow-2xl shadow-indigo-500/5 bg-white/80 backdrop-blur-sm overflow-hidden rounded-[2rem]">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Statistik Perkembangan Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[340px] flex items-center justify-center border-2 border-dashed border-indigo-100/50 rounded-[1.5rem] bg-indigo-50/20 text-slate-400 flex-col gap-5">
               <div className="w-20 h-20 rounded-[1.5rem] bg-white flex items-center justify-center shadow-xl shadow-indigo-500/10 border border-indigo-50">
                <TrendingUp className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="text-center space-y-1">
                <span className="font-black text-slate-700 text-sm block uppercase tracking-wider">Visualisasi Segera Hadir</span>
                <span className="text-[11px] text-slate-400 font-medium px-6">Analisis algoritma SAW sedang diproses ke dalam grafik kurva perkembangan siswa.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-0 shadow-2xl shadow-indigo-500/5 bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-indigo-500" />
              Live Activity Log
            </CardTitle>
            <div className="px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
               <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Realtime</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="space-y-3.5">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse px-2">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100" />
                    <div className="flex-1 space-y-2 mt-1">
                      <div className="h-3 bg-slate-100 w-3/4 rounded-full" />
                      <div className="h-2 bg-slate-50 w-1/2 rounded-full" />
                    </div>
                  </div>
                ))
              ) : data?.activities?.length > 0 ? (
                data.activities.slice(0, 5).map((activity, idx) => {
                  const config = activityConfig[activity.type] || activityConfig.assessment;
                  const Icon = config.icon;
                  
                  return (
                    <div key={activity.id || idx} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group border border-transparent hover:border-indigo-50">
                      <div className={`w-11 h-11 rounded-2xl ${config.color} flex items-center justify-center shrink-0 border shadow-sm ${config.activeColor} group-hover:text-white transition-colors duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm font-black text-slate-800 truncate">{activity.name}</p>
                          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50/50 border border-indigo-100 px-2 py-0.5 rounded-lg uppercase tracking-tight shrink-0">{activity.context}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] font-bold text-slate-500 leading-none">{activity.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">oleh {activity.actor}</p>
                            <span className="text-[9px] text-slate-200">•</span>
                            <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1 italic opacity-70">
                              <Clock className="w-2.5 h-2.5" />
                              {formatTime(activity.time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/30 rounded-3xl border-2 border-dashed border-slate-100">
                  <AlertCircle className="w-10 h-10 opacity-10 mb-3" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-300">Belum ada aktivitas</p>
                </div>
              )}
              
              {!isLoading && data?.activities?.length > 0 && (
                <Link href="/dashboard/admin/activities" className="block w-full">
                  <button 
                    className="w-full py-3 mt-2 text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] hover:bg-indigo-50 rounded-2xl transition-all border border-dashed border-indigo-100 active:scale-95"
                  >
                    Lihat Semua Log Sistem
                  </button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
