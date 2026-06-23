"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, FileText, ShieldCheck, User, Phone, HeartPulse, KeyRound, Mail } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminNewStudentPage() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "", nis: "", classId: "",
    gender: "", dateOfBirth: "", parentName: "", parentPhone: "", address: "", allergies: "",
    parentEmail: "", createParentAccount: true
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes")
        if (!res.ok) throw new Error("Gagal mengambil data kelas")
        const data = await res.json()
        setClasses(data)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.nis || !formData.classId) {
      toast.error("Nama, NIS, dan Kelompok wajib diisi!")
      return
    }

    if (formData.createParentAccount && !formData.parentEmail) {
      toast.error("Email Orang Tua wajib diisi jika opsi pembuatan akun aktif!")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data")

      toast.success("Siswa berhasil ditambahkan")
      router.push("/dashboard/admin/students")
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push("/dashboard/admin/students")}
          className="rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Tambah Siswa Baru</h2>
          <p className="text-xs text-slate-500 mt-0.5">Daftarkan siswa baru beserta penempatan kelompok belajarnya</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-xl shadow-indigo-500/5 p-6 sm:p-8 space-y-6">
        <Tabs defaultValue="siswa" className="w-full flex flex-col">
          <TabsList className="flex w-fit rounded-2xl bg-slate-100/80 p-1.5 h-auto shadow-sm ring-1 ring-slate-200/50 gap-1.5">
            <TabsTrigger value="siswa" className="rounded-xl px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-indigo-100 transition-all text-sm font-semibold cursor-pointer">
              <FileText className="w-4 h-4 mr-2 inline" />
              Data Siswa
            </TabsTrigger>
            <TabsTrigger value="keluarga" className="rounded-xl px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-emerald-100 transition-all text-sm font-semibold cursor-pointer">
              <ShieldCheck className="w-4 h-4 mr-2 inline" />
              Data Keluarga & Medis
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Data Siswa */}
          <TabsContent value="siswa" className="space-y-6 mt-6">
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                <FileText className="w-4 h-4 text-indigo-500" />
                Info Penempatan & Akademik
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nomor Induk Siswa (NIS) <span className="text-rose-500">*</span></Label>
                  <Input 
                    value={formData.nis} 
                    onChange={e => setFormData({...formData, nis: e.target.value})} 
                    placeholder="Masukkan NIS" 
                    className="rounded-xl h-11 bg-white border-slate-200" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kelompok / Kelas <span className="text-rose-500">*</span></Label>
                  <Select value={formData.classId} onValueChange={v => setFormData({...formData, classId: v})}>
                    <SelectTrigger className="rounded-xl h-11 bg-white border-slate-200 cursor-pointer">
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

            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-blue-500" />
                Profil Anak
              </h3>
              
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Lengkap Siswa <span className="text-rose-500">*</span></Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Masukkan Nama Lengkap Sesuai Akta" 
                  className="rounded-xl h-11 bg-white border-slate-200" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Jenis Kelamin</Label>
                  <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                    <SelectTrigger className="rounded-xl h-11 bg-white border-slate-200 cursor-pointer">
                      <SelectValue placeholder="Pilih Gender" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="L" className="cursor-pointer">Laki-laki</SelectItem>
                      <SelectItem value="P" className="cursor-pointer">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tanggal Lahir</Label>
                  <Input 
                    type="date" 
                    value={formData.dateOfBirth} 
                    onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} 
                    className="rounded-xl h-11 bg-white border-slate-200 cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Data Keluarga & Medis */}
          <TabsContent value="keluarga" className="space-y-6 mt-6">
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                <Phone className="w-4 h-4 text-emerald-500" />
                Kontak Wali & Domisili
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Wali / Orang Tua</Label>
                  <Input 
                    value={formData.parentName} 
                    onChange={e => setFormData({...formData, parentName: e.target.value})} 
                    placeholder="Nama Ayah / Ibu" 
                    className="rounded-xl h-11 bg-white border-slate-200" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nomor WhatsApp Aktif</Label>
                  <Input 
                    value={formData.parentPhone} 
                    onChange={e => setFormData({...formData, parentPhone: e.target.value})} 
                    placeholder="08..." 
                    className="rounded-xl h-11 bg-white border-slate-200" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Alamat Lengkap Rumah</Label>
                <Textarea 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  placeholder="Alamat lengkap rumah..." 
                  className="rounded-xl bg-white border-slate-200 resize-none font-medium" 
                  rows={3}
                />
              </div>
            </div>

            {/* AKUN ORANG TUA AUTO CREATION */}
            <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/60 space-y-4">
              <h3 className="text-sm font-semibold text-indigo-700 flex items-center gap-2 mb-2 pb-2 border-b border-indigo-100/50">
                <KeyRound className="w-4 h-4 text-indigo-500" />
                Integrasi Akun Login Orang Tua
              </h3>
              <p className="text-[11px] text-indigo-600/80 leading-normal font-medium">
                Jika dicentang, sistem akan otomatis membuatkan akun login bagi orang tua agar dapat melihat hasil rapor perkembangan anak.
              </p>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100">
                <input 
                  type="checkbox" 
                  id="createParentAccount"
                  checked={formData.createParentAccount}
                  onChange={e => setFormData({...formData, createParentAccount: e.target.checked})}
                  className="w-4.5 h-4.5 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <Label htmlFor="createParentAccount" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  Buat Akun Login Orang Tua Secara Otomatis
                </Label>
              </div>

              {formData.createParentAccount && (
                <div className="space-y-2 animate-slide-up">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Login Orang Tua <span className="text-rose-500">*</span></Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email"
                      value={formData.parentEmail} 
                      onChange={e => setFormData({...formData, parentEmail: e.target.value})} 
                      placeholder="ortu@email.com" 
                      className="rounded-xl h-11 bg-white border-slate-200 pl-10" 
                      required={formData.createParentAccount}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Password default akan diatur sama dengan **NIS Siswa** (dapat diubah nanti di profil).
                  </p>
                </div>
              )}
            </div>

            <div className="bg-rose-50/30 p-5 rounded-2xl border border-rose-100 space-y-4">
              <h3 className="text-sm font-semibold text-rose-700 flex items-center gap-2 mb-2 pb-2 border-b border-rose-100">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Catatan Medis Khusus
              </h3>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-rose-700 uppercase tracking-wider">Riwayat Alergi / Penyakit</Label>
                <Input 
                  value={formData.allergies} 
                  onChange={e => setFormData({...formData, allergies: e.target.value})} 
                  placeholder="Alergi makanan, obat, asma, dll (biarkan kosong jika tidak ada)" 
                  className="rounded-xl h-11 bg-white border-rose-200 text-slate-800 placeholder:text-slate-400" 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => router.push("/dashboard/admin/students")}
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
            Simpan Siswa
          </Button>
        </div>
      </form>
    </div>
  )
}
