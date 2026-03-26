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
        const [resStudents, resClasses] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/classes")
        ])
        
        if (!resStudents.ok || !resClasses.ok) throw new Error("Gagal mengambil data")
        
        const dataStudents = await resStudents.json()
        const dataClasses = await resClasses.json()
        
        setClasses(dataClasses)
        
        // Determine teacher's class based on localStorage
        const assignedClassId = localStorage.getItem("classId")
        
        if (assignedClassId) {
          setMyClassId(assignedClassId)
          const assignedClass = dataClasses.find(c => c.id === assignedClassId)
          if (assignedClass) {
            setClassName(assignedClass.name)
          }
          
          // Filter out students only belonging to this class
          const filtered = dataStudents.filter(s => s.classId === assignedClassId)
          setAllStudents(filtered)
        } else {
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
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">NIS</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Siswa</TableHead>
                  <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-slate-500">Aksi</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <span>Siswa tidak ditemukan</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <TableRow key={student.id} className="table-row-hover transition-colors">
                      <TableCell className="font-mono text-sm text-indigo-600 font-medium">{student.nis}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-700">{student.name}</span>
                        </div>
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
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500"/> Detail Profil Siswa
            </DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-2xl gradient-blue flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                    {viewData.name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800">{viewData.name}</h3>
                   <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10 mt-1">
                    {classes.find(c => c.id === viewData.classId)?.name || viewData.classId}
                   </span>
                 </div>
              </div>

              <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Nomor Induk / NIS</span>
                  <span className="text-sm font-mono text-slate-800 font-medium">{viewData.nis}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Jenis Kelamin</span>
                  <span className="text-sm text-slate-800">{viewData.gender === "L" ? "Laki-laki" : viewData.gender === "P" ? "Perempuan" : "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Tanggal Lahir</span>
                  <span className="text-sm text-slate-800">{viewData.dateOfBirth ? new Date(viewData.dateOfBirth).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Nama Orang Tua/Wali</span>
                  <span className="text-sm text-slate-800">{viewData.parentName || "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">No. Telepon / WA</span>
                  <span className="text-sm text-slate-800">{viewData.parentPhone || "-"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Alamat Domisili</span>
                  <span className="text-sm text-slate-800">{viewData.address || "-"}</span>
                </div>
              </div>

              {viewData.allergies && (
                <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100 flex items-start gap-3">
                  <HeartPulse className="w-5 h-5 text-rose-500 shrink-0 mt-0.5"/>
                  <div>
                    <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Catatan Medis / Alergi</h4>
                    <p className="text-sm text-rose-600">{viewData.allergies}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

