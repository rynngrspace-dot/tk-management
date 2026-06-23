"use client";

import { School, Gamepad2, Users2, Baby, Clock, ShieldCheck } from "lucide-react";

export default function FacilitiesPage() {
  const facilities = [
    {
      title: "Ruang Kelas Ber-AC",
      desc: "Setiap kelas dilengkapi dengan pendingin ruangan untuk menjaga kenyamanan anak selama proses belajar mengajar.",
      icon: <Clock className="w-10 h-10" />,
      image: "bg-slate-100"
    },
    {
      title: "Area Bermain Aman",
      desc: "Taman bermain indoor dan outdoor yang dirancang dengan standar keamanan tinggi bagi anak usia dini.",
      icon: <Gamepad2 className="w-10 h-10" />,
      image: "bg-slate-200"
    },
    {
      title: "Musholla Sekolah",
      desc: "Sarana ibadah khusus untuk pembiasaan sholat berjamaah dan praktik wudhu harian.",
      icon: <Users2 className="w-10 h-10" />,
      image: "bg-slate-300"
    },
    {
      title: "UKS & Klinik Kesehatan",
      desc: "Fasilitas kesehatan dasar untuk penanganan pertama dan pemeriksaan kesehatan berkala.",
      icon: <Baby className="w-10 h-10" />,
      image: "bg-slate-100"
    },
    {
      title: "CCTV 24 Jam",
      desc: "Sistem pengawasan kamera di seluruh area sekolah untuk menjamin keamanan setiap siswa.",
      icon: <ShieldCheck className="w-10 h-10" />,
      image: "bg-slate-200"
    },
    {
      title: "Perpustakaan Cilik",
      desc: "Koleksi buku cerita bergambar yang menarik untuk menanamkan minat baca sejak dini.",
      icon: <School className="w-10 h-10" />,
      image: "bg-slate-300"
    }
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-slate-50 py-20 md:py-32 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-4">Fasilitas</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">Menyediakan lingkungan belajar yang representatif, aman, dan nyaman untuk mendukung aktivitas putra-putri Anda.</p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {facilities.map((f, i) => (
            <div key={i} className="group">
              <div className={`aspect-video ${f.image} mb-8 border border-slate-100 relative flex items-center justify-center`}>
                 <div className="text-indigo-200 opacity-30">{f.icon}</div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-indigo-50 flex-shrink-0 flex items-center justify-center text-indigo-600 font-black">
                    0{i+1}
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Highlight */}
      <section className="py-24 bg-slate-900 text-white">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tight italic text-indigo-400">Keamanan Adalah Komitmen Kami.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">Seluruh fasilitas sekolah dirancang dengan mempertimbangkan aspek ergonomi dan keselamatan anak. Kami melakukan perawatan berkala untuk memastikan semua sarana tetap dalam kondisi terbaik.</p>
         </div>
      </section>
    </div>
  );
}
