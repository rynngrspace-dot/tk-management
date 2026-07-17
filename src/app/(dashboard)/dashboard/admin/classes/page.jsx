"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, BookOpen, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminClassesPage() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)

  const fetchClasses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/classes")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data")
      setClasses(data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const handleOpenAdd = () => {
    router.push("/dashboard/admin/classes/new")
  }

  const handleOpenEdit = (cls) => {
    router.push(`/dashboard/admin/classes/${cls.id}/edit`)
  }

  const confirmDelete = (cls) => {
    setSelectedClass(cls)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/classes/${selectedClass.id}`, {
        method: "DELETE"
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menghapus kelas")

      toast.success("Kelas berhasil dihapus")
      setIsDeleteDialogOpen(false)
      fetchClasses()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
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
            <p className="text-xs text-slate-500 mt-0.5">Daftar kelompok belajar di TK Al Ishlah</p>
          </div>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Kelas
        </Button>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800">Hapus Kelas?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Apakah Anda yakin ingin menghapus kelas <span className="font-bold text-slate-700">{selectedClass?.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl h-11">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Hapus Kelas"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Memuat data kelompok...</p>
          </div>
        ) : (
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
                        <span>Belum ada data kelompok</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls, idx) => {
                    const assignedTeacher = cls.teachers?.[0]
                    const studentCount = cls._count?.students || 0
                    const colorClass = classColors[idx % classColors.length]

                    return (
                      <TableRow key={cls.id} className="table-row-hover transition-colors">
                        <TableCell>
                          <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                            {cls.id}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-700">{cls.name}</TableCell>
                        <TableCell>
                          {assignedTeacher ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                {assignedTeacher.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-slate-700">{assignedTeacher.name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold">?</div>
                              <span className="text-xs italic">Belum Ditugaskan</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex h-7 px-3 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                            {studentCount} Siswa
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                              onClick={() => handleOpenEdit(cls)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              onClick={() => confirmDelete(cls)}
                            >
                              <Trash2 className="h-4 w-4" />
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
        )}
      </div>
    </div>
  )
}
