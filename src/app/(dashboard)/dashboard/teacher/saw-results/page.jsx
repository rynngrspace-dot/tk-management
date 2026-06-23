"use client";

import { useState, useEffect } from "react";
import { Calculator, AlertCircle, Medal, CheckCircle2, Info, Trophy, Users, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function SawResultsPage() {
  const [classes, setClasses] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [weeklyData, setWeeklyData] = useState({}); // { studentId: { week: { total, scores } } }
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userRole, setUserRole] = useState("");

  // Init Data (Classes, Role, Criteria)
  useEffect(() => {
    const init = async () => {
      try {
        const [profRes, clsRes, criRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/classes"),
          fetch("/api/criteria")
        ]);
        
        if (!profRes.ok || !clsRes.ok || !criRes.ok) throw new Error("Gagal mengambil data awal");

        const profData = await profRes.json();
        const clsData = await clsRes.json();
        const criData = await criRes.json();

        setUserRole(profData.role);
        setClasses(clsData);
        setCriteria(criData);
        
        if (profData.role === "teacher" && profData.classId) {
          setSelectedClass(profData.classId);
        } else if (clsData.length > 0) {
          setSelectedClass(clsData[0].id);
        }
      } catch (err) {
        console.error("Init error:", err);
        toast.error("Gagal koordinasi dengan server");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Fetch Results and Progress
  const fetchSummary = async () => {
    if (!selectedClass) return;
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
      setMessage({ type: "success", text: `Berhasil mengevaluasi ${data.processedStudents} siswa via algoritma SAW.` });
      fetchSummary();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsCalculating(false);
    }
  };

  const getRankStyle = (index) => {
    if (index === 0) return "bg-amber-100 text-amber-700 font-bold border-amber-200";
    if (index === 1) return "bg-slate-200 text-slate-700 font-bold border-slate-300";
    if (index === 2) return "bg-orange-100 text-orange-800 font-bold border-orange-200";
    return "bg-slate-50 text-slate-500 font-medium border-slate-100";
  };

  const getStatusStyle = (status) => {
    if (!status) return "bg-slate-100 text-slate-400 border-slate-200";
    if (status.includes("Sangat Baik")) return "bg-emerald-100 text-emerald-800";
    if (status.includes("Sesuai Harapan")) return "bg-blue-100 text-blue-800";
    if (status.includes("Mulai Berkembang")) return "bg-amber-100 text-amber-800";
    return "bg-rose-100 text-rose-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hasil Kalkulasi SAW</h1>
          <p className="text-sm text-slate-500 mt-1">Sistem Pendukung Keputusan Tumbuh Kembang Anak</p>
        </div>
        
        <button
          onClick={handleCalculateSAW}
          disabled={isCalculating || !selectedClass}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
        >
          <Calculator className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
          {isCalculating ? "Menghitung Matriks..." : "Kalkulasi Nilai SAW Baru"}
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end mb-6">
        {(!userRole || userRole === "admin") && (
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-sm font-semibold text-slate-700">Kelas</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              disabled={isLoading}
            >
              {userRole === "admin" && <option value="">Semua Kelas</option>}
              {classes.map(c => <option key={c.id} value={c.id}>Kelas {c.name}</option>)}
            </select>
          </div>
        )}
        
        <div className="space-y-1.5 w-48">
          <label className="text-sm font-semibold text-slate-700">Periode Bulan</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            disabled={isLoading}
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
            disabled={isLoading}
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
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold w-16 text-center">Rank</th>
                <th className="px-6 py-4 font-semibold">Nama Siswa</th>
                {!selectedClass && <th className="px-6 py-4 font-semibold">Kelas</th>}
                {[1, 2, 3, 4, 5].map(w => (
                  <th key={w} className="px-3 py-4 text-center border-l border-slate-200 font-semibold text-[11px]">W{w}</th>
                ))}
                <th className="px-6 py-4 font-semibold text-center border-l border-slate-200">Skor (V)</th>
                <th className="px-6 py-4 font-semibold">Evaluasi</th>
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
                          <div className="text-[11px] text-slate-500 font-medium">NIS: {student.nis}</div>
                        </td>
                        {!selectedClass && (
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                              {student.class?.name || student.classId}
                            </span>
                          </td>
                        )}
                        {[1, 2, 3, 4, 5].map(w => {
                          const weekData = weeklyData[student.id]?.[w];
                          return (
                            <td key={w} className="px-3 py-4 text-center border-l border-slate-100/50">
                              {weekData ? (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-[11px] font-bold text-indigo-600 cursor-help underline decoration-indigo-200 decoration-2 underline-offset-4">
                                      {weekData.total}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="p-3 bg-slate-900 text-white">
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold text-indigo-300 border-b border-white/10 pb-1 mb-1">Breakdown W{w}</p>
                                      {Object.entries(weekData.scores).map(([code, score]) => (
                                        <div key={code} className="flex justify-between gap-4 py-0.5">
                                          <span className="text-[10px] text-slate-400 font-mono">{code}:</span>
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
                            <span className="text-slate-300 text-[10px]">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(saw?.status)}`}>
                            {saw ? saw.status.toUpperCase() : "BELUM TERKOMPUTASI"}
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
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Kamus Kriteria</h3>
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
          </div>
        </div>

        {/* Algorithm Card */}
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="bg-indigo-600 p-2.5 rounded-xl">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Cara Kerja Algoritma SAW</h3>
                <p className="text-xs text-indigo-300/80 font-medium">Simple Additive Weighting - Penilaian Objektif</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 relative group">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">01</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 text-[10px]">Aggregasi Nilai</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                  Seluruh input kriteria Mingguan (W1-W5) dirata-ratakan selama sebulan untuk mendapatkan 1 skor dasar per kriteria.
                </p>
              </div>

              <div className="space-y-3 relative overflow-hidden group">
                 <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">02</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 text-[10px]">Normalisasi 0-1</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                  Skor diubah ke skala desimal (0 s/d 1) dengan membagi skor siswa dengan **Skor Maksimum** di kelas tersebut.
                </p>
              </div>

              <div className="space-y-3 relative group">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">03</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 text-[10px]">Pembobotan (V)</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                  Nilai desimal dikalikan **Bobot Kriteria (%)**. Jumlah total seluruh kriteria menghasilkan skor akhir (V) untuk ranking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
