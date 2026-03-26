"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Search, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: "", nis: "", classId: "" })

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [resStudents, resClasses] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classes")
      ])
      
      if (!resStudents.ok || !resClasses.ok) throw new Error("Failed to fetch")
      
      const dataStudents = await resStudents.json()
      const dataClasses = await resClasses.json()
      
      setStudents(dataStudents)
      setClasses(dataClasses)
    } catch (error) {
      toast.error("Gagal memuat data dari server")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredStudents = students
    .filter(s => selectedTab === "all" || s.classId === selectedTab)
    .filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm)
    )

  const handleOpenAdd = () => {
    setFormData({ id: null, name: "", nis: "", classId: "" })
    setIsAddOpen(true)
  }

  const handleOpenEdit = (student) => {
    setFormData({ id: student.id, name: student.name, nis: student.nis, classId: student.classId })
    setIsAddOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.nis || !formData.classId) {
      toast.error("Semua field harus diisi!")
      return
    }
    
    setIsSaving(true)
    try {
      const url = formData.id ? `/api/students/${formData.id}` : "/api/students"
      const method = formData.id ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          nis: formData.nis,
          classId: formData.classId
        })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data")
      
      toast.success(formData.id ? "Siswa berhasil diperbarui" : "Siswa berhasil ditambahkan")
      setIsAddOpen(false)
      fetchData() // Refresh data
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus siswa ini?")) return
    
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data")
      
      toast.success("Siswa berhasil dihapus")
      fetchData() // Refresh data
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getTabCount = (classId) => {
    if (classId === "all") return students.length
    return students.filter(s => s.classId === classId).length
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center shadow-md shadow-blue-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Manajemen Siswa</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kelola data siswa TK dan penempatan kelompok</p>
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd} className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" /> Tambah Siswa
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">{formData.id ? "Edit Siswa" : "Tambah Siswa Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nomor Induk Siswa (NIS)</Label>
                <Input value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} placeholder="Masukkan NIS" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Lengkap</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Masukkan Nama Siswa" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Kelompok / Kelas</Label>
                <Select value={formData.classId} onValueChange={v => setFormData({...formData, classId: v})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih Kelompok" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl" disabled={isSaving}>Batal</Button>
              <Button className="gradient-primary text-white rounded-xl" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tab Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-2 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setSelectedTab("all")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            selectedTab === "all"
              ? "gradient-primary text-white shadow-md shadow-indigo-500/20"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          }`}
        >
          <Users className="w-4 h-4" />
          Semua Siswa
          <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-md font-bold ${
            selectedTab === "all" ? "bg-white/20" : "bg-slate-100 text-slate-500"
          }`}>{getTabCount("all")}</span>
        </button>
        {classes.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelectedTab(cls.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              selectedTab === cls.id
                ? "gradient-primary text-white shadow-md shadow-indigo-500/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {cls.name}
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-md font-bold ${
              selectedTab === cls.id ? "bg-white/20" : "bg-slate-100 text-slate-500"
            }`}>{getTabCount(cls.id)}</span>
          </button>
        ))}
      </div>

      {/* Table Card */}
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
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Kelompok</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-slate-500">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <span>Siswa tidak ditemukan</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const classNameText = classes.find(c => c.id === student.classId)?.name || student.classId
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
                      <TableCell>
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                          {classNameText}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => handleOpenEdit(student)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(student.id)}>
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
        <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
          <span>Menampilkan {filteredStudents.length} dari {students.length} siswa</span>
        </div>
      </div>
    </div>
  )
}
