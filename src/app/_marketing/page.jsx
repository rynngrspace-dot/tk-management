"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, School, BookOpen, Award, Users2, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section - Premium & Bold */}
      <section className="relative pt-24 pb-20 md:pt-48 md:pb-40 bg-slate-50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-20" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">
              <Sparkles className="w-4 h-4 fill-indigo-700" />
              <span>Terakreditasi A Nasional</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-10 leading-[0.9] uppercase">
              Masa Depan <br />
              <span className="text-indigo-700 italic font-bold">Dimulai Dari Sini.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl font-medium mb-12">
              Lembaga pendidikan anak usia dini yang berfokus pada keseimbangan kecerdasan intelektual, emosional, dan spiritual berlandaskan adab Islami.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="bg-indigo-700 hover:bg-indigo-800 text-white px-12 h-20 text-xs font-bold uppercase tracking-widest rounded-none shadow-2xl shadow-indigo-200 w-full sm:w-auto">
                  Daftar Siswa Baru
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="border-2 border-slate-900 text-slate-900 px-12 h-20 text-xs font-bold uppercase tracking-widest rounded-none w-full sm:w-auto">
                  Pelajari Profil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Elegant Bold */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.4em] mb-10">Filosofi Kami</h2>
            <p className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter text-slate-900 mb-12 uppercase italic">
              "Menanamkan nilai-nilai kebaikan yang akan tumbuh seumur hidup."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-[2px] bg-indigo-700"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Prinsip TK Al Islah</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <HighlightCard
              icon={<School className="w-8 h-8" />}
              title="Akreditasi A"
              desc="Standar pendidikan nasional dengan jaminan kualitas terbaik untuk putra-putri Anda."
            />
            <HighlightCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Tahfidz Cilik"
              desc="Membangun kecintaan pada Al-Qur'an sejak dini melalui program hafalan surat pendek."
            />
            <HighlightCard
              icon={<Award className="w-8 h-8" />}
              title="Adab & Karakter"
              desc="Pembentukan akhlak mulia sebagai landasan utama pendidikan kami."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function HighlightCard({ icon, title, desc }) {
  return (
    <div className="p-12 bg-white border border-slate-100 group hover:border-indigo-600 transition-all duration-500">
      <div className="w-16 h-16 bg-slate-50 flex items-center justify-center text-indigo-700 mb-8 group-hover:bg-indigo-700 group-hover:text-white transition-all">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
