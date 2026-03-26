"use client";

import { useState, useEffect } from "react";
import { Users, Calculator, FileText, CheckCircle2, AlertCircle, Medal, Calendar, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function ProgressSummaryPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [userRole, setUserRole] = useState("");
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [weeklyTotals, setWeeklyTotals] = useState({}); // { studentId: { week: { total, criteria: { code: score } } } }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const teacherClassId = localStorage.getItem("classId");
    setUserRole(role);

    fetch("/api/classes")
      .then(r => r.json())
      .then(data => {
        setClasses(data);
        if (role === "teacher" && teacherClassId) {
          setSelectedClass(teacherClassId);
        } else if (data.length > 0) {
          setSelectedClass(data[0].id);
        }
        setIsLoading(false);
      });
  }, []);

  const fetchSummary = async () => {
    if (!selectedClass) return;
    setIsLoading(true);
    try {
      const period = `${selectedMonth} ${selectedYear}`;
      
      // Fetch Students in class
      const studentsRes = await fetch(`/api/students?classId=${selectedClass}`);
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      // Fetch SAW results
      const sawRes = await fetch(`/api/saw?classId=${selectedClass}&period=${encodeURIComponent(period)}`);
      const sawData = await sawRes.json();
      setResults(sawData);

      // Fetch all weekly progress for the class in this period to calculate W1-W5
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

        // Sum all assessment scores for this week
        const weekTotal = p.assessments.reduce((sum, ass) => sum + (ass.score || 0), 0);
        totals[sId][week] = {
          total: weekTotal,
          scores: criteriaScores
        };
      });
      setWeeklyTotals(totals);

    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedClass, selectedMonth, selectedYear]);

  const getStatusStyle = (status) => {
    if (!status) return "bg-slate-100 text-slate-400 border-slate-200";
    if (status.includes("Sangat Baik")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status.includes("Sesuai Harapan")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (status.includes("Mulai Berkembang")) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-rose-100 text-rose-800 border-rose-200";
  };

  const getSawResult = (studentId) => {
    return results.find(r => r.studentId === studentId);
  };

  if (isLoading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ringkasan Progres Mingguan</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar perkembangan seluruh siswa berdasarkan input mingguan dan hasil SAW</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm font-semibold">{students.length} Siswa</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        {userRole === "admin" && (
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-sm font-semibold text-slate-700">Kelas</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            >
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold w-16 text-center">No</th>
                <th className="px-6 py-4 font-semibold min-w-[200px]">Nama Siswa</th>
                {[1, 2, 3, 4, 5].map(w => (
                  <th key={w} className="px-3 py-4 font-semibold text-center border-l border-slate-200 bg-slate-50/50">W{w}</th>
                ))}
                <th className="px-4 py-4 font-semibold text-center border-l border-slate-200">Skor Total (V)</th>
                <th className="px-6 py-4 font-semibold">Keterangan (SAW)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TooltipProvider>
                {students.map((student, idx) => {
                  const saw = getSawResult(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-400">NIS: {student.nis}</div>
                      </td>
                      {[1, 2, 3, 4, 5].map(w => {
                        const weekData = weeklyTotals[student.id]?.[w];
                        return (
                          <td key={w} className="px-3 py-4 text-center border-l border-slate-100/50">
                            {weekData ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md cursor-help hover:bg-indigo-100 transition-colors">
                                    {weekData.total}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="p-3 bg-slate-900 text-white border-0 shadow-xl rounded-xl">
                                  <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 border-b border-white/10 pb-1 mb-1">Breakdown Nilai W{w}</p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                      {Object.entries(weekData.scores).map(([code, score]) => (
                                        <div key={code} className="flex justify-between items-center gap-3">
                                          <span className="text-[10px] text-slate-400 font-mono">{code}:</span>
                                          <span className="text-[10px] font-bold">{score}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-4 text-center border-l border-slate-100">
                        {saw ? (
                          <div className="inline-block bg-indigo-50 px-2.5 py-1 rounded-lg text-indigo-700 font-mono font-bold text-xs border border-indigo-100">
                            {saw.totalScore.toFixed(3)}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">Belum dihitung</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(saw?.status)}`}>
                          {saw ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              {saw.status.toUpperCase()}
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              BELUM ADA DATA
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </TooltipProvider>
              {students.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center">
                    <div className="max-w-xs mx-auto">
                      <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <h3 className="font-bold text-slate-700">Belum Ada Data Siswa</h3>
                      <p className="text-slate-500 text-sm mt-1">
                        Daftar siswa di kelas ini kosong.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Detail Nilai (Hover)</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Arahkan kursor ke angka di kolom <b>W (Minggu)</b> untuk melihat rincian nilai tiap kriteria yang sudah diinput.
            </p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Sinkronisasi SAW</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Skor Total dan Keterangan muncul otomatis setelah Anda melakukan kalkulasi di menu <b>Hasil SAW</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
