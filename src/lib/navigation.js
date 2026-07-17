import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calculator,
  ListChecks,
  FileText,
  ClipboardCheck,
  CalendarDays,
  BarChart3,
  Clock,
} from "lucide-react";

export const adminNav = [
  { type: "link", name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  {
    type: "group",
    label: "Data Master",
    icon: BookOpen,
    children: [
      { name: "Siswa", href: "/dashboard/admin/students", icon: Users },
      { name: "Orang Tua", href: "/dashboard/admin/parents", icon: Users },
      { name: "Guru", href: "/dashboard/admin/teachers", icon: GraduationCap },
      { name: "Kelas", href: "/dashboard/admin/classes", icon: BookOpen },
    ],
  },
  {
    type: "group",
    label: "Penilaian SAW",
    icon: Calculator,
    children: [
      { name: "Kriteria", href: "/dashboard/admin/criteria", icon: ListChecks },
      { name: "Hasil SAW", href: "/dashboard/admin/saw-results", icon: FileText },
    ],
  },
  { type: "link", name: "Log Aktivitas", href: "/dashboard/admin/activities", icon: Clock },
];

export const teacherNav = [
  { type: "link", name: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
  {
    type: "group",
    label: "Siswa",
    icon: Users,
    children: [
      { name: "Siswa Saya", href: "/dashboard/teacher/my-students", icon: Users },
      { name: "Absensi", href: "/dashboard/teacher/attendance", icon: ClipboardCheck },
    ],
  },
  {
    type: "group",
    label: "Penilaian",
    icon: ListChecks,
    children: [
      { name: "Kalender", href: "/dashboard/teacher/calendar", icon: CalendarDays },
      { name: "Progres Mingguan", href: "/dashboard/teacher/progress", icon: BarChart3 },
      { name: "Input Nilai", href: "/dashboard/teacher/assessment", icon: ListChecks },
      { name: "Hasil SAW", href: "/dashboard/teacher/saw-results", icon: FileText },
    ],
  },
];

export const parentNav = [
  { type: "link", name: "Dashboard", href: "/dashboard/parent", icon: LayoutDashboard },
  { type: "link", name: "Perkembangan Anak", href: "/dashboard/parent/child-progress", icon: BarChart3 },
];
