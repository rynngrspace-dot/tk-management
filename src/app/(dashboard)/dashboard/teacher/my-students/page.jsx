"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Users, Loader2, Eye, HeartPulse } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function TeacherMyStudentsPage() {
  const [allStudents, setAllStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [myClassId, setMyClassId] = useState(null)
  const [className, setClassName] = useState("Belum Ditugaskan")

  const [searchTerm, setSearchTerm] = useState("")

  const [classes, setClasses] = useState([]) // Need classes for view detail if needed

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewData, setViewData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // 1. Fetch Teacher Profile to get Class Info
        const resProfile = await fetch("/api/profile")
        if (!resProfile.ok) throw new Error("Gagal mengambil profil")
        const profile = await resProfile.json()

        if (profile.classId) {
          setMyClassId(profile.classId)
          setClassName(profile.class?.name || "Kelas Tidak Dikenal")

          // 2. Fetch Students for this class
          // The API already filters by session for teachers, so we don't need classId param
          // but we can pass it for clarity or if admin uses this page.
          const resStudents = await fetch("/api/students")
          if (!resStudents.ok) throw new Error("Gagal mengambil data siswa")
          const dataStudents = await resStudents.json()

          setAllStudents(dataStudents)

          // Also fetch all classes for metadata if needed (already in profile but might need other classes)
          const resClasses = await fetch("/api/classes")
          if (resClasses.ok) {
            setClasses(await resClasses.json())
          }
        } else {
          setMyClassId(null)
          setClassName("Belum Ditugaskan")
          setAllStudents([])
        }

      } catch (error) {
        toast.error(error.message)
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredStudents = allStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.includes(searchTerm)
  )

  const handleOpenView = (student) => {
    setViewData(student)
    setIsViewOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center shadow-md shadow-blue-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Siswa Saya</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar siswa di <strong className="text-slate-700">{className}</strong></p>
          </div>
        </div>
      </div>

      {/* Empty State or Table */}
      {!myClassId ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-700">Belum Ada Siswa</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1 mx-auto">Anda belum ditugaskan untuk mengajar kelompok reguler manapun. Silakan hubungi Admin jika ini adalah sebuah kesalahan.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama atau NIS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-xl bg-slate-50/80"
            />
          </div>
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500 w-12 text-center">No</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Siswa</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">NIK</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">NISN</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500 text-center">L/P</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Tgl Lahir</TableHead>
                  <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-slate-500">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-400 py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <span>Siswa tidak ditemukan</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => {
                    return (
                      <TableRow key={student.id} className="table-row-hover transition-colors">
                        <TableCell className="text-xs font-semibold text-slate-500 text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">
                          {student.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">{student.nik || "-"}</TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">{student.nisn || "-"}</TableCell>
                        <TableCell className="text-center text-xs font-medium text-slate-600">
                          {student.gender === "Laki-laki" ? "L" : student.gender === "Perempuan" ? "P" : student.gender || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                          {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleOpenView(student)}>
                            <Eye className="h-4 w-4 mr-1.5" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
            <span>Menampilkan {filteredStudents.length} dari {allStudents.length} siswa</span>
          </div>
        </div>
      )}

      {/* View Detail Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="rounded-xl sm:max-w-2xl w-[95vw] sm:w-full shadow-none p-0 border border-slate-200 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
              <Users className="w-5 h-5 text-indigo-500" /> Detail Profil Anak
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-slate-50/50">
            {viewData && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg gradient-blue flex items-center justify-center text-white text-2xl font-medium shadow-none">
                    {viewData.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 leading-tight">{viewData.name}</h3>
                    <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10 mt-2">
                      Kelompok {classes.find(c => c.id === viewData.classId)?.name || viewData.classId}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left Column: Identitas Siswa */}
                  <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-none space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-indigo-50/30 to-transparent rounded-bl-full -z-10"></div>
                    <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-1">Identitas Siswa</h4>
                    
                    <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Nomor Induk / NIS</span>
                      <span className="text-sm font-mono text-indigo-600 font-semibold">{viewData.nis}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">NIK</span>
                      <span className="text-sm font-mono text-slate-600 font-medium">{viewData.nik || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">NISN</span>
                      <span className="text-sm font-mono text-slate-600 font-medium">{viewData.nisn || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Jenis Kelamin</span>
                      <span className="text-sm font-medium text-slate-600">{(viewData.gender === "L" || viewData.gender === "Laki-laki") ? "Laki-laki" : (viewData.gender === "P" || viewData.gender === "Perempuan") ? "Perempuan" : "-"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tanggal Lahir</span>
                      <span className="text-sm font-medium text-slate-600">{viewData.dateOfBirth ? new Date(viewData.dateOfBirth).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}</span>
                    </div>
                  </div>

                  {/* Right Column: Kontak & Alamat Wali */}
                  <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-none space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-indigo-50/30 to-transparent rounded-bl-full -z-10"></div>
                    <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-1">Kontak & Alamat Wali</h4>
                    
                    <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Nama Wali</span>
                      <span className="text-sm font-medium text-slate-600">{viewData.parentName || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">No. Telepon / WA</span>
                      <span className="text-sm font-medium text-slate-600">{viewData.parentPhone || "-"}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Alamat Domisili</span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed min-h-[76px]">{viewData.address || "-"}</span>
                    </div>
                  </div>
                </div>

                {viewData.allergies && (
                  <div className="bg-linear-to-r from-rose-50 to-white rounded-lg p-4 border border-rose-200 flex items-start gap-3 shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-rose-100 rounded-bl-full -z-10 bg-opacity-50"></div>
                    <HeartPulse className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-[11px] font-medium text-rose-700 uppercase tracking-wider mb-1">Catatan Medis Khusus</h4>
                      <p className="text-sm font-medium text-rose-600 leading-snug">{viewData.allergies}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setIsViewOpen(false)} className="rounded-lg px-6 h-10 w-full sm:w-auto shadow-none cursor-pointer hover:bg-slate-100 hover:text-slate-800 bg-white border border-slate-200 text-slate-700">Tutup Detail</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

