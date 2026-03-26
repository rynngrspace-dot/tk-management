"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function TeacherMyStudentsPage() {
  const [allStudents, setAllStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [myClassId, setMyClassId] = useState("A") // Hardcoded for Demo (Siti = A)
  const [className, setClassName] = useState("Kelompok A")
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("mine")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [resStudents, resClasses] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/classes")
        ])
        
        if (!resStudents.ok || !resClasses.ok) throw new Error("Gagal mengambil data")
        
        const dataStudents = await resStudents.json()
        const dataClasses = await resClasses.json()
        
        setAllStudents(dataStudents)
        setClasses(dataClasses)
        
        // Determine teacher's class based on name for now
        const userName = localStorage.getItem("userName") || ""
        let assignedClassId = "A"
        if (userName.toLowerCase().includes("budi")) {
          assignedClassId = "B"
        }
        
        setMyClassId(assignedClassId)
        const assignedClass = dataClasses.find(c => c.id === assignedClassId)
        if (assignedClass) {
          setClassName(assignedClass.name)
        }
        
      } catch (error) {
        toast.error(error.message)
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const myStudents = allStudents.filter(s => s.classId === myClassId)

  const displayStudents = selectedTab === "mine"
    ? myStudents
    : selectedTab === "all"
      ? allStudents
      : allStudents.filter(s => s.classId === selectedTab)

  const filteredStudents = displayStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.includes(searchTerm)
  )

  const getTabCount = (tab) => {
    if (tab === "mine") return myStudents.length
    if (tab === "all") return allStudents.length
    return allStudents.filter(s => s.classId === tab).length
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center shadow-md shadow-blue-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Siswa Saya</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar siswa di <strong className="text-slate-700">{className}</strong></p>
          </div>
        </div>
      </div>

      {/* Tab Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-2 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setSelectedTab("mine")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            selectedTab === "mine"
              ? "gradient-primary text-white shadow-md shadow-indigo-500/20"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          }`}
        >
          <Users className="w-4 h-4" />
          Kelompok Saya
          <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-md font-bold ${
            selectedTab === "mine" ? "bg-white/20" : "bg-slate-100 text-slate-500"
          }`}>{getTabCount("mine")}</span>
        </button>
        <button
          onClick={() => setSelectedTab("all")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            selectedTab === "all"
              ? "gradient-primary text-white shadow-md shadow-indigo-500/20"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          }`}
        >
          Semua Siswa
          <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-md font-bold ${
            selectedTab === "all" ? "bg-white/20" : "bg-slate-100 text-slate-500"
          }`}>{getTabCount("all")}</span>
        </button>
        {classes.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelectedTab(cls.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              selectedTab === cls.id
                ? "gradient-primary text-white shadow-md shadow-indigo-500/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {cls.name}
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-md font-bold ${
              selectedTab === cls.id ? "bg-white/20" : "bg-slate-100 text-slate-500"
            }`}>{getTabCount(cls.id)}</span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama atau NIS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-xl bg-slate-50/80"
          />
        </div>
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">NIS</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Siswa</TableHead>
                {(selectedTab === "all" || (selectedTab !== "mine" && selectedTab !== myClassId)) && (
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Kelompok</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <span>Siswa tidak ditemukan</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const classNameText = classes.find(c => c.id === student.classId)?.name || student.classId
                  return (
                    <TableRow key={student.id} className="table-row-hover transition-colors">
                      <TableCell className="font-mono text-sm text-indigo-600 font-medium">{student.nis}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-700">{student.name}</span>
                        </div>
                      </TableCell>
                      {(selectedTab === "all" || (selectedTab !== "mine" && selectedTab !== myClassId)) && (
                        <TableCell>
                          <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                            {classNameText}
                          </span>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
          <span>Menampilkan {filteredStudents.length} dari {displayStudents.length} siswa</span>
        </div>
      </div>
    </div>
  )
}
