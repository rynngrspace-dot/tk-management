"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, User, Mail, KeyRound, Users } from "lucide-react"
import { toast } from "sonner"

export default function AdminEditParentPage({ params }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [resParents, resStudents] = await Promise.all([
          fetch("/api/parents"),
          fetch("/api/students")
        ])
        
        if (!resParents.ok || !resStudents.ok) throw new Error("Gagal mengambil data")
        
        const parentsList = await resParents.json()
        const studentsList = await resStudents.json()
        setStudents(studentsList)
        
        const myParent = parentsList.find(p => p.id === parseInt(id))
        if (!myParent) {
          toast.error("Data orang tua tidak ditemukan")
          router.push("/dashboard/admin/parents")
          return
        }

        setFormData({
          name: myParent.name || "",
          email: myParent.email || "",
          password: "", // blank for edit
          studentId: myParent.studentId ? myParent.studentId.toString() : ""
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
    if (!formData.name || !formData.email || !formData.studentId) {
      toast.error("Nama, Email, dan Siswa harus diisi!")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        studentId: parseInt(formData.studentId)
      }

      if (formData.password) {
        payload.password = formData.password
      }

      const res = await fetch(`/api/parents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data")

      toast.success("Akun Orang Tua berhasil diperbarui")
      router.push("/dashboard/admin/parents")
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
          onClick={() => router.push("/dashboard/admin/parents")}
          className="rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Edit Akun Orang Tua</h2>
          <p className="text-xs text-slate-500 mt-0.5">Ubah profil dan penempatan anak dari akun orang tua</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-xl shadow-indigo-500/5 p-6 sm:p-8 space-y-6">
        <div className="space-y-5">
          
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" /> Nama Lengkap Orang Tua <span className="text-rose-500">*</span>
            </Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Masukkan nama lengkap orang tua" 
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
              placeholder="orangtua@email.com" 
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
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Hubungkan dengan Siswa (Anak) <span className="text-rose-500">*</span>
            </Label>
            <Select 
              value={formData.studentId} 
              onValueChange={v => {
                const selectedStudent = students.find(s => s.id.toString() === v)
                setFormData({
                  ...formData,
                  studentId: v,
                  password: selectedStudent ? selectedStudent.nis.toString() : formData.password
                })
              }}
            >
              <SelectTrigger className="rounded-xl h-11 bg-white border-slate-200 cursor-pointer">
                <SelectValue placeholder="Pilih Siswa" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()} className="cursor-pointer">
                    {s.nis} - {s.name} ({s.class?.name || 'Tanpa Kelas'})
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
            onClick={() => router.push("/dashboard/admin/parents")}
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
