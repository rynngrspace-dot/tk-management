"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";

export default function MarketingLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/about" },
    { name: "Program", href: "/programs" },
    { name: "Fasilitas", href: "/facilities" },
    { name: "Galeri", href: "/gallery" },
    { name: "Kontak", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar - Formal */}
      <div className="hidden lg:block bg-indigo-950 text-white py-2 text-[11px] font-bold tracking-wider">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center uppercase">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-indigo-400" /> +62 (21) 1234-5678</span>
            <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-indigo-400" /> info@tkalishlah.sch.id</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Jl. Pendidikan No. 123, Jakarta Timur
          </div>
        </div>
      </div>

      {/* Main Navbar - Premium Fixed */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-4" : "bg-white py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">I</div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 leading-none uppercase">TK AL ISHLAH</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Islamic Kindergarten</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[12px] font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-700 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/login">
              <Button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold uppercase tracking-widest text-[10px] px-8 h-12 rounded-none shadow-xl shadow-indigo-100">
                PORTAL LOGIN
              </Button>
            </Link>
          </div>

          <button className="lg:hidden p-2 text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden fixed inset-0 bg-white z-[60] transition-transform duration-500 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-16">
              <span className="font-bold text-2xl text-indigo-700 uppercase">TK AL ISHLAH</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-10 h-10 text-slate-400" /></button>
            </div>
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-3xl font-bold text-slate-900 uppercase" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-100 my-4" />
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-indigo-700 text-white py-8 text-xl font-bold rounded-none uppercase tracking-widest">
                  PORTAL LOGIN
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xl">I</div>
              <span className="font-bold text-2xl text-white uppercase tracking-tight">TK Al Ishlah</span>
            </div>
            <p className="max-w-md text-slate-500 leading-relaxed text-sm font-medium">
              Membangun generasi yang bertakwa, berakhlak mulia, cerdas, dan kreatif berlandaskan nilai-nilai Al-Qur'an dan Sunnah.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-8">Navigasi</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-[10px]">
              {navLinks.map(link => (
                <li key={link.name}><Link href={link.href} className="hover:text-indigo-400 transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-8">Kontak</h4>
            <ul className="space-y-6 text-sm font-medium">
              <li className="flex gap-3"><MapPin className="w-5 h-5 text-indigo-500 shrink-0" /> Jakarta Timur, Indonesia</li>
              <li className="flex gap-3"><Phone className="w-5 h-5 text-indigo-500 shrink-0" /> +62 21 1234 5678</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
          © {new Date().getFullYear()} TK Al Ishlah Jakarta. Seluruh Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}
