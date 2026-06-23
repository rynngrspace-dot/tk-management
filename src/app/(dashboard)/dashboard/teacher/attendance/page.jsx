"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardCheck, Save, CheckCircle2, XCircle, AlertCircle, MinusCircle, Calendar } from "lucide-react"
import { getMockData } from "@/lib/mock-data"
import { toast } from "sonner"

const STATUS_OPTIONS = [
  { value: "hadir", label: "Hadir", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-200", activeColor: "bg-emerald-500 text-white border-emerald-500" },
  { value: "sakit", label: "Sakit", icon: AlertCircle, color: "text-amber-600 bg-amber-50 border-amber-200", activeColor: "bg-amber-500 text-white border-amber-500" },
  { value: "izin", label: "Izin", icon: MinusCircle, color: "text-blue-600 bg-blue-50 border-blue-200", activeColor: "bg-blue-500 text-white border-blue-500" },
  { value: "alpha", label: "Alpha", icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-200", activeColor: "bg-rose-500 text-white border-rose-500" },
]

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState([])
  const [className, setClassName] = useState("")
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [attendance, setAttendance] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Profile
        const resProf = await fetch("/api/profile")
        if (!resProf.ok) throw new Error("Gagal mengambil profil")
        const profile = await resProf.json()

        if (profile.classId) {
          setClassName(profile.class?.name || "Kelas Tidak Dikenal")

          // 2. Fetch Real Students
          const resStudents = await fetch("/api/students")
          if (!resStudents.ok) throw new Error("Gagal mengambil data siswa")
          const dataStudents = await resStudents.json()
          setStudents(dataStudents)

          // 3. Initialize attendance (Mocking existing records for now as API doesn't exist yet)
          const initial = {}
          dataStudents.forEach(s => {
            initial[s.id] = ""
          })
          setAttendance(initial)
        } else {
          setClassName("Belum Ditugaskan")
          setStudents([])
        }
      } catch (error) {
        console.error(error)
        toast.error("Gagal memuat data absensi")
      }
    }

    fetchData()
  }, [selectedDate])

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? "" : status
    }))
  }

  const handleSave = () => {
    const unfilledStudents = students.filter(s => !attendance[s.id])
    if (unfilledStudents.length > 0) {
      toast.error(`Masih ada ${unfilledStudents.length} siswa belum diabsen!`)
      return
    }
    toast.success(`Absensi tanggal ${selectedDate} berhasil disimpan`)
    console.log("Saved attendance:", { date: selectedDate, attendance })
  }

  // Summary counts
  const summary = {
    hadir: Object.values(attendance).filter(v => v === "hadir").length,
    sakit: Object.values(attendance).filter(v => v === "sakit").length,
    izin: Object.values(attendance).filter(v => v === "izin").length,
    alpha: Object.values(attendance).filter(v => v === "alpha").length,
    belum: Object.values(attendance).filter(v => !v).length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-md shadow-emerald-500/20">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Absensi Siswa</h2>
            <p className="text-xs text-slate-500 mt-0.5">Catat kehadiran siswa di <strong className="text-slate-700">{className}</strong></p>
          </div>
        </div>
        <Button className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" /> Simpan Absensi
        </Button>
      </div>

      {/* Date Picker & Summary */}
      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-4">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
            <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
            Tanggal
          </label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl bg-slate-50/80"
          />
        </div>
        {STATUS_OPTIONS.map(opt => (
          <Card key={opt.value} className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${opt.color} border`}>
                <opt.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{summary[opt.value]}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{opt.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5">
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500 w-16">No.</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Siswa</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500 text-center" colSpan={4}>Status Kehadiran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardCheck className="w-8 h-8 text-slate-300" />
                      <span>Tidak ada siswa</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, idx) => (
                  <TableRow key={student.id} className="table-row-hover transition-colors">
                    <TableCell className="font-semibold text-slate-400 text-sm">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">

                        <div>
                          <span className="font-medium text-slate-700 text-sm">{student.name}</span>
                          <p className="text-[10px] text-slate-400">{student.nis}</p>
                        </div>
                      </div>
                    </TableCell>
                    {STATUS_OPTIONS.map(opt => {
                      const isActive = attendance[student.id] === opt.value
                      return (
                        <TableCell key={opt.value} className="text-center p-2">
                          <button
                            onClick={() => handleStatusChange(student.id, opt.value)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${isActive ? opt.activeColor : `${opt.color} opacity-60 hover:opacity-100`
                              }`}
                          >
                            <opt.icon className="w-3.5 h-3.5" />
                            {opt.label}
                          </button>
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
    </div>
  )
}
