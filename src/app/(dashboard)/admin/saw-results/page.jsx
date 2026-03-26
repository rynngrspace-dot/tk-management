"use client";

import { useState, useEffect } from "react";
import { Calculator, AlertCircle, Medal, CheckCircle2, Info, FileDown, Trophy, Users, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function AdminSAWResultsPage() {
  const [classes, setClasses] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selectedClass, setSelectedClass] = useState(""); // "" means Semua Kelas
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [weeklyData, setWeeklyData] = useState({}); // { studentId: { week: { total, scores } } }
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Init Data (Classes & Criteria)
  useEffect(() => {
    const init = async () => {
      try {
        const [clsRes, criRes] = await Promise.all([
          fetch("/api/classes"),
          fetch("/api/criteria")
        ]);
        const [clsData, criData] = await Promise.all([
          clsRes.json(),
          criRes.json()
        ]);
        setClasses(clsData);
        setCriteria(criData);
      } catch (err) {
        console.error("Init failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Fetch Everything
  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const period = `${selectedMonth} ${selectedYear}`;
      
      const stuRes = await fetch(`/api/students?classId=${selectedClass}`);
      const stuData = await stuRes.json();
      setStudents(stuData);

      const resCount = await fetch(`/api/saw?classId=${selectedClass}&period=${encodeURIComponent(period)}`);
      const resData = await resCount.json();
      setResults(resData);

      const progRes = await fetch(`/api/progress?classId=${selectedClass}&month=${selectedMonth}&year=${selectedYear}`);
      const progData = await progRes.json();
      
      const totals = {};
      progData.forEach(p => {
        const sId = p.studentId;
        const week = p.week;
        if (!totals[sId]) totals[sId] = {};
        const criteriaScores = {};
        p.assessments.forEach(ass => {
          criteriaScores[ass.criteria.code] = ass.score;
        });
        totals[sId][week] = {
          total: p.assessments.reduce((sum, ass) => sum + (ass.score || 0), 0),
          scores: criteriaScores
        };
      });
      setWeeklyData(totals);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedClass, selectedMonth, selectedYear]);

  const handleCalculateSAW = async () => {
    if (!selectedClass) {
      setMessage({ type: "error", text: "Pilih satu kelas spesifik untuk melakukan kalkulasi." });
      return;
    }
    setIsCalculating(true);
    setMessage({ type: "", text: "" });
    try {
      const period = `${selectedMonth} ${selectedYear}`;
      const res = await fetch("/api/saw/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass,
          month: selectedMonth,
          year: selectedYear,
          period
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Gagal menghitung matriks SAW");
      setMessage({ type: "success", text: `Berhasil mengevaluasi ${data.processedStudents} siswa.` });
      fetchSummary();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsCalculating(false);
    }
  };

  const getSawResult = (studentId) => {
    return results.find(r => r.studentId === studentId);
  };

  const getRankStyle = (index) => {
    if (index === 0) return "bg-amber-100 text-amber-700 font-bold border-amber-200";
    if (index === 1) return "bg-slate-200 text-slate-700 font-bold border-slate-300";
    if (index === 2) return "bg-orange-100 text-orange-800 font-bold border-orange-200";
    return "bg-slate-50 text-slate-500 font-medium border-slate-100";
  };

  const getStatusStyle = (status) => {
    if (!status) return "bg-slate-100 text-slate-400 border-slate-200";
    if (status.includes("Sangat Baik")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status.includes("Sesuai Harapan")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (status.includes("Mulai Berkembang")) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-rose-100 text-rose-800 border-rose-200";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monitoring Hasil SAW (Sekolah)</h1>
          <p className="text-sm text-slate-500 mt-1">Laporan rekapitulasi peringkat perkembangan seluruh siswa</p>
        </div>
        
        <div className="flex gap-2">
           <button
            onClick={() => window.print()}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            Cetak Laporan
          </button>
          <button
            onClick={handleCalculateSAW}
            disabled={isCalculating || !selectedClass}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
          >
            <Calculator className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? "Menghitung..." : "Kalkulasi Ulang"}
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end mb-6">
        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="text-sm font-semibold text-slate-700">Filter Kelompok</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          >
            <option value="">Semua Kelompok / Kelas</option>
            {classes.map(c => <option key={c.id} value={c.id}>Kelas {c.name}</option>)}
          </select>
        </div>
        
        <div className="space-y-1.5 w-48">
          <label className="text-sm font-semibold text-slate-700">Periode</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="space-y-1.5 w-32">
          <label className="text-sm font-semibold text-slate-700">Tahun</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          >
            {[selectedYear - 1, selectedYear, selectedYear + 1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

      {/* Tabel Hasil Ranking */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
              <tr>
                <th className="px-6 py-4 w-16 text-center">Rank</th>
                <th className="px-6 py-4 min-w-[200px]">Nama Siswa</th>
                {!selectedClass && <th className="px-6 py-4">Kelompok</th>}
                {[1, 2, 3, 4, 5].map(w => (
                  <th key={w} className="px-3 py-4 text-center border-l border-slate-200">W{w}</th>
                ))}
                <th className="px-6 py-4 text-center border-l border-slate-200">Skor (V)</th>
                <th className="px-6 py-4">Status SAW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TooltipProvider>
                {students
                  .map(student => ({
                    ...student,
                    saw: results.find(r => r.studentId === student.id)
                  }))
                  .sort((a, b) => {
                    const scoreA = a.saw?.totalScore || 0;
                    const scoreB = b.saw?.totalScore || 0;
                    return scoreB - scoreA;
                  })
                  .map((student, idx) => {
                    const saw = student.saw;
                    const rankInResults = results.findIndex(r => r.studentId === student.id);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-center">
                          {saw ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto border ${getRankStyle(idx)}`}>
                              {idx === 0 ? <Trophy className="w-4 h-4" /> : idx + 1}
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-[10px] text-slate-400">NIS: {student.nis}</div>
                        </td>
                        {!selectedClass && (
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase border border-indigo-100">
                              {student.class?.name || student.classId}
                            </span>
                          </td>
                        )}
                        {[1, 2, 3, 4, 5].map(w => {
                          const weekData = weeklyData[student.id]?.[w];
                          return (
                            <td key={w} className="px-3 py-4 text-center border-l border-slate-100">
                              {weekData ? (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-[11px] font-bold text-indigo-600 cursor-help underline decoration-indigo-200 decoration-2 underline-offset-4">
                                      {weekData.total}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="p-3 bg-slate-900 text-white">
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-indigo-300 border-b border-white/10 pb-1 mb-1">Rincian Minggu {w}</p>
                                      {Object.entries(weekData.scores).map(([code, score]) => (
                                        <div key={code} className="flex justify-between gap-4">
                                          <span className="text-[10px] text-slate-400">{code}</span>
                                          <span className="text-[10px] font-bold">{score}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-center border-l border-slate-100">
                          {saw ? (
                            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 text-xs">
                              {saw.totalScore.toFixed(3)}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[10px]">TBA</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(saw?.status)}`}>
                            {saw ? saw.status.toUpperCase() : "BELUM DIHITUNG"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </TooltipProvider>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info & Legend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Legend Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 h-full">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Legend Kriteria</h3>
          </div>
          <div className="space-y-2.5">
            {criteria.map(c => (
              <div key={c.id} className="flex gap-3 items-start group">
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-indigo-100 shrink-0 mt-0.5">
                  {c.code}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-700 leading-none truncate group-hover:text-indigo-600 transition-colors">{c.name}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Bobot: {c.weight}%</p>
                </div>
              </div>
            ))}
            {criteria.length === 0 && (
              <p className="text-[10px] text-slate-400 italic">Memuat kriteria...</p>
            )}
          </div>
        </div>

        {/* Algorithm Card */}
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Transparansi Algoritma Admin (SAW)</h3>
                <p className="text-xs text-indigo-300/80 font-medium">Simple Additive Weighting — Penilaian Objektif Multi-Besaran</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 relative group">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">01</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Aggregasi Bulanan</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                  Sistem menarik seluruh input (0-100) dari guru (Agama, Fisik, Kognitif, dll) selama sebulan. Nilai-nilai ini dirata-ratakan untuk mendapatkan 1 skor tunggal per kriteria bagi tiap siswa.
                </p>
              </div>

              <div className="space-y-3 relative overflow-hidden group">
                 <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">02</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Normalisasi Matriks</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                  Mengonversi nilai 0-100 ke skala **0 s/d 1**. Rumus: `Nilai / Nilai Maksimum` di kelas. 
                  Contoh: Jika nilai tertinggi kelas adalah **100**, maka input **85** menjadi **0.85**. Ini memastikan perbandingan yang adil.
                </p>
              </div>

              <div className="space-y-3 relative group">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">03</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Weighted Sum (V)</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                  Skor normal dikalikan **Bobot (%)** masing-masing kriteria. Hasil penjumlahan seluruh kriteria membentuk skor **V**. Siswa dengan skor **V** tertinggi menduduki peringkat satu di angkatannya.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 italic text-[10px] text-indigo-200/60 leading-relaxed">
              <Info className="w-3 h-3 shrink-0" />
              <span>Peringkat dihitung secara dinamis setiap kali tombol "Kalkulasi" ditekan guna mengakomodasi pembaruan nilai terbaru dari guru.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
