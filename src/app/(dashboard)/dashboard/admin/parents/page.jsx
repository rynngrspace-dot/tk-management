"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminParentsPage() {
  const router = useRouter()
  const [parents, setParents] = useState([])
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [resParents, resStudents] = await Promise.all([
        fetch("/api/parents"),
        fetch("/api/students")
      ])

      if (!resParents.ok || !resStudents.ok) throw new Error("Gagal mengambil data")

      const dataParents = await resParents.json()
      const dataStudents = await resStudents.json()

      setParents(dataParents)
      setStudents(dataStudents)
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

  const filteredParents = parents.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.student?.name && p.student.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleOpenAdd = () => {
    router.push("/dashboard/admin/parents/new")
  }

  const handleOpenEdit = (parent) => {
    router.push(`/dashboard/admin/parents/${parent.id}/edit`)
  }

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun orang tua ini? Siswa tidak akan terhapus.")) return

    try {
      const res = await fetch(`/api/parents/${id}`, { method: "DELETE" })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Gagal menghapus data")

      toast.success("Akun Orang Tua berhasil dihapus")
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
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Manajemen Orang Tua</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kelola data login orang tua siswa untuk melihat nilai perkembangan anak</p>
          </div>
        </div>
        <Button onClick={handleOpenAdd} className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200 cursor-pointer">
          <Plus className="w-4 h-4 mr-2" /> Tambah Orang Tua
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama, email, atau nama anak..."
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
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Orang Tua</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Email Login</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Menghubungi Siswa (Anak)</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Kelompok Kelas</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-slate-500">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <span>Data orang tua tidak ditemukan</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredParents.map((parent, index) => {
                  return (
                    <TableRow key={parent.id} className="table-row-hover transition-colors">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">

                          <span className="font-medium text-slate-700">{parent.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">{parent.email}</TableCell>
                      <TableCell className="font-medium text-slate-700">
                        {parent.student ? (
                          <div className="flex flex-col">
                            <span>{parent.student.name}</span>
                            <span className="text-[11px] text-slate-400">NIS: {parent.student.nis}</span>
                          </div>
                        ) : (
                          <span className="text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded">Belum Terhubung</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {parent.student?.classId ? (
                          <span className="inline-flex items-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-500/10 px-2.5 py-1 text-xs font-semibold">
                            Kelompok {parent.student.classId}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => handleOpenEdit(parent)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(parent.id)}>
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
          <span>Menampilkan {filteredParents.length} dari {parents.length} orang tua</span>
        </div>
      </div>
    </div>
  )
}
