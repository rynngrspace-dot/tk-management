"use client";

import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Page Header - Premium */}
      <section className="bg-slate-50 py-24 md:py-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-8xl font-bold text-slate-900 uppercase tracking-tighter mb-6">Hubungi Kami</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">Punya pertanyaan atau ingin berkunjung ke sekolah? Tim kami siap membantu Anda dengan sepenuh hati.</p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-24">
          {/* Info Column */}
          <div className="lg:col-span-1 space-y-16">
            <div>
              <h2 className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.4em] mb-12">Informasi Sekolah</h2>
              <div className="space-y-10">
                 <ContactItem 
                   icon={<MapPin className="w-6 h-6" />} 
                   title="Alamat" 
                   content="Jl. Pendidikan No. 123, Jakarta Timur, 13450, Indonesia" 
                 />
                 <ContactItem 
                   icon={<Phone className="w-6 h-6" />} 
                   title="Telepon" 
                   content="+62 (21) 1234-5678" 
                 />
                 <ContactItem 
                   icon={<Mail className="w-6 h-6" />} 
                   title="Email" 
                   content="info@tkalislah.sch.id" 
                 />
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
             <div className="p-12 md:p-20 border border-slate-100 bg-white shadow-2xl">
                <h3 className="text-3xl font-bold text-slate-900 uppercase mb-12 tracking-tight">Kirim Pesan</h3>
                <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Nama Lengkap</label>
                         <input type="text" className="w-full border-b-2 border-slate-100 py-4 focus:border-indigo-700 outline-none transition-colors font-bold text-slate-800" placeholder="Ahmad ..." />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Email</label>
                         <input type="email" className="w-full border-b-2 border-slate-100 py-4 focus:border-indigo-700 outline-none transition-colors font-bold text-slate-800" placeholder="ahmad@email.com" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Pesan</label>
                      <textarea className="w-full border-b-2 border-slate-100 py-4 focus:border-indigo-700 outline-none transition-colors font-bold text-slate-800 min-h-[150px] resize-none" placeholder="Tuliskan pesan Anda..."></textarea>
                   </div>
                   <Button className="bg-indigo-700 text-white px-12 h-20 font-bold uppercase tracking-widest text-xs rounded-none shadow-xl shadow-indigo-100">
                      Kirim Pesan
                   </Button>
                </form>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactItem({ icon, title, content }) {
  return (
    <div className="flex gap-8">
      <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center text-indigo-700 shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{title}</h4>
        <p className="font-bold text-slate-900 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
