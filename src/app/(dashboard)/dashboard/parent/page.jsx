"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Users, Clock, Calendar, ArrowRight, Loader2, Sparkles, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const MONTHS_ORDER = { "Januari": 1, "Februari": 2, "Maret": 3, "April": 4, "Mei": 5, "Juni": 6, "Juli": 7, "Agustus": 8, "September": 9, "Oktober": 10, "November": 11, "Desember": 12 }

function sortPeriods(periods) {
  return [...periods].sort((a, b) => {
    const [monthA, yearA] = a.split(" ")
    const [monthB, yearB] = b.split(" ")
    const yrA = parseInt(yearA) || 0
    const yrB = parseInt(yearB) || 0
    if (yrB !== yrA) return yrB - yrA
    return (MONTHS_ORDER[monthB] || 0) - (MONTHS_ORDER[monthA] || 0)
  })
}

export default function ParentDashboardPage() {
  const [student, setStudent] = useState(null)
  const [allSawResults, setAllSawResults] = useState([])
  const [sortedPeriods, setSortedPeriods] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [recentProgress, setRecentProgress] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
        setStudent(studentData[0])

        // 2. Fetch ALL SAW results for child's class
        const resSaw = await fetch("/api/saw")
        if (resSaw.ok) {
          const sawResults = await resSaw.json()
          setAllSawResults(sawResults)

          const uniquePeriods = Array.from(new Set(sawResults.map(r => r.period)))
          const sorted = sortPeriods(uniquePeriods)
          setSortedPeriods(sorted)
          if (sorted.length > 0) setSelectedPeriod(sorted[0])
        }

        // 3. Fetch weekly progress reports
        const resProgress = await fetch("/api/progress")
        if (resProgress.ok) {
          const progressData = await resProgress.json()
          const sorted = progressData.sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year
            const mB = MONTHS_ORDER[b.month] || 0
            const mA = MONTHS_ORDER[a.month] || 0
            if (mB !== mA) return mB - mA
            return b.week - a.week
          })
          setRecentProgress(sorted.slice(0, 5))
        }

      } catch (error) {
        toast.error("Gagal memuat data dashboard")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Derived state for selected period
  const currentRankings = useMemo(() => {
    if (!selectedPeriod) return []
    return allSawResults.filter(r => r.period === selectedPeriod)
  }, [allSawResults, selectedPeriod])

  const myResult = useMemo(() => {
    if (!student) return null
    return currentRankings.find(r => r.studentId === student.id) || null
  }, [currentRankings, student])

  const myRank = useMemo(() => {
    if (!myResult) return "-"
    return currentRankings.findIndex(r => r.studentId === student.id) + 1
  }, [currentRankings, myResult, student])

  const isLatestPeriod = selectedPeriod === sortedPeriods[0]
  const currentPeriodIndex = sortedPeriods.indexOf(selectedPeriod)

  const goPrevPeriod = () => {
    if (currentPeriodIndex < sortedPeriods.length - 1) {
      setSelectedPeriod(sortedPeriods[currentPeriodIndex + 1])
    }
  }
  const goNextPeriod = () => {
    if (currentPeriodIndex > 0) {
      setSelectedPeriod(sortedPeriods[currentPeriodIndex - 1])
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/85 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-200">
        <Users className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">Akun Belum Dihubungkan</h3>
        <p className="text-sm text-slate-500 text-center max-w-sm mt-1">
          Hubungi pihak Administrator sekolah untuk menautkan akun Anda dengan data anak Anda.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              Halo, Orang Tua dari <span className="gradient-text">{student.name}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Pantau tumbuh kembang dan pencapaian anak Anda secara berkala</p>
          </div>
        </div>
        <Link href="/dashboard/parent/child-progress" className="w-full md:w-auto">
          <Button className="w-full gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
            Lihat Progres Lengkap <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Child Profile Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden transition-all duration-300 group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full transition-transform group-hover:scale-125 duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em]">Profil Siswa</p>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-black truncate">{student.name}</div>
            <p className="text-xs text-indigo-100 mt-1">NIS: {student.nis}</p>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-indigo-100/70 uppercase tracking-wider mt-4">
              <div className="w-1 h-1 rounded-full bg-white/40" />
              Kelas Kelompok {student.classId || "Belum Ditugaskan"}
            </div>
          </div>
        </div>

        {/* SAW Rank Card — reflects selectedPeriod */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden transition-all duration-300 group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full transition-transform group-hover:scale-125 duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-amber-100 uppercase tracking-[0.2em]">Peringkat SAW Kelas</p>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black mb-1">
              {myResult ? (
                <>Rank {myRank} <span className="text-sm font-normal text-amber-100">dari {currentRankings.length} siswa</span></>
              ) : (
                <span className="text-xl">Belum Tersedia</span>
              )}
            </div>
            <p className="text-xs text-amber-100">Status: {myResult?.status || "Belum Dihitung"}</p>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-100/70 uppercase tracking-wider mt-2.5">
              <div className="w-1 h-1 rounded-full bg-white/40" />
              Periode: {selectedPeriod || "-"}
              {isLatestPeriod && <span className="ml-1 text-amber-200 normal-case font-semibold">(Terbaru)</span>}
            </div>
          </div>
        </div>

        {/* Status Perkembangan */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden transition-all duration-300 group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full transition-transform group-hover:scale-125 duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em]">Evaluasi Guru</p>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-black mb-1">Progres Aktif</div>
            <p className="text-xs text-emerald-100">Laporan mingguan teratur di-update oleh Wali Kelas</p>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-100/70 uppercase tracking-wider mt-4">
              <div className="w-1 h-1 rounded-full bg-white/40" />
              {recentProgress.length} Laporan Tersedia
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Rankings Leaderboard Table */}
        <Card className="lg:col-span-4 border-0 shadow-2xl shadow-indigo-500/5 bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4">
            <div className="flex flex-col gap-3">
              <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-500" />
                Peringkat Hasil Analisis SAW Kelas
              </CardTitle>

              {/* Period Selector */}
              {sortedPeriods.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrevPeriod}
                    disabled={currentPeriodIndex >= sortedPeriods.length - 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>

                  <div className="flex gap-1.5 flex-wrap">
                    {sortedPeriods.map(p => (
                      <button
                        key={p}
                        onClick={() => setSelectedPeriod(p)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                          selectedPeriod === p
                            ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {p}
                        {p === sortedPeriods[0] && <span className="ml-1 opacity-70">✦</span>}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goNextPeriod}
                    disabled={currentPeriodIndex <= 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {currentRankings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/30 rounded-3xl border-2 border-dashed border-slate-100">
                <Award className="w-10 h-10 opacity-10 mb-3" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-300">Belum ada data peringkat</p>
                <p className="text-[10px] text-slate-400 mt-1">Metode SAW belum dihitung untuk periode ini</p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100/80 overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="p-3 text-xs font-bold uppercase text-slate-500 w-12 text-center">Rank</th>
                      <th className="p-3 text-xs font-bold uppercase text-slate-500">Nama Siswa</th>
                      <th className="p-3 text-xs font-bold uppercase text-slate-500 w-24 text-center">Skor SAW</th>
                      <th className="p-3 text-xs font-bold uppercase text-slate-500">Status Perkembangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRankings.map((result, idx) => {
                      const isMyChild = result.studentId === student.id
                      const rankNum = idx + 1
                      return (
                        <tr
                          key={result.id}
                          className={`border-b border-slate-50 transition-colors ${isMyChild
                              ? "bg-indigo-50/50 hover:bg-indigo-50/70 font-semibold"
                              : "hover:bg-slate-50/50"
                            }`}
                        >
                          <td className="p-3 text-center text-sm">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold ${rankNum === 1
                                ? "bg-amber-100 text-amber-700"
                                : rankNum === 2
                                  ? "bg-slate-100 text-slate-700"
                                  : rankNum === 3
                                    ? "bg-orange-100 text-orange-700"
                                    : "text-slate-500"
                              }`}>
                              {rankNum}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-slate-700">
                            <div className="flex items-center gap-2">
                              <span>{result.student?.name}</span>
                              {isMyChild && (
                                <span className="inline-flex items-center rounded bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5">
                                  Anak Anda
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-sm text-slate-700 text-center font-mono">
                            {result.totalScore.toFixed(3)}
                          </td>
                          <td className="p-3 text-sm">
                            <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold border ${result.status.includes("Sangat Baik")
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : result.status.includes("Harapan")
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : result.status.includes("Mulai")
                                    ? "bg-amber-50 text-amber-700 border-amber-100"
                                    : "bg-red-50 text-red-700 border-red-100"
                              }`}>
                              {result.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Weekly Progress Timeline */}
        <Card className="lg:col-span-3 border-0 shadow-2xl shadow-indigo-500/5 bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-indigo-500" />
              Laporan Perkembangan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {recentProgress.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/30 rounded-3xl border-2 border-dashed border-slate-100">
                <Calendar className="w-10 h-10 opacity-10 mb-3" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-300">Belum ada laporan</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
                {recentProgress.map((progress, idx) => {
                  return (
                    <div key={progress.id || idx} className="relative group">
                      <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-indigo-500 shadow-md" />
                      <div className="bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl p-4 transition-all duration-300 shadow-sm">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-slate-800">
                            Minggu {progress.week}
                          </span>
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                            {progress.month}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] italic bg-white p-2.5 rounded-xl border border-slate-50 leading-relaxed line-clamp-3">
                          {progress.note || "Tidak ada catatan."}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
