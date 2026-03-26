"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, BarChart3, FileDown, X, ChevronLeft, ChevronRight } from "lucide-react"
import { getMockData, getAvailableWeeks, getAvailableMonths } from "@/lib/mock-data"
import { calculateSAW } from "@/lib/saw"
import { PrintReport } from "@/components/layout/PrintReport"

export default function TeacherProgressPage() {
  const [students, setStudents] = useState([])
  const [allWeeks, setAllWeeks] = useState([])
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState("")
  const [weeklyScores, setWeeklyScores] = useState({})
  const [className, setClassName] = useState("")
  const [showPrint, setShowPrint] = useState(false)

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Guru"
    const data = getMockData()
    const availableWeeks = getAvailableWeeks()
    const availableMonths = getAvailableMonths()
    setAllWeeks(availableWeeks)
    setMonths(availableMonths)

    // Default to latest month
    if (availableMonths.length > 0) setSelectedMonth(availableMonths[availableMonths.length - 1].value)

    const teacher = data.teachers.find(t => t.name === name) || data.teachers[0]
    if (teacher) {
      const cls = data.classes.find(c => c.id === teacher.classId)
      setClassName(cls ? cls.name : "")
      const teacherStudents = data.students.filter(s => s.classId === teacher.classId)
      setStudents(teacherStudents)

      const scoreMap = {}
      teacherStudents.forEach(s => { scoreMap[s.id] = {} })
      availableWeeks.forEach(w => {
        const results = calculateSAW(teacherStudents, data.criteria, data.assessments, w.value)
        results.forEach(r => {
          if (scoreMap[r.studentId]) scoreMap[r.studentId][w.value] = r.score
        })
      })
      setWeeklyScores(scoreMap)
    }
  }, [])

  // Filtered weeks for selected month
  const filteredWeeks = allWeeks.filter(w => w.monthKey === selectedMonth)
  const currentMonthObj = months.find(m => m.value === selectedMonth)
  const currentMonthIdx = months.findIndex(m => m.value === selectedMonth)

  const prevMonth = () => {
    if (currentMonthIdx > 0) setSelectedMonth(months[currentMonthIdx - 1].value)
  }
  const nextMonth = () => {
    if (currentMonthIdx < months.length - 1) setSelectedMonth(months[currentMonthIdx + 1].value)
  }

  const getWeekTrend = (studentId, weekIdx) => {
    if (weekIdx <= 0) return null
    const curr = weeklyScores[studentId]?.[filteredWeeks[weekIdx].value]
    const prev = weeklyScores[studentId]?.[filteredWeeks[weekIdx - 1].value]
    if (curr == null || prev == null) return null
    if (curr > prev) return "up"
    if (curr < prev) return "down"
    return "same"
  }

  const getMonthlyProgress = (studentId) => {
    if (filteredWeeks.length < 2) return null
    const first = weeklyScores[studentId]?.[filteredWeeks[0].value]
    const last = weeklyScores[studentId]?.[filteredWeeks[filteredWeeks.length - 1].value]
    if (first == null || last == null) return null
    const diff = last - first
    const direction = diff > 0 ? "up" : diff < 0 ? "down" : "same"
    const label = direction === "up" ? "Berkembang Baik" : direction === "down" ? "Perlu Perhatian" : "Stabil"
    return { diff: diff.toFixed(1), direction, label }
  }

  const handleExportPDF = () => {
    setShowPrint(true)
    setTimeout(() => window.print(), 300)
  }

  return (
    <div className="space-y-6">
      {showPrint && (
        <PrintReport title="Laporan Progres Perkembangan Mingguan" subtitle={`${className} — ${currentMonthObj?.label || ""}`} show={showPrint}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-2 px-2 text-left font-bold">Nama</th>
                {filteredWeeks.map(w => (
                  <th key={w.value} className="py-2 px-2 text-center font-bold text-xs">{w.shortLabel}</th>
                ))}
                <th className="py-2 px-2 text-center font-bold">Perkembangan</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const progress = getMonthlyProgress(s.id)
                return (
                  <tr key={s.id} className="border-b border-slate-200">
                    <td className="py-2 px-2 font-medium">{s.name}</td>
                    {filteredWeeks.map(w => (
                      <td key={w.value} className="py-2 px-2 text-center">{weeklyScores[s.id]?.[w.value] ?? "-"}</td>
                    ))}
                    <td className="py-2 px-2 text-center font-bold">
                      {progress ? `${progress.label} (${progress.direction === "up" ? "+" : ""}${progress.diff})` : "-"}
                    </td>
                  </tr>
                )
              })}
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
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-indigo-500/20">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Progres Mingguan</h2>
            <p className="text-xs text-slate-500 mt-0.5">Perkembangan skor SAW siswa dari minggu ke minggu — {className}</p>
          </div>
        </div>
        <Button onClick={handleExportPDF} className="mt-4 sm:mt-0 gradient-coral text-white rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200 text-xs">
          <FileDown className="w-4 h-4 mr-1.5" /> Export PDF
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            disabled={currentMonthIdx <= 0}
            className={`p-2 rounded-xl transition-colors ${currentMonthIdx <= 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">{currentMonthObj?.label || "-"}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{filteredWeeks.length} minggu penilaian</p>
          </div>
          <button
            onClick={nextMonth}
            disabled={currentMonthIdx >= months.length - 1}
            className={`p-2 rounded-xl transition-colors ${currentMonthIdx >= months.length - 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="min-w-[160px] font-semibold text-xs uppercase tracking-wider text-slate-500">Siswa</TableHead>
              {filteredWeeks.map(w => (
                <TableHead key={w.value} className="text-center font-semibold text-xs uppercase tracking-wider text-slate-500 min-w-[100px]">
                  <div>{w.shortLabel}</div>
                  <div className="text-[10px] font-normal text-slate-400 normal-case">{w.label.match(/\((.+)\)/)?.[1] || ""}</div>
                </TableHead>
              ))}
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wider text-slate-500 min-w-[150px]">Perkembangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={filteredWeeks.length + 2} className="text-center py-12 text-slate-400">
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              students.map(student => {
                const progress = getMonthlyProgress(student.id)
                return (
                  <TableRow key={student.id} className="table-row-hover transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-sm text-slate-700 block">{student.name}</span>
                          <span className="text-[10px] text-slate-400">NIS: {student.nis}</span>
                        </div>
                      </div>
                    </TableCell>
                    {filteredWeeks.map((w, weekIdx) => {
                      const score = weeklyScores[student.id]?.[w.value]
                      const trend = getWeekTrend(student.id, weekIdx)
                      return (
                        <TableCell key={w.value} className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className={`text-sm font-bold ${
                              score >= 90 ? "text-emerald-600" : score >= 80 ? "text-blue-600" : score >= 70 ? "text-amber-600" : "text-slate-600"
                            }`}>
                              {score != null ? score : "-"}
                            </span>
                            {trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                            {trend === "down" && <TrendingDown className="w-3 h-3 text-rose-500" />}
                            {trend === "same" && <Minus className="w-3 h-3 text-slate-300" />}
                          </div>
                        </TableCell>
                      )
                    })}
                    <TableCell className="text-center">
                      {progress ? (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold ${
                          progress.direction === "up" ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50" :
                          progress.direction === "down" ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200/50" :
                          "bg-slate-50 text-slate-600 ring-1 ring-slate-200/50"
                        }`}>
                          {progress.direction === "up" ? <TrendingUp className="w-3.5 h-3.5" /> :
                           progress.direction === "down" ? <TrendingDown className="w-3.5 h-3.5" /> :
                           <Minus className="w-3.5 h-3.5" />}
                          {progress.label}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
