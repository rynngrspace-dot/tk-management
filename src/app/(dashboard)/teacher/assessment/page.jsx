"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ListChecks, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from "lucide-react"
import { getMockData, getAvailableWeeks, getAvailableMonths } from "@/lib/mock-data"
import { toast } from "sonner"

export default function TeacherAssessmentPage() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [criteria, setCriteria] = useState([])
  const [allAssessments, setAllAssessments] = useState([])
  const [scores, setScores] = useState({})
  const [selectedWeek, setSelectedWeek] = useState("")
  const [allWeeks, setAllWeeks] = useState([])
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState("")

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Guru"
    const data = getMockData()
    const availableWeeks = getAvailableWeeks()
    const availableMonths = getAvailableMonths()
    setAllWeeks(availableWeeks)
    setMonths(availableMonths)

    const teacher = data.teachers.find(t => t.name === name) || data.teachers[0]
    if (teacher) {
      const teacherStudents = data.students.filter(s => s.classId === teacher.classId)
      setStudents(teacherStudents)
      setClasses(data.classes)
      setCriteria(data.criteria)
      setAllAssessments(data.assessments)

      // Default to latest month and latest week
      const latestMonth = availableMonths.length > 0 ? availableMonths[availableMonths.length - 1] : null
      if (latestMonth) {
        setSelectedMonth(latestMonth.value)
        const latestWeek = latestMonth.weeks[latestMonth.weeks.length - 1].value
        setSelectedWeek(latestWeek)
        loadScoresForWeek(latestWeek, teacherStudents, data.criteria, data.assessments)
      }
    }
  }, [])

  const loadScoresForWeek = (week, studs, crit, allAss) => {
    const s = studs || students
    const c = crit || criteria
    const a = allAss || allAssessments
    const weekAssessments = a.filter(ass => ass.week === week)
    const initialScores = {}
    s.forEach(student => {
      initialScores[student.id] = {}
      const existing = weekAssessments.find(ass => ass.studentId === student.id)
      c.forEach(cr => {
        initialScores[student.id][cr.id] = existing?.scores?.[cr.id] || ""
      })
    })
    setScores(initialScores)
  }

  const handleMonthChange = (monthKey) => {
    setSelectedMonth(monthKey)
    const month = months.find(m => m.value === monthKey)
    if (month && month.weeks.length > 0) {
      const firstWeek = month.weeks[0].value
      setSelectedWeek(firstWeek)
      loadScoresForWeek(firstWeek)
    }
  }

  const handleWeekChange = (week) => {
    setSelectedWeek(week)
    loadScoresForWeek(week)
  }

  const handleScoreChange = (studentId, criteriaId, value) => {
    let val = parseInt(value)
    if (isNaN(val)) val = ""
    if (val !== "" && val < 0) val = 0
    if (val > 100) val = 100
    setScores(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [criteriaId]: val }
    }))
  }

  const handleSave = () => {
    const weekObj = allWeeks.find(w => w.value === selectedWeek)
    toast.success(`Penilaian ${weekObj?.label || selectedWeek} berhasil disimpan`)
  }

  const getScoreColor = (val) => {
    if (val === "" || val === undefined) return ""
    if (val >= 80) return "border-emerald-300 bg-emerald-50/50 text-emerald-700"
    if (val >= 60) return "border-blue-300 bg-blue-50/50 text-blue-700"
    if (val >= 40) return "border-amber-300 bg-amber-50/50 text-amber-700"
    return "border-rose-300 bg-rose-50/50 text-rose-700"
  }

  const getPrevWeekTrend = (studentId, criteriaId) => {
    const weekIdx = allWeeks.findIndex(w => w.value === selectedWeek)
    if (weekIdx <= 0) return null
    const prevWeek = allWeeks[weekIdx - 1].value
    const prevAssessment = allAssessments.find(a => a.week === prevWeek && a.studentId === studentId)
    const currentVal = scores[studentId]?.[criteriaId]
    const prevVal = prevAssessment?.scores?.[criteriaId]
    if (currentVal === "" || currentVal === undefined || !prevVal) return null
    if (currentVal > prevVal) return "up"
    if (currentVal < prevVal) return "down"
    return "same"
  }

  // Weeks for selected month only
  const monthWeeks = allWeeks.filter(w => w.monthKey === selectedMonth)
  const currentMonthObj = months.find(m => m.value === selectedMonth)
  const currentMonthIdx = months.findIndex(m => m.value === selectedMonth)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center shadow-md shadow-orange-500/20">
            <ListChecks className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Penilaian Perkembangan</h2>
            <p className="text-xs text-slate-500 mt-0.5">Masukkan skor (0-100) per minggu untuk setiap aspek kriteria</p>
          </div>
        </div>
        <Button className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" /> Simpan Penilaian
        </Button>
      </div>

      {/* Month + Week Selector Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { if (currentMonthIdx > 0) handleMonthChange(months[currentMonthIdx - 1].value) }}
              disabled={currentMonthIdx <= 0}
              className={`p-1.5 rounded-lg transition-colors ${currentMonthIdx <= 0 ? "text-slate-300" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-slate-800 min-w-[140px] text-center">
              {currentMonthObj?.label || "-"}
            </span>
            <button
              onClick={() => { if (currentMonthIdx < months.length - 1) handleMonthChange(months[currentMonthIdx + 1].value) }}
              disabled={currentMonthIdx >= months.length - 1}
              className={`p-1.5 rounded-lg transition-colors ${currentMonthIdx >= months.length - 1 ? "text-slate-300" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          {/* Week Dropdown */}
          <div className="w-full sm:w-72">
            <Select value={selectedWeek} onValueChange={handleWeekChange}>
              <SelectTrigger className="rounded-xl bg-white border-slate-200 shadow-sm">
                <SelectValue placeholder="Pilih Minggu" />
              </SelectTrigger>
              <SelectContent>
                {monthWeeks.map(w => (
                  <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 ml-auto">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> Berkembang
            <TrendingDown className="w-3 h-3 text-rose-500 ml-1.5" /> Menurun
            <Minus className="w-3 h-3 text-slate-400 ml-1.5" /> Stabil
          </div>
        </div>
      </div>

      {/* Score Legend */}
      <div className="flex flex-wrap gap-2 px-1">
        {[
          { label: "Sangat Baik (80-100)", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
          { label: "Baik (60-79)", color: "bg-blue-50 text-blue-600 border-blue-200" },
          { label: "Cukup (40-59)", color: "bg-amber-50 text-amber-600 border-amber-200" },
          { label: "Perlu Perhatian (0-39)", color: "bg-rose-50 text-rose-600 border-rose-200" },
        ].map((item, i) => (
          <span key={i} className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-semibold border ${item.color}`}>
            {item.label}
          </span>
        ))}
      </div>

      {/* Assessment Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="min-w-[160px] font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Siswa</TableHead>
              {criteria.map(c => (
                <TableHead key={c.id} className="text-center min-w-[120px]">
                  <div className="font-semibold text-xs uppercase tracking-wider text-slate-500">{c.name}</div>
                  <span className="text-[10px] font-normal text-slate-400">({c.id})</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={criteria.length + 1} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <ListChecks className="w-8 h-8 text-slate-300" />
                    <span>Tidak ada siswa untuk dinilai</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map(student => (
                <TableRow key={student.id} className="table-row-hover transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-sm text-slate-700 block">{student.name}</span>
                        <span className="text-[10px] text-slate-400">Kelompok {student.classId} • NIS: {student.nis}</span>
                      </div>
                    </div>
                  </TableCell>
                  {criteria.map(c => {
                    const val = scores[student.id]?.[c.id]
                    const trend = getPrevWeekTrend(student.id, c.id)
                    return (
                      <TableCell key={c.id} className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number"
                            min="0" max="100"
                            className={`text-center h-9 w-20 rounded-lg font-semibold text-sm transition-all duration-200 ${getScoreColor(val)}`}
                            value={val ?? ""}
                            onChange={(e) => handleScoreChange(student.id, c.id, e.target.value)}
                            placeholder="—"
                          />
                          {trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                          {trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          {trend === "same" && <Minus className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
