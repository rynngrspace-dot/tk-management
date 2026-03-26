export const users = [
  { id: 1, name: "Admin Utama", email: "admin@tk.com", password: "123", role: "admin" },
  { id: 2, name: "Guru Siti", email: "guru@tk.com", password: "123", role: "teacher" }
];

export const classes = [
  { id: "A", name: "Kelompok A (Usia 4-5 Tahun)" },
  { id: "B", name: "Kelompok B (Usia 5-6 Tahun)" }
];

export const teachers = [
  { id: 1, name: "Guru Siti", email: "guru@tk.com", classId: "A" },
  { id: 2, name: "Guru Budi", email: "budi@tk.com", classId: "B" }
];

export const students = [
  { id: 1, name: "Ahmad Rizky", classId: "A", nis: "1001" },
  { id: 2, name: "Bunga Pertiwi", classId: "A", nis: "1002" },
  { id: 3, name: "Cahyo Wijaya", classId: "B", nis: "1003" },
  { id: 4, name: "Dina Amelia", classId: "B", nis: "1004" }
];

export const criteria = [
  { id: "C1", name: "Agama & Moral", weight: 0.3, type: "benefit" },
  { id: "C2", name: "Motorik", weight: 0.2, type: "benefit" },
  { id: "C3", name: "Kognitif", weight: 0.2, type: "benefit" },
  { id: "C4", name: "Bahasa", weight: 0.15, type: "benefit" },
  { id: "C5", name: "Sosial Emosional", weight: 0.15, type: "benefit" }
];

// Assessment scores out of 100 — weekly records
export let assessments = [
  // ======= FEBRUARI =======
  // Week 6 (2-6 Feb)
  { week: "2026-W06", studentId: 1, scores: { C1: 50, C2: 55, C3: 45, C4: 50, C5: 60 } },
  { week: "2026-W06", studentId: 2, scores: { C1: 60, C2: 50, C3: 55, C4: 45, C5: 55 } },
  { week: "2026-W06", studentId: 3, scores: { C1: 40, C2: 45, C3: 50, C4: 55, C5: 50 } },
  { week: "2026-W06", studentId: 4, scores: { C1: 55, C2: 60, C3: 65, C4: 50, C5: 55 } },
  // Week 7 (9-13 Feb)
  { week: "2026-W07", studentId: 1, scores: { C1: 55, C2: 60, C3: 50, C4: 55, C5: 65 } },
  { week: "2026-W07", studentId: 2, scores: { C1: 65, C2: 55, C3: 60, C4: 50, C5: 60 } },
  { week: "2026-W07", studentId: 3, scores: { C1: 45, C2: 50, C3: 55, C4: 60, C5: 55 } },
  { week: "2026-W07", studentId: 4, scores: { C1: 60, C2: 65, C3: 70, C4: 55, C5: 60 } },
  // Week 8 (16-20 Feb)
  { week: "2026-W08", studentId: 1, scores: { C1: 58, C2: 63, C3: 53, C4: 58, C5: 68 } },
  { week: "2026-W08", studentId: 2, scores: { C1: 68, C2: 58, C3: 63, C4: 53, C5: 63 } },
  { week: "2026-W08", studentId: 3, scores: { C1: 48, C2: 53, C3: 58, C4: 63, C5: 58 } },
  { week: "2026-W08", studentId: 4, scores: { C1: 63, C2: 68, C3: 73, C4: 58, C5: 63 } },
  // Week 9 (23-27 Feb)
  { week: "2026-W09", studentId: 1, scores: { C1: 62, C2: 67, C3: 57, C4: 62, C5: 72 } },
  { week: "2026-W09", studentId: 2, scores: { C1: 72, C2: 62, C3: 67, C4: 57, C5: 67 } },
  { week: "2026-W09", studentId: 3, scores: { C1: 52, C2: 57, C3: 62, C4: 67, C5: 62 } },
  { week: "2026-W09", studentId: 4, scores: { C1: 67, C2: 72, C3: 77, C4: 62, C5: 67 } },
  // ======= MARET =======
  // Week 10 (2-6 Mar)
  { week: "2026-W10", studentId: 1, scores: { C1: 65, C2: 70, C3: 60, C4: 65, C5: 75 } },
  { week: "2026-W10", studentId: 2, scores: { C1: 75, C2: 65, C3: 70, C4: 60, C5: 70 } },
  { week: "2026-W10", studentId: 3, scores: { C1: 55, C2: 60, C3: 65, C4: 70, C5: 65 } },
  { week: "2026-W10", studentId: 4, scores: { C1: 70, C2: 75, C3: 80, C4: 65, C5: 70 } },
  // Week 11 (9-13 Mar)
  { week: "2026-W11", studentId: 1, scores: { C1: 70, C2: 75, C3: 65, C4: 72, C5: 80 } },
  { week: "2026-W11", studentId: 2, scores: { C1: 80, C2: 72, C3: 78, C4: 68, C5: 78 } },
  { week: "2026-W11", studentId: 3, scores: { C1: 60, C2: 65, C3: 70, C4: 75, C5: 72 } },
  { week: "2026-W11", studentId: 4, scores: { C1: 75, C2: 80, C3: 85, C4: 72, C5: 78 } },
  // Week 12 (16-20 Mar)
  { week: "2026-W12", studentId: 1, scores: { C1: 75, C2: 80, C3: 70, C4: 78, C5: 85 } },
  { week: "2026-W12", studentId: 2, scores: { C1: 85, C2: 78, C3: 82, C4: 72, C5: 82 } },
  { week: "2026-W12", studentId: 3, scores: { C1: 65, C2: 70, C3: 75, C4: 80, C5: 78 } },
  { week: "2026-W12", studentId: 4, scores: { C1: 80, C2: 85, C3: 90, C4: 78, C5: 82 } },
  // Week 13 (23-27 Mar) — current
  { week: "2026-W13", studentId: 1, scores: { C1: 80, C2: 85, C3: 75, C4: 80, C5: 90 } },
  { week: "2026-W13", studentId: 2, scores: { C1: 90, C2: 80, C3: 85, C4: 75, C5: 85 } },
  { week: "2026-W13", studentId: 3, scores: { C1: 70, C2: 75, C3: 80, C4: 85, C5: 80 } },
  { week: "2026-W13", studentId: 4, scores: { C1: 85, C2: 90, C3: 95, C4: 80, C5: 85 } },
];

