"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart3, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Clock, 
  ArrowLeft, 
  Search,
  Filter,
  AlertCircle,
  FileText
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    fetch("/api/admin/activities")
      .then(res => res.json())
      .then(data => {
        setActivities(data)
        setFilteredActivities(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch activities:", err)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = activities
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.action.toLowerCase().includes(query) ||
        a.actor.toLowerCase().includes(query) ||
        a.context.toLowerCase().includes(query)
      )
    }

    if (filterType !== "all") {
      result = result.filter(a => a.type === filterType)
    }

    setFilteredActivities(result)
  }, [searchQuery, filterType, activities])

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const activityConfig = {
    assessment: { icon: BarChart3, color: "bg-indigo-50 border-indigo-100 text-indigo-600", activeColor: "bg-indigo-600" },
    student: { icon: GraduationCap, color: "bg-emerald-50 border-emerald-100 text-emerald-600", activeColor: "bg-emerald-600" },
    class: { icon: BookOpen, color: "bg-amber-50 border-amber-100 text-amber-600", activeColor: "bg-amber-600" },
    teacher: { icon: Users, color: "bg-rose-50 border-rose-100 text-rose-600", activeColor: "bg-rose-600" },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all">
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase italic">Log Aktivitas Sistem</h1>
            <p className="text-sm text-slate-500 font-medium">Rekaman seluruh perubahan data di TK Al Islah</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Real-time Monitoring</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari aktivitas, nama, atau aktor..." 
            className="pl-11 h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select 
            className="h-12 rounded-2xl border-slate-100 bg-white px-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Semua Tipe</option>
            <option value="assessment">Penilaian</option>
            <option value="student">Siswa</option>
            <option value="class">Kelompok</option>
            <option value="teacher">Staf/Guru</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <Card className="border-0 shadow-2xl shadow-indigo-500/5 bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16">Tipe</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aktivitas</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subjek</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Context</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-5"><div className="w-8 h-8 rounded-xl bg-slate-100" /></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-100 w-48 rounded" /></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-50 w-32 rounded" /></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-50 w-16 rounded" /></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-50 w-24 rounded" /></td>
                    </tr>
                  ))
                ) : filteredActivities.length > 0 ? (
                  filteredActivities.map((activity, idx) => {
                    const config = activityConfig[activity.type] || activityConfig.assessment;
                    const Icon = config.icon;
                    
                    return (
                      <tr key={activity.id || idx} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                        <td className="px-8 py-5">
                          <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-0.5">
                            <p className="text-sm font-black text-slate-800">{activity.action}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Oleh:</span>
                              <span className="text-[10px] font-bold text-slate-600">{activity.actor}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-extrabold text-slate-700">{activity.name}</p>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/50 uppercase">
                            {activity.context}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{formatTime(activity.time)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-32">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6">
                          <FileText className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Tidak ada log ditemukan</h3>
                        <p className="text-sm text-slate-500 font-medium">Coba ubah kata kunci pencarian atau filter tipe</p>
                        <Button 
                          variant="ghost" 
                          onClick={() => {setSearchQuery(""); setFilterType("all")}}
                          className="mt-4 text-indigo-500 hover:text-indigo-600 font-black uppercase text-[10px] tracking-widest"
                        >
                          Reset Filter
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {!isLoading && filteredActivities.length > 0 && (
        <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.3em] py-4">
          Menampilkan {filteredActivities.length} Aktivitas Terbaru
        </p>
      )}
    </div>
  )
}
