"use client";

import { Target, BookOpen, Users, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Page Header - Premium */}
      <section className="bg-slate-50 py-24 md:py-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-8xl font-bold text-slate-900 uppercase tracking-tighter mb-6">Profil Sekolah</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">Mengenal lebih dalam sejarah, visi, dan misi TK Al Islah dalam mendidik generasi masa depan yang bertaqwa.</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="aspect-[4/3] bg-slate-100 border-[20px] border-white shadow-2xl flex items-center justify-center text-slate-200">
             <Users className="w-32 h-32" />
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.4em] mb-6">Sambutan Kepala Sekolah</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 uppercase tracking-tight italic">"Membangun Karakter Adalah Prioritas Utama Kami."</h3>
            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
              Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di TK Al Islah. Kami percaya bahwa pendidikan anak usia dini adalah masa keemasan yang harus diisi dengan kasih sayang dan stimulasi yang tepat. Di sini, kami tidak hanya fokus pada kecerdasan kognitif, tetapi juga pembentukan akhlak yang mulia.
            </p>
            <div className="pt-10 border-t border-slate-100">
               <p className="font-bold text-slate-900 text-lg uppercase tracking-tight">Hj. Siti Aminah, S.Pd.I</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kepala Sekolah TK Al Islah</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Dark Premium */}
      <section className="py-32 bg-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <Target className="w-8 h-8 text-indigo-400" />
              <h2 className="text-3xl font-bold uppercase tracking-tight">Visi</h2>
            </div>
            <p className="text-2xl text-indigo-100 leading-relaxed font-medium italic">
              "Menjadi lembaga pendidikan anak usia dini yang unggul dalam membentuk generasi bertaqwa, berakhlak mulia, cerdas, kreatif, dan mandiri berlandaskan Al-Qur'an dan Sunnah."
            </p>
          </div>
          
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-indigo-400" />
              <h2 className="text-3xl font-bold uppercase tracking-tight">Misi</h2>
            </div>
            <ul className="space-y-6 text-indigo-100/70 font-medium">
              {[
                "Menyelenggarakan pendidikan berbasis nilai-nilai Islami.",
                "Mengembangkan potensi anak melalui kegiatan bermain yang edukatif.",
                "Menciptakan lingkungan sekolah yang bersih, sehat, dan Islami.",
                "Membangun kerjasama yang harmonis antara sekolah dan orang tua."
              ].map((misi, i) => (
                <li key={i} className="flex gap-4">
                   <div className="w-7 h-7 bg-indigo-700 flex-shrink-0 flex items-center justify-center font-bold text-xs">0{i+1}</div>
                   <p className="leading-relaxed">{misi}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
