"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, BookOpen, Layers } from "lucide-react"
import { toast } from "sonner"

export default function AdminNewClassPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: ""
  })

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.id || !formData.name) {
      toast.error("ID Kelas dan Nama Kelas harus diisi!")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data")

      toast.success("Kelas berhasil ditambahkan")
      router.push("/dashboard/admin/classes")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
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
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Tambah Kelas / Kelompok Baru</h2>
          <p className="text-xs text-slate-500 mt-0.5">Buat kelompok belajar atau kelas baru untuk penempatan siswa</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-xl shadow-indigo-500/5 p-6 sm:p-8 space-y-6">
        <div className="space-y-5">
          
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> ID Kelas / Kelompok (Misal: A, B) <span className="text-rose-500">*</span>
            </Label>
            <Input 
              value={formData.id} 
              onChange={e => setFormData({...formData, id: e.target.value})} 
              placeholder="Masukkan ID Kelas (e.g. A, B)" 
              className="rounded-xl h-11 bg-white border-slate-200" 
              required
            />
            <p className="text-[10px] text-slate-400 font-medium">
              ID Kelas bersifat unik dan digunakan sebagai kode kelompok utama.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Nama Kelas / Kelompok <span className="text-rose-500">*</span>
            </Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
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
            Simpan Kelas
          </Button>
        </div>
      </form>
    </div>
  )
}
