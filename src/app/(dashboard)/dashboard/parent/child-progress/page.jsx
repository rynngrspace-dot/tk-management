"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Calendar, BookOpen, Clock, AlertCircle, Loader2, Sparkles, HelpCircle } from "lucide-react"
import { toast } from "sonner"

export default function ChildProgressPage() {
  const [student, setStudent] = useState(null)
  const [criteria, setCriteria] = useState([])
  const [progressList, setProgressList] = useState([])
  const [filteredProgress, setFilteredProgress] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // 1. Fetch child profile
        const resStudent = await fetch("/api/students")
        if (!resStudent.ok) throw new Error("Gagal mengambil data anak")
        const studentData = await resStudent.json()
        if (studentData.length === 0) {
          setIsLoading(false)
          return
        }
        const child = studentData[0]
        setStudent(child)

        // 2. Fetch all criteria definitions
        const resCriteria = await fetch("/api/criteria")
        if (resCriteria.ok) {
          const criteriaData = await resCriteria.json()
          setCriteria(criteriaData)
        }

        // 3. Fetch weekly progress
        const resProgress = await fetch("/api/progress")
        if (resProgress.ok) {
          const progressData = await resProgress.json()
          // Sort descending
          const sorted = progressData.sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year
            const months = { "Januari": 1, "Februari": 2, "Maret": 3, "April": 4, "Mei": 5, "Juni": 6, "Juli": 7, "Agustus": 8, "September": 9, "Oktober": 10, "November": 11, "Desember": 12 }
            const monthB = months[b.month] || 0
            const monthA = months[a.month] || 0
            if (monthB !== monthA) return monthB - monthA
            return b.week - a.week
          })
          setProgressList(sorted)
          setFilteredProgress(sorted)
        }

      } catch (error) {
        toast.error("Gagal memuat data perkembangan")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters
  useEffect(() => {
    let result = progressList
    if (selectedMonth !== "all") {
      result = result.filter(p => p.month === selectedMonth)
    }
    if (selectedYear !== "all") {
      result = result.filter(p => p.year.toString() === selectedYear)
    }
    setFilteredProgress(result)
  }, [selectedMonth, selectedYear, progressList])

  const getScoreLabel = (score) => {
    const labels = {
      1: { code: "BB", name: "Belum Berkembang", color: "bg-red-50 text-red-600 border-red-200" },
      2: { code: "MB", name: "Mulai Berkembang", color: "bg-amber-50 text-amber-600 border-amber-200" },
      3: { code: "BSH", name: "Berkembang Sesuai Harapan", color: "bg-blue-50 text-blue-600 border-blue-200" },
      4: { code: "BSB", name: "Berkembang Sangat Baik", color: "bg-emerald-50 text-emerald-600 border-emerald-200" }
    }
    return labels[score] || { code: `${score}`, name: "Lainnya", color: "bg-slate-50 text-slate-600 border-slate-200" }
  }

  // Get unique months and years from progress list for filter dropdowns
  const uniqueMonths = Array.from(new Set(progressList.map(p => p.month)))
  const uniqueYears = Array.from(new Set(progressList.map(p => p.year.toString())))

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/80 rounded-3xl border border-dashed">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Akun Belum Dihubungkan</h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white/60 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-md shadow-emerald-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Detail Perkembangan Siswa</h2>
            <p className="text-xs text-slate-500 mt-0.5">Laporan historis mingguan berdasarkan aspek perkembangan kriteria</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px] rounded-xl bg-white">
              <SelectValue placeholder="Semua Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bulan</SelectItem>
              {uniqueMonths.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px] rounded-xl bg-white">
              <SelectValue placeholder="Semua Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {uniqueYears.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Grid: Left Timeline/Cards, Right Legend */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Progress List */}
        <div className="lg:col-span-2 space-y-6">
          {filteredProgress.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white/80 backdrop-blur-sm rounded-[2rem] border border-slate-100">
              <AlertCircle className="w-10 h-10 opacity-15 mb-3 text-indigo-500" />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">Tidak ada data progres ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter bulan atau tahun Anda</p>
            </div>
          ) : (
            filteredProgress.map((progress) => (
              <Card key={progress.id} className="border-0 shadow-xl shadow-indigo-500/5 bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="border-b border-slate-50 bg-slate-50/20 px-6 py-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">
                      Laporan Minggu ke-{progress.week}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                      {progress.month} {progress.year}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Updated: {new Date(progress.updatedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                  </span>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  {/* Scores Grid */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Penilaian Aspek Perkembangan:</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {criteria.map((crit) => {
                        const scoreObj = progress.assessments?.find(a => a.criteriaId === crit.id)
                        const scoreInfo = scoreObj ? getScoreLabel(scoreObj.score) : { code: "-", name: "Belum Dinilai", color: "bg-slate-50 text-slate-400 border-slate-100" }
                        
                        return (
                          <div key={crit.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100/80 bg-white">
                            <div className="min-w-0 pr-2">
                              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50/50 border border-indigo-100/60 px-2 py-0.5 rounded-md uppercase">
                                {crit.code}
                              </span>
                              <span className="text-xs font-bold text-slate-700 ml-2 truncate block sm:inline">{crit.name}</span>
                            </div>
                            <span className={`inline-flex items-center rounded-lg border px-2 py-1 text-[10px] font-bold ${scoreInfo.color} shrink-0`}>
                              {scoreInfo.code} - {scoreInfo.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Note block */}
                  <div className="pt-2 border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Catatan Guru Wali Kelas:</span>
                    <p className="text-slate-600 text-xs italic bg-slate-50/60 border border-slate-100/60 p-4 rounded-2xl leading-relaxed">
                      {progress.note || "Tidak ada catatan khusus untuk laporan mingguan ini."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right Column: Legend Explanation */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl shadow-indigo-500/5 bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                Legenda Penilaian TK
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Penilaian perkembangan anak usia dini menggunakan acuan kriteria standar nasional PAUD:
              </p>
              
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 bg-red-50 text-red-600 font-bold text-xs shrink-0">BB</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">Belum Berkembang (Skor 1)</p>
                    <p className="text-[10px] text-slate-400">Anak belum dapat melakukan tugas secara mandiri dan membutuhkan bantuan penuh dari guru.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-amber-200 bg-amber-50 text-amber-600 font-bold text-xs shrink-0">MB</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">Mulai Berkembang (Skor 2)</p>
                    <p className="text-[10px] text-slate-400">Anak sudah mulai melakukan tugas secara mandiri namun masih sesekali memerlukan contoh atau diingatkan.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 font-bold text-xs shrink-0">BSH</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">Berkembang Sesuai Harapan (Skor 3)</p>
                    <p className="text-[10px] text-slate-400">Anak sudah menunjukkan kemampuan mandiri secara teratur tanpa bimbingan langsung.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">BSB</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">Berkembang Sangat Baik (Skor 4)</p>
                    <p className="text-[10px] text-slate-400">Anak telah konsisten melakukan tugas secara mandiri bahkan dapat membantu teman sebayanya.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
