"use client";

import { BookOpen, Award, Palette, Heart, Globe, Music } from "lucide-react";

export default function ProgramsPage() {
  return (
    <div className="bg-white">
      {/* Page Header - Premium */}
      <section className="bg-slate-50 py-24 md:py-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-8xl font-bold text-slate-900 uppercase tracking-tighter mb-6">Program Sekolah</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">Kurikulum terintegrasi yang dirancang khusus untuk menyeimbangkan potensi akademik, karakter, dan bakat anak.</p>
        </div>
      </section>

      {/* Main Programs Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-1">
          <ProgramItem 
            icon={<BookOpen className="w-10 h-10" />}
            title="Kurikulum Nasional"
            desc="Mengikuti standar pendidikan nasional dengan pendekatan pembelajaran tematik yang kreatif."
          />
          <ProgramItem 
            icon={<Heart className="w-10 h-10" />}
            title="Pendidikan Adab"
            desc="Pembiasaan karakter Islami harian seperti kejujuran, sopan santun, dan empati sosial."
          />
          <ProgramItem 
            icon={<Globe className="w-10 h-10" />}
            title="Literasi Dasar"
            desc="Pengenalan huruf, angka, dan dasar bahasa Inggris melalui metode bermain yang menyenangkan."
          />
        </div>
      </section>

      {/* Extra Programs */}
      <section className="py-32 bg-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
           <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em] mb-6">Ekstrakurikuler</h2>
           <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Mengasah Bakat & Minat.</h3>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           <ExtraItem icon={<Palette />} title="Seni & Lukis" />
           <ExtraItem icon={<Music />} title="Rebana & Vokal" />
           <ExtraItem icon={<Award />} title="Olahraga & Senam" />
        </div>
      </section>
    </div>
  );
}

function ProgramItem({ icon, title, desc }) {
  return (
    <div className="p-16 border border-slate-100 bg-white group hover:border-indigo-600 transition-all duration-500">
      <div className="w-20 h-20 bg-slate-50 flex items-center justify-center text-indigo-700 mb-10 group-hover:bg-indigo-700 group-hover:text-white transition-all">
        {icon}
      </div>
      <h4 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-tight">{title}</h4>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function ExtraItem({ icon, title }) {
  return (
    <div className="p-10 bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white hover:text-indigo-950 transition-all group">
       <div className="w-12 h-12 text-indigo-400 group-hover:text-indigo-700">{icon}</div>
       <h4 className="text-lg font-bold uppercase tracking-widest">{title}</h4>
    </div>
  );
}
