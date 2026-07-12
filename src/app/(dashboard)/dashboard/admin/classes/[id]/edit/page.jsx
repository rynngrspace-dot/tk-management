"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, BookOpen, Layers } from "lucide-react"
import { toast } from "sonner"

export default function AdminEditClassPage({ params }) {
  const router = useRouter()
  const { id } = use(params)
  const decodedId = decodeURIComponent(id)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: ""
  })

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/classes")
        if (!res.ok) throw new Error("Gagal mengambil data kelas")
        const data = await res.json()

        const myClass = data.find(c => c.id === decodedId)
        if (!myClass) {
          toast.error("Data kelas tidak ditemukan")
          router.push("/dashboard/admin/classes")
          return
        }

        setFormData({
          id: myClass.id,
          name: myClass.name || ""
        })
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchClassData()
  }, [decodedId, router])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      toast.error("Nama Kelas harus diisi!")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/classes/${decodedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: decodedId, name: formData.name })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data")

      toast.success("Kelas berhasil diperbarui")
      router.push("/dashboard/admin/classes")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
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
    <div className="space-y-6 max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/admin/classes")}
          className="rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Edit Kelas / Kelompok</h2>
          <p className="text-xs text-slate-500 mt-0.5">Ubah informasi nama kelas/kelompok belajar</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-xl shadow-indigo-500/5 p-6 sm:p-8 space-y-6">
        <div className="space-y-5">

          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> ID Kelas / Kelompok
            </Label>
            <Input
              value={formData.id}
              className="rounded-xl h-11 bg-slate-100 border-slate-200 text-slate-500 font-medium"
              disabled
            />
            <p className="text-[10px] text-slate-400 font-medium">
              ID Kelas bersifat permanen dan tidak dapat diubah.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Nama Kelas / Kelompok <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Kelompok B (5-6 Tahun)"
              className="rounded-xl h-11 bg-white border-slate-200"
              required
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/admin/classes")}
            className="rounded-xl px-6 h-11 hover:bg-slate-50 font-medium"
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="gradient-primary text-white rounded-xl px-8 h-11 shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all font-semibold"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  )
}
