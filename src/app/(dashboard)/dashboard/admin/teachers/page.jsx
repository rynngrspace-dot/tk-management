"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search, GraduationCap, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminTeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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
    router.push("/dashboard/admin/teachers/new")
  }

  const handleOpenEdit = (teacher) => {
    router.push(`/dashboard/admin/teachers/${teacher.id}/edit`)
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
        <Button onClick={handleOpenAdd} className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200 cursor-pointer">
          <Plus className="w-4 h-4 mr-2" /> Tambah Guru
        </Button>
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
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">No</TableHead>
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
                filteredTeachers.map((teacher, index) => {
                  const classNameText = teacher.class?.name || (teacher.classId ? classes.find(c => c.id === teacher.classId)?.name : "Belum Ditugaskan")
                  const isAssigned = !!teacher.classId

                  return (
                    <TableRow key={teacher.id} className="table-row-hover transition-colors">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-700">{teacher.name}</span>

                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">{teacher.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${isAssigned
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
