"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Berhasil login sebagai ${data.user.name}`);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userName", data.user.name);

        if (data.user.classId) {
          localStorage.setItem("classId", data.user.classId);
        } else {
          localStorage.removeItem("classId");
        }

        if (data.user.studentId) {
          localStorage.setItem("studentId", data.user.studentId.toString());
        } else {
          localStorage.removeItem("studentId");
        }

        if (data.user.role === "admin") {
          router.push("/dashboard/admin");
        } else if (data.user.role === "parent") {
          router.push("/dashboard/parent");
        } else {
          router.push("/dashboard/teacher");
        }
      } else {
        toast.error(data.error || "Email atau password salah");
        setIsLoading(false);
      }
    } catch {
      toast.error("Gagal terhubung ke server");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/10 rounded-full animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-400/20 rounded-full animate-blob" style={{ animationDelay: "4s" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
              <img src="/assets/images/tklogo.png" alt="Logo TK Al Islah" className="w-full h-full object-contain" />
            </div>
            <span className="text-white/80 text-base font-semibold">Sistem Manajemen TK Al Islah</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight tracking-tighter uppercase">
              TK Al Islah
              <span className="text-indigo-200 text-xl lg:text-2xl font-bold block mt-2 opacity-90 tracking-normal capitalize">Membangun Karakter Anak</span>
            </h1>
          </div>

          <div className="space-y-6 max-w-md">
            <p className="text-indigo-100 text-sm lg:text-base font-medium leading-relaxed border-l-2 border-indigo-400/30 pl-4">
              Platform manajemen pendidikan yang berfokus pada melatih <span className="text-white font-bold decoration-indigo-300 underline underline-offset-4">motorik</span>, mengembangkan <span className="text-white font-bold decoration-indigo-300 underline underline-offset-4">kreativitas</span>, bahasa, sains dan numerasi anak.
            </p>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl inline-block shadow-xl shadow-indigo-900/20">
              <div className="text-xs lg:text-sm font-bold text-white flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse" />
                Pilar Karakter & Praktik Ibadah
              </div>
              <p className="text-[10px] lg:text-xs text-indigo-100 mt-1.5 ml-4.5 opacity-80 leading-snug">Mengenal Nilai Agama dan Moral sejak dini.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-indigo-300 text-xs">© 2026 TK Al Islah. Hak Cipta Dilindungi.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50 bg-dots relative">
        {/* Mobile decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-100 rounded-full opacity-40 lg:hidden" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-violet-100 rounded-full opacity-40 lg:hidden" />

        <div className="w-full max-w-[420px] animate-scale-in relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img src="/assets/images/tklogo.png" alt="Logo TK Al Islah" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">TK Al Islah</h1>
          </div>

          <Card className="shadow-xl shadow-indigo-500/5 border-0 bg-white/80 backdrop-blur-sm">
            <form onSubmit={handleLogin}>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
                  Selamat Datang!
                </CardTitle>
                <CardDescription className="text-slate-500 text-sm">
                  Masuk ke akun Anda untuk melanjutkan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@tk.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl bg-slate-50/80 border-slate-200 focus:border-indigo-400 focus:bg-white transition-all duration-200"
                  />
                </div>
                <div className="space-y-2 mb-5">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl bg-slate-50/80 border-slate-200 focus:border-indigo-400 focus:bg-white transition-all duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button
                  className="w-full h-11 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:opacity-95 transition-all duration-200 text-sm"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Masuk
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-slate-400">Akun Demo</p>
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center justify-center gap-2 text-xs text-slate-500 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-100">
                <span className="font-semibold text-indigo-600">Admin:</span> admin@tk.com
                <span className="text-slate-300">|</span>
                <span className="font-semibold text-indigo-600">Guru:</span> guru@tk.com
              </div>
              <p className="text-[11px] text-slate-400">Password: <span className="font-semibold text-slate-600">123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
