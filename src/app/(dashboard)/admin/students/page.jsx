"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Search, Users, Loader2, Eye, Calendar, User, Phone, MapPin, HeartPulse, ShieldCheck, FileText, BadgeInfo } from "lucide-react"
import { toast } from "sonner"

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  
  const [formData, setFormData] = useState({ 
    id: null, name: "", nis: "", classId: "",
    gender: "", dateOfBirth: "", parentName: "", parentPhone: "", address: "", allergies: ""
  })
  
  const [viewData, setViewData] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [resStudents, resClasses, resTeachers] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classes"),
        fetch("/api/teachers")
      ])
      
      if (!resStudents.ok || !resClasses.ok || !resTeachers.ok) throw new Error("Failed to fetch")
      
      const dataStudents = await resStudents.json()
      const dataClasses = await resClasses.json()
      const dataTeachers = await resTeachers.json()
      
      setStudents(dataStudents)
      setClasses(dataClasses)
      setTeachers(dataTeachers)
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
    setFormData({ 
      id: null, name: "", nis: "", classId: "",
      gender: "", dateOfBirth: "", parentName: "", parentPhone: "", address: "", allergies: ""
    })
    setIsAddOpen(true)
  }

  const handleOpenEdit = (student) => {
    setFormData({ 
      id: student.id, 
      name: student.name, 
      nis: student.nis, 
      classId: student.classId,
      gender: student.gender || "",
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      address: student.address || "",
      allergies: student.allergies || ""
    })
    setIsAddOpen(true)
  }
  
  const handleOpenView = (student) => {
    setViewData(student)
    setIsViewOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.nis || !formData.classId) {
      toast.error("Nama, NIS, dan Kelompok wajib diisi!")
      return
    }
    
    setIsSaving(true)
    try {
      const url = formData.id ? `/api/students/${formData.id}` : "/api/students"
      const method = formData.id ? "PUT" : "POST"
      
      const payload = {
        name: formData.name,
        nis: formData.nis,
        classId: formData.classId,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        address: formData.address,
        allergies: formData.allergies
      }
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
            <p className="text-xs text-slate-500 mt-0.5">Kelola data lengkap siswa TK dan penempatan kelompok</p>
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button onClick={handleOpenAdd} className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200" />}>
            <Plus className="w-4 h-4 mr-2" /> Tambah Siswa
          </DialogTrigger>
          <DialogContent className="rounded-3xl sm:max-w-2xl md:max-w-3xl w-[95vw] sm:w-full overflow-hidden shadow-2xl p-0 border-0">
            <DialogHeader className="px-5 sm:px-8 py-4 sm:py-5 border-b border-indigo-100 bg-linear-to-r from-indigo-50/50 to-white">
              <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <BadgeInfo className="w-5 h-5 text-indigo-500" />
                 {formData.id ? "Edit Data Siswa" : "Tambah Siswa Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="bg-slate-50/30 flex flex-col max-h-[70vh]">
              
              <Tabs defaultValue="akademik" className="w-full flex flex-col h-full relative">
                <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-4 shrink-0 bg-slate-50/80 sticky top-0 z-20 backdrop-blur-lg border-b border-indigo-50/50">
                  <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/60 p-1.5 h-auto shadow-sm ring-1 ring-slate-200/50">
                    <TabsTrigger value="akademik" className="rounded-xl py-2.5 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-indigo-100 transition-all text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span className="hidden sm:inline">Data Akademik & Profil</span>
                      <span className="sm:hidden">Akademik</span>
                    </TabsTrigger>
                    <TabsTrigger value="keluarga" className="rounded-xl py-2.5 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-emerald-100 transition-all text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span className="hidden sm:inline">Data Keluarga & Medis</span>
                      <span className="sm:hidden">Keluarga</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-4 sm:px-8 pt-4 pb-8 overflow-y-auto flex-1">
                {/* Tab: Data Akademik */}
                <TabsContent value="akademik" className="space-y-6 mt-0">
                  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 space-y-4 sm:space-y-5">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4 pb-2 border-b border-slate-50"><FileText className="w-4 h-4 text-indigo-400"/> Info Penempatan & Akademik</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nomor Induk Siswa (NIS) <span className="text-rose-500">*</span></Label>
                        <Input value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} placeholder="Masukkan NIS" className="rounded-xl h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kelompok / Kelas <span className="text-rose-500">*</span></Label>
                        <Select value={formData.classId} onValueChange={v => setFormData({...formData, classId: v})}>
                          <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors cursor-pointer">
                            <SelectValue placeholder="Pilih Kelompok" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {classes.map(c => (
                              <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 space-y-4 sm:space-y-5">
                     <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4 pb-2 border-b border-slate-50"><User className="w-4 h-4 text-blue-400"/> Profil Anak</h3>
                     <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap <span className="text-rose-500">*</span></Label>
                        <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Masukkan Nama Lengkap Sesuai Akta" className="rounded-xl h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jenis Kelamin</Label>
                          <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                            <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors cursor-pointer">
                              <SelectValue placeholder="Pilih Gender" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="L" className="cursor-pointer">Laki-laki</SelectItem>
                              <SelectItem value="P" className="cursor-pointer">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal Lahir</Label>
                          <Input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} className="rounded-xl h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors w-full cursor-pointer" />
                        </div>
                     </div>
                  </div>
                </TabsContent>

                {/* Tab: Data Personal (Keluarga & Medis) */}
                <TabsContent value="keluarga" className="space-y-6 mt-0">
                  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 space-y-4 sm:space-y-5">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4 pb-2 border-b border-slate-50"><Phone className="w-4 h-4 text-emerald-400"/> Kontak Orang Tua & Domisili</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Wali / Orang Tua</Label>
                          <Input value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} placeholder="Nama Ayah / Ibu" className="rounded-xl h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nomor WhatsApp Aktif</Label>
                          <Input value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} placeholder="08..." className="rounded-xl h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alamat Lengkap</Label>
                      <Textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Alamat lengkap rumah..." className="rounded-xl resize-none bg-slate-50 border-slate-200 focus:bg-white transition-colors" rows={3}/>
                    </div>
                  </div>

                  <div className="bg-rose-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-rose-100 space-y-4 sm:space-y-5">
                     <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2 mb-2 pb-2 border-b border-rose-100"><HeartPulse className="w-4 h-4 text-rose-500"/> Riwayat Medis Khusus</h3>
                     <p className="text-xs text-rose-600/80 mb-4">Informasi ini sangat penting agar guru dapat memantau kondisi dan pantangan anak dengan baik.</p>
                     <div className="space-y-2">
                        <Label className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Catatan Alergi / Penyakit Bawaan</Label>
                        <Input value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="Misal: Asma, Alergi Kacang, dll (kosongkan jika tidak ada)" className="rounded-xl h-11 bg-white border-rose-200 focus-visible:ring-rose-200 text-slate-800 placeholder:text-slate-400" />
                     </div>
                  </div>
                </TabsContent>
                </div>

              </Tabs>
            </div>
            <DialogFooter className="px-5 sm:px-8 py-4 sm:py-5 border-t border-slate-100 bg-white">
              <div className="flex justify-end gap-3 w-full">
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl px-6 h-11 hover:bg-slate-50" disabled={isSaving}>Batal</Button>
                <Button className="gradient-primary text-white rounded-xl px-8 h-11 shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Simpan Data Siswa
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tab Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-2 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setSelectedTab("all")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
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
            className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
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
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Guru Pengajar</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-slate-500">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <span>Siswa tidak ditemukan</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const classNameText = classes.find(c => c.id === student.classId)?.name || student.classId
                  const classTeachers = teachers.filter(t => t.classId === student.classId)
                  
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
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10 hover:bg-indigo-100 transition-colors cursor-pointer">
                          {classNameText}
                        </span>
                      </TableCell>
                      <TableCell>
                        {classTeachers.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {classTeachers.map(t => (
                              <span key={t.id} className="text-xs text-slate-600 flex items-center gap-1 cursor-default">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                {t.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Belum ada guru</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer" onClick={() => handleOpenView(student)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer" onClick={() => handleOpenEdit(student)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer" onClick={() => handleDelete(student.id)}>
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

      {/* View Detail Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md w-[95vw] sm:w-full shadow-2xl p-0 border-0 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-indigo-100 bg-linear-to-r from-blue-50/50 to-white">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Users className="w-5 h-5 text-blue-500"/> Detail Profil Anak
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-slate-50/30">
            {viewData && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-20 h-20 rounded-3xl gradient-blue flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20">
                      {viewData.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-slate-800 leading-tight">{viewData.name}</h3>
                     <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10 mt-2">
                      Kelompok {classes.find(c => c.id === viewData.classId)?.name || viewData.classId}
                     </span>
                   </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-indigo-50 to-blue-50 rounded-bl-full -z-10 bg-opacity-50"></div>
                  
                  <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nomor Induk / NIS</span>
                    <span className="text-sm font-mono text-indigo-600 font-bold">{viewData.nis}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jenis Kelamin</span>
                    <span className="text-sm font-semibold text-slate-700">{viewData.gender === "L" ? "Laki-laki" : viewData.gender === "P" ? "Perempuan" : "-"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Lahir</span>
                    <span className="text-sm font-semibold text-slate-700">{viewData.dateOfBirth ? new Date(viewData.dateOfBirth).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nama Wali</span>
                    <span className="text-sm font-semibold text-slate-700">{viewData.parentName || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No. Telepon / WA</span>
                    <span className="text-sm font-semibold text-slate-700">{viewData.parentPhone || "-"}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alamat Domisili</span>
                    <span className="text-sm font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">{viewData.address || "-"}</span>
                  </div>
                </div>

                {viewData.allergies && (
                  <div className="bg-linear-to-r from-rose-50 to-white rounded-2xl p-4 border border-rose-100 flex items-start gap-3 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-rose-100 rounded-bl-full -z-10 bg-opacity-50"></div>
                    <HeartPulse className="w-5 h-5 text-rose-500 shrink-0 mt-0.5"/>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">Catatan Medis Khusus</h4>
                      <p className="text-sm font-semibold text-rose-600 leading-snug">{viewData.allergies}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setIsViewOpen(false)} className="rounded-xl px-6 h-10 w-full sm:w-auto shadow-sm cursor-pointer hover:bg-slate-100 hover:text-slate-800 bg-white border border-slate-200 text-slate-700">Tutup Profil</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
