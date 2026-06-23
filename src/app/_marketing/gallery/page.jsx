"use client";

import { Image as ImageIcon, Camera } from "lucide-react";

export default function GalleryPage() {
  const items = [
    { title: "Manasik Haji Cilik 2024", category: "Kegiatan Tahunan" },
    { title: "Belajar Mewarnai", category: "Aktivitas Kelas" },
    { title: "Senam Pagi Bersama", category: "Olahraga" },
    { title: "Lomba Mewarnai", category: "Perlombaan" },
    { title: "Kunjungan ke Perpustakaan", category: "Edukasi" },
    { title: "Praktik Sholat Berjamaah", category: "Religius" },
    { title: "Pentas Seni Akhir Tahun", category: "Kegiatan Tahunan" },
    { title: "Eksperimen Sains Sederhana", category: "Aktivitas Kelas" },
  ];

  return (
    <div className="bg-white">
      {/* Page Header - Premium */}
      <section className="bg-slate-50 py-24 md:py-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-8xl font-bold text-slate-900 uppercase tracking-tighter mb-6">Galeri Sekolah</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">Melihat keceriaan dan perkembangan putra-putri kami melalui berbagai aktivitas di sekolah.</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {items.map((item, i) => (
               <div key={i} className="group relative aspect-square bg-slate-50 border border-slate-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                     <ImageIcon className="w-16 h-16" />
                  </div>
                  <div className="absolute inset-0 bg-indigo-700/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center translate-y-8 group-hover:translate-y-0">
                     <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.3em] mb-4">{item.category}</p>
                     <h4 className="text-white text-lg font-bold uppercase tracking-tight leading-tight">{item.title}</h4>
                     <div className="mt-8 w-12 h-[2px] bg-white/30" />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
