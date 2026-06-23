"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, User, Mail, KeyRound, GraduationCap } from "lucide-react"
import { toast } from "sonner"

export default function AdminEditTeacherPage({ params }) {
  const router = useRouter()
  const { id } = use(params)

  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    classId: "none"
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [resTeachers, resClasses] = await Promise.all([
          fetch("/api/teachers"),
          fetch("/api/classes")
        ])
        
        if (!resTeachers.ok || !resClasses.ok) throw new Error("Gagal mengambil data")
        
        const teachersList = await resTeachers.json()
        const classesList = await resClasses.json()
        setClasses(classesList)
        
        const myTeacher = teachersList.find(t => t.id === parseInt(id))
        if (!myTeacher) {
          toast.error("Data guru tidak ditemukan")
          router.push("/dashboard/admin/teachers")
          return
        }

        setFormData({
          name: myTeacher.name || "",
          email: myTeacher.email || "",
          password: "", // blank for edit
          classId: myTeacher.classId || "none"
        })

      } catch (error) {
        toast.error("Gagal memuat data dari server")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, router])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error("Nama dan Email harus diisi!")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        classId: formData.classId === "none" ? null : formData.classId
      }

      if (formData.password) {
        payload.password = formData.password
      }

      const res = await fetch(`/api/teachers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data")

      toast.success("Guru berhasil diperbarui")
      router.push("/dashboard/admin/teachers")
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
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push("/dashboard/admin/teachers")}
          className="rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Edit Akun Guru</h2>
          <p className="text-xs text-slate-500 mt-0.5">Ubah profil dan kelompok ditugaskan dari guru</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-xl shadow-indigo-500/5 p-6 sm:p-8 space-y-6">
        <div className="space-y-5">
          
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" /> Nama Lengkap Guru <span className="text-rose-500">*</span>
            </Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Masukkan nama lengkap guru" 
              className="rounded-xl h-11 bg-white border-slate-200" 
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Login <span className="text-rose-500">*</span>
            </Label>
            <Input 
              type="email"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="guru@tk.com" 
              className="rounded-xl h-11 bg-white border-slate-200" 
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-500" /> Password <span className="text-slate-400 normal-case font-normal">(Isi jika ingin mengubah)</span>
            </Label>
            <Input 
              type="text"
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              placeholder="Biarkan kosong jika tidak diubah" 
              className="rounded-xl h-11 bg-white border-slate-200" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Penempatan Kelompok / Kelas
            </Label>
            <Select value={formData.classId} onValueChange={v => setFormData({...formData, classId: v})}>
              <SelectTrigger className="rounded-xl h-11 bg-white border-slate-200 cursor-pointer">
                <SelectValue placeholder="Pilih Kelompok" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="none" className="cursor-pointer">Belum Ditugaskan</SelectItem>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.id} className="cursor-pointer">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => router.push("/dashboard/admin/teachers")}
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
