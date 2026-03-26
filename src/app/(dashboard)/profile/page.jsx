"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCircle, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (!res.ok) throw new Error("Gagal mengambil data profil")
        const data = await res.json()
        setFormData({ name: data.name, email: data.email, password: "" })
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui profil")
      
      toast.success("Profil berhasil diperbarui")
      setFormData(prev => ({ ...prev, password: "" })) // clear password field after sumbit
      
      // Update local storage so navbar name updates (though refresh handles it generally)
      localStorage.setItem("userName", formData.name)
      // Force a slight delay and refresh to reflect updated cookie/navbar
      setTimeout(() => window.location.reload(), 1500)
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
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/60">
        <div className="w-14 h-14 rounded-2xl gradient-blue flex items-center justify-center shadow-lg shadow-blue-500/20">
          <UserCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Edit Profil Anda</h2>
          <p className="text-sm text-slate-500">Sesuaikan informasi akun dan kata sandi Anda.</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Lengkap</Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
              className="rounded-xl bg-slate-50/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Akun</Label>
            <Input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
              className="rounded-xl bg-slate-50/50"
            />
          </div>
          
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Ganti Password
            </Label>
            <p className="text-xs text-slate-400 mb-2">Kosongkan kolom ini jika Anda tidak ingin mengubah password lama.</p>
            <Input 
              type="password" 
              placeholder="Masukkan password baru"
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="rounded-xl bg-slate-50/50"
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full rounded-xl gradient-primary text-white h-12 shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-opacity">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </div>
    </div>
  )
}
