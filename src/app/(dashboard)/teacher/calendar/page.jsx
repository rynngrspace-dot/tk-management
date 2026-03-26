"use client"
import { useState, useEffect } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardCheck, ListChecks, BarChart3 } from "lucide-react"
import { getMockData, getAvailableWeeks } from "@/lib/mock-data"
import Link from "next/link"

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1)
  const diff = date - start
  const oneWeek = 604800000
  return Math.ceil(((diff / oneWeek) + start.getDay() + 1) / 1)
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = (firstDay.getDay() + 6) % 7 // Monday = 0
  const days = []

  // Previous month padding
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, currentMonth: false })
  }
  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), currentMonth: true })
  }
  // Next month padding
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false })
    }
  }
  return days
}

export default function TeacherCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [attendanceDates, setAttendanceDates] = useState({})
  const [assessmentWeeks, setAssessmentWeeks] = useState([])
  const [teacherClassId, setTeacherClassId] = useState("")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const days = getMonthDays(year, month)
  const today = new Date()

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Guru"
    const data = getMockData()
    const weeks = getAvailableWeeks()
    setAssessmentWeeks(weeks.map(w => w.value))

    const teacher = data.teachers.find(t => t.name === name) || data.teachers[0]
    if (teacher) {
      setTeacherClassId(teacher.classId)
      // Build attendance lookup: { "2026-03-24": { hadir: 2, sakit: 1, ... } }
      const lookup = {}
      data.attendanceRecords
        .filter(r => r.teacherId === teacher.id)
        .forEach(r => {
          const summary = { hadir: 0, sakit: 0, izin: 0, alpha: 0 }
          r.records.forEach(rec => {
            if (summary[rec.status] !== undefined) summary[rec.status]++
          })
          lookup[r.date] = summary
        })
      setAttendanceDates(lookup)
    }
  }, [])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  const isToday = (d) => d.toDateString() === today.toDateString()

  const getDateString = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  const getWeekString = (d) => {
    const wn = getWeekNumber(d)
    return `${d.getFullYear()}-W${String(wn).padStart(2, "0")}`
  }

  const isAssessmentWeek = (d) => {
    return assessmentWeeks.includes(getWeekString(d))
  }

  const getDayAttendance = (d) => {
    return attendanceDates[getDateString(d)]
  }

  const isWeekend = (d) => {
    const day = d.getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-indigo-500/20">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Kalender Penilaian</h2>
            <p className="text-xs text-slate-500 mt-0.5">Jadwal penilaian mingguan dan rekap absensi harian</p>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">{MONTHS[month]} {year}</h3>
            <button onClick={goToday} className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold mt-0.5">
              Hari Ini
            </button>
          </div>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const att = getDayAttendance(day.date)
            const isAW = isAssessmentWeek(day.date)
            const weekend = isWeekend(day.date)

            return (
              <div
                key={idx}
                className={`min-h-[80px] p-1.5 rounded-xl border transition-all duration-100 ${
                  !day.currentMonth ? "opacity-30 border-transparent" :
                  isToday(day.date) ? "border-indigo-300 bg-indigo-50/50 shadow-sm" :
                  isAW && !weekend ? "border-indigo-100 bg-indigo-50/30" :
                  weekend ? "border-transparent bg-slate-50/50" :
                  "border-slate-100 hover:border-slate-200 hover:bg-slate-50/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-semibold ${
                    isToday(day.date) ? "text-indigo-600" :
                    !day.currentMonth ? "text-slate-300" :
                    weekend ? "text-slate-400" :
                    "text-slate-700"
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {isToday(day.date) && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-indigo-500 text-white font-bold">HARI INI</span>
                  )}
                </div>

                {/* Attendance dots */}
                {att && (
                  <div className="flex gap-0.5 flex-wrap mb-1">
                    {att.hadir > 0 && <span className="w-2 h-2 rounded-full bg-emerald-400" title={`Hadir: ${att.hadir}`} />}
                    {att.sakit > 0 && <span className="w-2 h-2 rounded-full bg-amber-400" title={`Sakit: ${att.sakit}`} />}
                    {att.izin > 0 && <span className="w-2 h-2 rounded-full bg-blue-400" title={`Izin: ${att.izin}`} />}
                    {att.alpha > 0 && <span className="w-2 h-2 rounded-full bg-rose-400" title={`Alpha: ${att.alpha}`} />}
                  </div>
                )}

                {/* Assessment week indicator */}
                {isAW && !weekend && day.currentMonth && day.date.getDay() === 1 && (
                  <span className="text-[8px] px-1 py-0.5 rounded bg-indigo-100 text-indigo-600 font-bold block w-fit">
                    📝 Nilai
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend + Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-4">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Legenda</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-emerald-400" /> Hadir
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-amber-400" /> Sakit
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-blue-400" /> Izin
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-full bg-rose-400" /> Alpha
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-200" /> Minggu Penilaian
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-4">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Aksi Cepat</p>
          <div className="space-y-2">
            <Link href="/teacher/attendance" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
              <ClipboardCheck className="w-4 h-4" /> Input Absensi Hari Ini
            </Link>
            <Link href="/teacher/assessment" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
              <ListChecks className="w-4 h-4" /> Input Nilai Minggu Ini
            </Link>
            <Link href="/teacher/progress" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors">
              <BarChart3 className="w-4 h-4" /> Lihat Progres Mingguan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
