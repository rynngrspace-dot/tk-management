"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Trophy, FileDown, X } from "lucide-react"
import { getMockData, getAvailableWeeks } from "@/lib/mock-data"
import { calculateSAW } from "@/lib/saw"
import { PrintReport } from "@/components/layout/PrintReport"

export default function TeacherSAWResultsPage() {
  const [results, setResults] = useState([])
  const [className, setClassName] = useState("")
  const [criteria, setCriteria] = useState([])
  const [selectedWeek, setSelectedWeek] = useState("")
  const [weeks, setWeeks] = useState([])
  const [showPrint, setShowPrint] = useState(false)

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Guru"
    const data = getMockData()
    const availableWeeks = getAvailableWeeks()
    setCriteria(data.criteria)
    setWeeks(availableWeeks)

    const teacher = data.teachers.find(t => t.name === name) || data.teachers[0]

    if (teacher) {
      const cls = data.classes.find(c => c.id === teacher.classId)
      setClassName(cls ? cls.name : "Tanpa Kelompok")

      const latestWeek = availableWeeks.length > 0 ? availableWeeks[availableWeeks.length - 1].value : ""
      setSelectedWeek(latestWeek)
      const fullResults = calculateSAW(data.students, data.criteria, data.assessments, latestWeek)
      const teacherClassResults = fullResults.filter(r => r.classId === teacher.classId)
      setResults(teacherClassResults)
    }
  }, [])

  const handleWeekChange = (week) => {
    setSelectedWeek(week)
    const name = localStorage.getItem("userName") || "Guru"
    const data = getMockData()
    const teacher = data.teachers.find(t => t.name === name) || data.teachers[0]
    const fullResults = calculateSAW(data.students, data.criteria, data.assessments, week)
    const teacherClassResults = fullResults.filter(r => r.classId === teacher.classId)
    setResults(teacherClassResults)
  }

  const finalDisplay = results.map((r, idx) => ({ ...r, displayRank: idx + 1 }))
  const maxScore = finalDisplay.length > 0 ? Math.max(...finalDisplay.map(r => Number(r.score))) : 1

  const getRankStyle = (rank) => {
    if (rank === 1) return { bg: "bg-gradient-to-r from-amber-400 to-yellow-500", text: "text-white", shadow: "shadow-amber-400/30" }
    if (rank === 2) return { bg: "bg-gradient-to-r from-slate-300 to-slate-400", text: "text-white", shadow: "shadow-slate-400/30" }
    if (rank === 3) return { bg: "bg-gradient-to-r from-amber-600 to-orange-700", text: "text-white", shadow: "shadow-orange-400/30" }
    return null
  }

  const handleExportPDF = () => {
    setShowPrint(true)
    setTimeout(() => window.print(), 300)
  }

  return (
    <div className="space-y-6">
      {/* Print Report Overlay */}
      {showPrint && (
        <PrintReport
          title="Laporan Hasil Perhitungan SAW"
          subtitle={`Peringkat Perkembangan Siswa — ${className}`}
          show={showPrint}
        >
          <div className="mb-4 text-sm text-slate-600">
            <p><strong>Metode:</strong> Simple Additive Weighting (SAW)</p>
            <p><strong>Kelompok:</strong> {className}</p>
            <p><strong>Jumlah Siswa:</strong> {finalDisplay.length}</p>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-2 px-3 text-left font-bold">Peringkat</th>
                <th className="py-2 px-3 text-left font-bold">NIS</th>
                <th className="py-2 px-3 text-left font-bold">Nama Siswa</th>
                <th className="py-2 px-3 text-right font-bold">Skor Akhir</th>
              </tr>
            </thead>
            <tbody>
              {finalDisplay.map(row => (
                <tr key={row.studentId} className="border-b border-slate-200">
                  <td className="py-2 px-3 font-bold">{row.displayRank}</td>
                  <td className="py-2 px-3">{row.nis}</td>
                  <td className="py-2 px-3 font-medium">{row.name}</td>
                  <td className="py-2 px-3 text-right font-bold">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowPrint(false)} className="print:hidden mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors flex items-center gap-2 mx-auto">
            <X className="w-4 h-4" /> Tutup Preview
          </button>
        </PrintReport>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Hasil Perhitungan SAW</h2>
            <p className="text-xs text-slate-500 mt-0.5">Peringkat perkembangan siswa di <strong className="text-slate-700">{className}</strong></p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-2">
          <div className="w-72">
            <Select value={selectedWeek} onValueChange={handleWeekChange}>
              <SelectTrigger className="rounded-xl bg-white/80 border-white/60 shadow-sm text-xs">
                <SelectValue placeholder="Pilih Minggu" />
              </SelectTrigger>
              <SelectContent>
                {weeks.map(w => (
                  <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExportPDF} className="gradient-coral text-white rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200 text-xs">
            <FileDown className="w-4 h-4 mr-1.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 space-y-4">
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="w-20 text-center font-semibold text-xs uppercase tracking-wider text-slate-500">Peringkat</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">NIS</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Siswa</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Skor Akhir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalDisplay.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Calculator className="w-8 h-8 text-slate-300" />
                      <span>Tidak ada data penilaian</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                finalDisplay.map((row) => {
                  const rankStyle = getRankStyle(row.displayRank)
                  return (
                    <TableRow key={row.studentId} className={`table-row-hover transition-colors ${row.displayRank <= 3 ? "bg-amber-50/20" : ""}`}>
                      <TableCell className="text-center">
                        {rankStyle ? (
                          <div className={`mx-auto w-9 h-9 rounded-xl ${rankStyle.bg} ${rankStyle.text} flex items-center justify-center font-bold text-sm shadow-md ${rankStyle.shadow}`}>
                            {row.displayRank === 1 ? <Trophy className="w-4 h-4" /> : row.displayRank}
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-slate-400">{row.displayRank}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-500 font-mono text-sm">{row.nis}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${row.displayRank <= 3 ? 'gradient-emerald' : 'bg-slate-100'} flex items-center justify-center text-xs font-bold ${row.displayRank <= 3 ? 'text-white shadow-sm' : 'text-slate-500'}`}>
                            {row.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-700">{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${row.displayRank <= 3 ? 'gradient-emerald' : 'bg-slate-300'}`}
                              style={{ width: `${(Number(row.score) / maxScore) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold min-w-[48px] text-right ${row.displayRank <= 3 ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {row.score}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
