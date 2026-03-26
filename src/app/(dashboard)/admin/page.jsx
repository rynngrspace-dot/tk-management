"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, BarChart3, TrendingUp, Clock, AlertCircle } from "lucide-react"

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
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - " + date.toLocaleDateString();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard Admin</h2>
        <p className="text-sm text-slate-500 font-medium">Monitoring data Sistem Manajemen TK Terpadu</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {statsList.map((stat, index) => (
          <div
            key={index}
            className={`${stat.gradient} rounded-2xl p-6 text-white shadow-lg ${stat.shadowColor} card-hover relative overflow-hidden transition-all duration-300`}
          >
            {/* Decorative background circle */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-white/80 uppercase tracking-widest">{stat.title}</p>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {isLoading ? (
                <div className="h-10 w-24 bg-white/20 animate-pulse rounded-lg mb-2" />
              ) : (
                <div className="text-4xl font-extrabold mb-1 tabular-nums">{stat.value}</div>
              )}
              
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/70 uppercase">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Placeholder */}
        <Card className="col-span-4 border-0 shadow-md shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Statistik Perkembangan Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-indigo-100 rounded-2xl bg-indigo-50/20 text-slate-400 flex-col gap-4">
               <div className="w-16 h-16 rounded-3xl bg-indigo-100/50 flex items-center justify-center shadow-inner">
                <BarChart3 className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="text-center">
                <span className="font-bold text-slate-600 block mb-1">Visualisasi Segera Hadir</span>
                <span className="text-xs text-slate-400">Analisis tren nilai SAW sedang dikalibrasi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-3 border-0 shadow-md shadow-slate-200/50 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="space-y-5">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-100 w-3/4 rounded" />
                      <div className="h-2 bg-slate-50 w-1/2 rounded" />
                    </div>
                  </div>
                ))
              ) : data?.activities?.length > 0 ? (
                data.activities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group">
                    <div className={`w-10 h-10 rounded-xl bg-indigo-100/50 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0 border border-indigo-200/50`}>
                      {activity.name.charAt(0)}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-bold text-slate-700 truncate">{activity.name}</p>
                        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{activity.class}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{activity.action}</p>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        {formatTime(activity.time)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <AlertCircle className="w-8 h-8 opacity-20 mb-2" />
                  <p className="text-xs font-medium">Belum ada aktivitas hari ini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
