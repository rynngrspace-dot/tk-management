"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCog, Save, Mail, User, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [showPw, setShowPw] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Pengguna"
    const userRole = localStorage.getItem("userRole") || "teacher"
    setUserName(name)
    setRole(userRole)

    // Pre-fill based on role
    if (userRole === "admin") {
      setFormData(prev => ({ ...prev, name, email: "admin@tk.com" }))
      setEmail("admin@tk.com")
    } else {
      setFormData(prev => ({ ...prev, name, email: "guru@tk.com" }))
      setEmail("guru@tk.com")
    }
  }, [])

  const initials = userName
    ? userName.split(" ").map(n => n[0]).join("").substring(0, 2)
    : "U"

  const handleSaveProfile = () => {
    if (!formData.name.trim()) {
      toast.error("Nama tidak boleh kosong!")
      return
    }
    localStorage.setItem("userName", formData.name)
    setUserName(formData.name)
    toast.success("Profil berhasil diperbarui!")
  }

  const handleChangePassword = () => {
    if (!formData.currentPassword) {
      toast.error("Masukkan password saat ini!")
      return
    }
    if (formData.currentPassword !== "123") {
      toast.error("Password saat ini salah!")
      return
    }
    if (!formData.newPassword || formData.newPassword.length < 3) {
      toast.error("Password baru minimal 3 karakter!")
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!")
      return
    }
    setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
    toast.success("Password berhasil diubah!")
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">{userName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                <ShieldCheck className="w-3 h-3" />
                {role === "admin" ? "Administrator" : "Guru"}
              </span>
              <span className="text-xs text-slate-400">{email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Informasi Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Lengkap</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="rounded-xl"
              placeholder="Nama Anda"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="pl-9 rounded-xl bg-slate-50/50"
                type="email"
                placeholder="email@tk.com"
              />
            </div>
          </div>
          <Button className="gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200" onClick={handleSaveProfile}>
            <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
          </Button>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-500" />
            Ubah Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password Saat Ini</Label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                className="rounded-xl pr-10"
                placeholder="••••••"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password Baru</Label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              className="rounded-xl"
              placeholder="Minimal 3 karakter"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Konfirmasi Password Baru</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="rounded-xl"
              placeholder="Ulangi password baru"
            />
          </div>
          <Button className="gradient-coral text-white rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200" onClick={handleChangePassword}>
            <Lock className="w-4 h-4 mr-2" /> Ubah Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
