"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Search, GraduationCap, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: "", email: "", password: "", classId: "none" })

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [resTeachers, resClasses] = await Promise.all([
        fetch("/api/teachers"),
        fetch("/api/classes")
      ])
      
      if (!resTeachers.ok || !resClasses.ok) throw new Error("Gagal mengambil data")
      
      const dataTeachers = await resTeachers.json()
      const dataClasses = await resClasses.json()
      
      setTeachers(dataTeachers)
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

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenAdd = () => {
    setFormData({ id: null, name: "", email: "", password: "", classId: "none" })
    setIsAddOpen(true)
  }

  const handleOpenEdit = (teacher) => {
    setFormData({ 
      id: teacher.id, 
      name: teacher.name, 
      email: teacher.email, 
      password: "", // intentionally blank for edit
      classId: teacher.classId || "none" 
    })
    setIsAddOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Nama dan Email harus diisi!")
      return
    }
    
    if (!formData.id && !formData.password) {
      toast.error("Password wajib diisi untuk guru baru!")
      return
    }
    
    setIsSaving(true)
    try {
      const url = formData.id ? `/api/teachers/${formData.id}` : "/api/teachers"
      const method = formData.id ? "PUT" : "POST"
      
      const payload = {
        name: formData.name,
        email: formData.email,
        classId: formData.classId === "none" ? null : formData.classId
      }
      
      if (formData.password) {
        payload.password = formData.password
      }
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data")
      
      toast.success(formData.id ? "Guru berhasil diperbarui" : "Guru berhasil ditambahkan")
      setIsAddOpen(false)
      fetchData() // Refresh data
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sistem guru ini?")) return
    
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data")
      
      toast.success("Guru berhasil dihapus")
      fetchData() // Refresh data
    } catch (error) {
      toast.error(error.message)
    }
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
          <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Manajemen Guru</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kelola data guru dan penugasan kelompok</p>
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd} className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" /> Tambah Guru
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">{formData.id ? "Edit Guru" : "Tambah Guru Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Lengkap</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Masukkan Nama Guru" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</Label>
                <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="guru@tk.com" type="email" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password {formData.id && <span className="text-slate-400 normal-case font-normal">(Isi jika ingin mengubah)</span>}
                </Label>
                <Input 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  placeholder={formData.id ? "Biarkan kosong jika tidak diubah" : "Masukkan password guru"} 
                  type="text" 
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Penempatan Kelompok / Kelas</Label>
                <Select value={formData.classId} onValueChange={v => setFormData({...formData, classId: v})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih Kelompok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Belum Ditugaskan</SelectItem>
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

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Cari nama atau email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-xl bg-slate-50/80"
          />
        </div>
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Guru</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Email</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Kelompok Ditugaskan</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-slate-500">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <GraduationCap className="w-8 h-8 text-slate-300" />
                      <span>Guru tidak ditemukan</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => {
                  const classNameText = teacher.class?.name || (teacher.classId ? classes.find(c => c.id === teacher.classId)?.name : "Belum Ditugaskan")
                  const isAssigned = !!teacher.classId
                  
                  return (
                    <TableRow key={teacher.id} className="table-row-hover transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {teacher.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-700">{teacher.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">{teacher.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                          isAssigned 
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-500/10" 
                            : "bg-amber-50 text-amber-600 ring-amber-500/10"
                        }`}>
                          {classNameText}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => handleOpenEdit(teacher)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(teacher.id)}>
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
          <span>Menampilkan {filteredTeachers.length} dari {teachers.length} guru</span>
        </div>
      </div>
    </div>
  )
}