const BULAN_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const BULAN_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function getWeekMonday(year, weekNum) {
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + (weekNum - 1) * 7);
  return monday;
}

// Helper to get available weeks with month labels
export const getAvailableWeeks = () => {
  const weeks = [...new Set(assessments.map(a => a.week))].sort();
  // First pass: build raw week data
  const rawWeeks = weeks.map(w => {
    const [year, weekPart] = w.split("-W");
    const weekNum = parseInt(weekPart);
    const monday = getWeekMonday(parseInt(year), weekNum);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const startDay = monday.getDate();
    const endDay = friday.getDate();
    const startMonth = BULAN_SHORT[monday.getMonth()];
    const endMonth = BULAN_SHORT[friday.getMonth()];
    const monthKey = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = BULAN_FULL[monday.getMonth()] + " " + monday.getFullYear();
    const dateRange = startMonth === endMonth 
      ? `${startDay}-${endDay} ${startMonth}`
      : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    return { value: w, monthKey, monthLabel, dateRange };
  });
  // Second pass: number weeks 1, 2, 3, 4 within each month
  const monthCounters = {};
  return rawWeeks.map(w => {
    if (!monthCounters[w.monthKey]) monthCounters[w.monthKey] = 0;
    monthCounters[w.monthKey]++;
    const num = monthCounters[w.monthKey];
    return {
      value: w.value,
      label: `Minggu ${num} (${w.dateRange})`,
      shortLabel: `Minggu ${num}`,
      monthKey: w.monthKey,
      monthLabel: w.monthLabel,
    };
  });
};

// Get available months from assessment data
export const getAvailableMonths = () => {
  const weeks = getAvailableWeeks();
  const monthMap = {};
  weeks.forEach(w => {
    if (!monthMap[w.monthKey]) {
      monthMap[w.monthKey] = { value: w.monthKey, label: w.monthLabel, weeks: [] };
    }
    monthMap[w.monthKey].weeks.push(w);
  });
  return Object.values(monthMap).sort((a, b) => a.value.localeCompare(b.value));
};

// Get current week string
export const getCurrentWeek = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 604800000;
  const weekNum = Math.ceil(((diff / oneWeek) + start.getDay() + 1) / 1);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
};

// Attendance records
export let attendanceRecords = [
  {
    date: "2026-03-24",
    teacherId: 1,
    records: [
      { studentId: 1, status: "hadir" },
      { studentId: 2, status: "sakit" },
    ]
  },
  {
    date: "2026-03-25",
    teacherId: 1,
    records: [
      { studentId: 1, status: "hadir" },
      { studentId: 2, status: "hadir" },
    ]
  },
  {
    date: "2026-03-24",
    teacherId: 2,
    records: [
      { studentId: 3, status: "hadir" },
      { studentId: 4, status: "izin" },
    ]
  },
];

export const getMockData = () => ({
  users, classes, teachers, students, criteria, assessments, attendanceRecords
});
