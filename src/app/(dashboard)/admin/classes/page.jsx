"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react"
import { getMockData } from "@/lib/mock-data"
import { toast } from "sonner"

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState({ id: "", name: "" })

  useEffect(() => {
    const data = getMockData()
    setClasses(data.classes)
    setTeachers(data.teachers)
    setStudents(data.students)
  }, [])

  const handleSave = () => {
    if (!formData.id || !formData.name) {
      toast.error("ID Kelas dan Nama Kelas harus diisi!")
      return
    }
    setClasses([...classes, formData])
    setIsAddOpen(false)
    setFormData({ id: "", name: "" })
    toast.success("Kelas berhasil ditambahkan")
  }

  const handleDelete = (id) => {
    setClasses(classes.filter(c => c.id !== id))
    toast.success("Kelas berhasil dihapus")
  }

  const classColors = ["gradient-blue", "gradient-emerald", "gradient-amber", "gradient-coral", "gradient-sky"]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-amber flex items-center justify-center shadow-md shadow-amber-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Manajemen Kelas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar kelompok belajar di TK</p>
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" /> Tambah Kelas
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Tambah Kelas Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">ID Kelas (Misal: A, B)</Label>
                <Input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="Masukkan ID" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Kelas / Kelompok</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Kelompok B (5-6 Tahun)" className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">Batal</Button>
              <Button className="gradient-primary text-white rounded-xl" onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 space-y-4">
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Kode</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Kelas</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Wali Kelas</TableHead>
                <TableHead className="text-center font-semibold text-xs uppercase tracking-wider text-slate-500">Jumlah Siswa</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-slate-500">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="w-8 h-8 text-slate-300" />
                      <span>Kelas tidak ditemukan</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((cls, idx) => {
                  const assignedTeacher = teachers.find(t => t.classId === cls.id)
                  const studentCount = students.filter(s => s.classId === cls.id).length
                  const colorClass = classColors[idx % classColors.length]
                  
                  return (
                    <TableRow key={cls.id} className="table-row-hover transition-colors">
                      <TableCell>
                        <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                          {cls.id}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">{cls.name}</TableCell>
                      <TableCell>
                        {assignedTeacher ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md gradient-emerald flex items-center justify-center text-white text-[10px] font-bold">
                              {assignedTeacher.name.charAt(0)}
                            </div>
                            <span className="text-sm text-slate-700">{assignedTeacher.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Belum Ditugaskan</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                          {studentCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => toast.info("Fitur Edit dipanggil")}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(cls.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
