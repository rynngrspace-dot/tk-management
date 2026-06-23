"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";

const WEEKS = [1, 2, 3, 4, 5];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// PAUD national scale 1–4
const PAUD_SCALE = [
  { value: 1, label: "BB", desc: "Belum Berkembang" },
  { value: 2, label: "MB", desc: "Mulai Berkembang" },
  { value: 3, label: "BSH", desc: "Berkembang Sesuai Harapan" },
  { value: 4, label: "BSB", desc: "Berkembang Sangat Baik" },
];

const SCALE_COLORS = {
  1: "bg-rose-50 text-rose-700 border-rose-200",
  2: "bg-amber-50 text-amber-700 border-amber-200",
  3: "bg-blue-50 text-blue-700 border-blue-200",
  4: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function AssessmentPage() {
  const [classes, setClasses] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resProfile, resClasses, resCriteria] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/classes"),
          fetch("/api/criteria")
        ]);

        if (!resProfile.ok || !resClasses.ok || !resCriteria.ok) throw new Error("Gagal mengambil data awal");

        const profile = await resProfile.json();
        const classesData = await resClasses.json();
        const criteriaData = await resCriteria.json();

        setClasses(classesData);
        setCriteria(criteriaData);
        setUserRole(profile.role);
        
        if (profile.role === "teacher" && profile.classId) {
          setSelectedClass(profile.classId);
        } else if (classesData.length > 0) {
          setSelectedClass(classesData[0].id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data awal");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setIsLoading(true);
    Promise.all([
      fetch(`/api/students?classId=${selectedClass}`).then(r => r.json()),
      fetch(`/api/progress?classId=${selectedClass}&week=${selectedWeek}&month=${selectedMonth}&year=${selectedYear}`).then(r => r.json())
    ]).then(([studentsData, progressData]) => {
      setStudents(studentsData);
      const newFormData = {};
      studentsData.forEach(student => {
        const existingProg = progressData.find(p => p.studentId === student.id);
        const scoresMap = {};
        if (existingProg) {
          existingProg.assessments.forEach(a => {
            scoresMap[a.criteriaId] = a.score;
          });
        }
        newFormData[student.id] = { note: existingProg?.note || "", scores: scoresMap };
      });
      setFormData(newFormData);
      setIsLoading(false);
      setMessage({ type: "", text: "" });
    });
  }, [selectedClass, selectedWeek, selectedMonth, selectedYear]);

  const handleScoreChange = (studentId, criteriaId, value) => {
    setFormData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], scores: { ...prev[studentId].scores, [criteriaId]: value } }
    }));
  };

  const handleNoteChange = (studentId, value) => {
    setFormData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], note: value }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    const studentsPayload = Object.keys(formData).map(studentId => {
      const studentData = formData[studentId];
      const scoresArray = Object.keys(studentData.scores)
        .map(cId => ({ criteriaId: parseInt(cId), score: parseInt(studentData.scores[cId]) }))
        .filter(s => !isNaN(s.score) && s.score >= 1 && s.score <= 4);
      return { studentId: parseInt(studentId), note: studentData.note, scores: scoresArray };
    });

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week: selectedWeek, month: selectedMonth, year: selectedYear, studentsData: studentsPayload })
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");
      setMessage({ type: "success", text: "Data penilaian berhasil disimpan!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && criteria.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Input Nilai Mingguan</h1>
        <p className="text-sm text-slate-500 mt-1">Masukkan nilai perkembangan anak sesuai skala PAUD nasional (BB / MB / BSH / BSB)</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        {(!userRole || userRole === "admin") && (
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
        <div className="space-y-1.5 w-32">
          <label className="text-sm font-semibold text-slate-700">Minggu Ke</label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          >
            {WEEKS.map(w => <option key={w} value={w}>Minggu {w}</option>)}
          </select>
        </div>
        <div className="space-y-1.5 w-48">
          <label className="text-sm font-semibold text-slate-700">Bulan</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="space-y-1.5 w-28">
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

      {/* PAUD Scale Legend */}
      <div className="flex flex-wrap gap-2 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Skala PAUD:</span>
        {PAUD_SCALE.map(s => (
          <span key={s.value} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${SCALE_COLORS[s.value]}`}>
            <span className="font-black">{s.label}</span>
            <span className="font-normal opacity-80">({s.value}) {s.desc}</span>
          </span>
        ))}
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

      {criteria.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-100">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800">Kriteria Belum Diatur</h3>
          <p className="text-slate-500 text-sm mt-1">Admin harus menambahkan kriteria SAW terlebih dahulu.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap sticky left-0 bg-slate-50 z-20 shadow-[1px_0_0_#e2e8f0]">Nama Siswa</th>
                  {criteria.map(c => (
                    <th key={c.id} className="px-4 py-4 font-semibold text-center min-w-[140px]" title={c.name}>
                      <div className="text-slate-700">{c.code}</div>
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5 truncate max-w-[130px]">{c.name}</div>
                    </th>
                  ))}
                  <th className="px-6 py-4 font-semibold min-w-[260px]">Catatan Perkembangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 sticky left-0 bg-white shadow-[1px_0_0_#e2e8f0] z-10 whitespace-nowrap">
                      {student.name}
                    </td>
                    {criteria.map(c => {
                      const currentVal = formData[student.id]?.scores?.[c.id];
                      const valInt = currentVal ? parseInt(currentVal) : null;
                      return (
                        <td key={c.id} className="px-2 py-3 text-center">
                          <select
                            value={currentVal || ""}
                            onChange={(e) => handleScoreChange(student.id, c.id, e.target.value)}
                            className={`w-full max-w-[130px] px-2 py-2 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                              valInt
                                ? SCALE_COLORS[valInt]
                                : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-white"
                            }`}
                          >
                            <option value="">— Pilih —</option>
                            {PAUD_SCALE.map(s => (
                              <option key={s.value} value={s.value}>
                                {s.label} ({s.value})
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        placeholder="Contoh: Sangat aktif dalam kegiatan..."
                        value={formData[student.id]?.note || ""}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 hover:bg-white transition-colors"
                      />
                    </td>
                  </tr>
                ))}
                {students.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={criteria.length + 2} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada siswa di kelas ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Nilai yang belum dipilih tidak akan disimpan. Pilihan: 1 (BB) — 2 (MB) — 3 (BSH) — 4 (BSB).</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || students.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-indigo-200 shrink-0"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Menyimpan..." : "Simpan Penilaian"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
