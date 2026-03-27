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
  { type: "link", name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    type: "group",
    label: "Data Master",
    icon: BookOpen,
    children: [
      { name: "Siswa", href: "/admin/students", icon: Users },
      { name: "Guru", href: "/admin/teachers", icon: GraduationCap },
      { name: "Kelas", href: "/admin/classes", icon: BookOpen },
    ],
  },
  {
    type: "group",
    label: "Penilaian SAW",
    icon: Calculator,
    children: [
      { name: "Kriteria", href: "/admin/criteria", icon: ListChecks },
      { name: "Hasil SAW", href: "/admin/saw-results", icon: FileText },
    ],
  },
  { type: "link", name: "Log Aktivitas", href: "/admin/activities", icon: Clock },
];

export const teacherNav = [
  { type: "link", name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  {
    type: "group",
    label: "Siswa",
    icon: Users,
    children: [
      { name: "Siswa Saya", href: "/teacher/my-students", icon: Users },
      { name: "Absensi", href: "/teacher/attendance", icon: ClipboardCheck },
    ],
  },
  {
    type: "group",
    label: "Penilaian",
    icon: ListChecks,
    children: [
      { name: "Kalender", href: "/teacher/calendar", icon: CalendarDays },
      { name: "Input Nilai", href: "/teacher/assessment", icon: ListChecks },
      { name: "Progres Mingguan", href: "/teacher/progress", icon: BarChart3 },
      { name: "Hasil SAW", href: "/teacher/saw-results", icon: FileText },
    ],
  },
];
