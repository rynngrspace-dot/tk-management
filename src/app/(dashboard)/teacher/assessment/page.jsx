"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";

const WEEKS = [1, 2, 3, 4, 5];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function AssessmentPage() {
  const [classes, setClasses] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Filters
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Form State: { studentId: { note: "", scores: { criteriaId: score } } }
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const teacherClassId = localStorage.getItem("classId");
    setUserRole(role);
    
    Promise.all([
      fetch("/api/classes").then(r => r.json()),
      fetch("/api/criteria").then(r => r.json())
    ]).then(([classesData, criteriaData]) => {
      setClasses(classesData);
      setCriteria(criteriaData);
      
      if (role === "teacher" && teacherClassId) {
        setSelectedClass(teacherClassId);
      } else if (classesData.length > 0) {
        setSelectedClass(classesData[0].id);
      }
      setIsLoading(false);
    });
  }, []);

  // Fetch Students & existing Progress when filters change
  useEffect(() => {
    if (!selectedClass) return;
    
    setIsLoading(true);
    Promise.all([
      fetch(`/api/students?classId=${selectedClass}`).then(r => r.json()),
      fetch(`/api/progress?classId=${selectedClass}&week=${selectedWeek}&month=${selectedMonth}&year=${selectedYear}`).then(r => r.json())
    ]).then(([studentsData, progressData]) => {
      setStudents(studentsData);
      
      // Initialize form data
      const newFormData = {};
      studentsData.forEach(student => {
        // Find if progress exists
        const existingProg = progressData.find(p => p.studentId === student.id);
        const scoresMap = {};
        
        if (existingProg) {
          existingProg.assessments.forEach(a => {
            scoresMap[a.criteriaId] = a.score;
          });
        }
        
        newFormData[student.id] = {
          note: existingProg?.note || "",
          scores: scoresMap
        };
      });
      
      setFormData(newFormData);
      setIsLoading(false);
      setMessage({ type: "", text: "" });
    });
  }, [selectedClass, selectedWeek, selectedMonth, selectedYear]);

  const handleScoreChange = (studentId, criteriaId, value) => {
    setFormData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        scores: {
          ...prev[studentId].scores,
          [criteriaId]: value
        }
      }
    }));
  };

  const handleNoteChange = (studentId, value) => {
    setFormData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Transform formData to API payload format
    const studentsPayload = Object.keys(formData).map(studentId => {
      const studentData = formData[studentId];
      const scoresArray = Object.keys(studentData.scores).map(cId => ({
        criteriaId: parseInt(cId),
        score: parseFloat(studentData.scores[cId])
      })).filter(s => !isNaN(s.score));

      return {
        studentId: parseInt(studentId),
        note: studentData.note,
        scores: scoresArray
      };
    });

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week: selectedWeek,
          month: selectedMonth,
          year: selectedYear,
          studentsData: studentsPayload
        })
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
        <p className="text-sm text-slate-500 mt-1">Masukkan nilai per kriteria dan catatan perkembangan anak</p>
      </div>

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
                    <th key={c.id} className="px-4 py-4 font-semibold text-center min-w-[120px]" title={c.name}>
                      {c.code}
                    </th>
                  ))}
                  <th className="px-6 py-4 font-semibold min-w-[250px]">Catatan Perkembangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 sticky left-0 bg-white shadow-[1px_0_0_#e2e8f0] z-10 whitespace-nowrap">
                      {student.name}
                    </td>
                    {criteria.map(c => (
                      <td key={c.id} className="px-2 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={formData[student.id]?.scores?.[c.id] || ""}
                          onChange={(e) => handleScoreChange(student.id, c.id, e.target.value)}
                          className="w-full max-w-[80px] px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-center bg-slate-50 hover:bg-white transition-colors"
                        />
                      </td>
                    ))}
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
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || students.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-indigo-200"
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
