"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, AlertTriangle, ListChecks } from "lucide-react"
import { getMockData } from "@/lib/mock-data"
import { toast } from "sonner"

export default function AdminCriteriaPage() {
  const [criteria, setCriteria] = useState([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  
  const [formData, setFormData] = useState({ id: "", name: "", weight: "", type: "benefit" })

  useEffect(() => {
    const data = getMockData()
    setCriteria(data.criteria)
  }, [])

  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight), 0)
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.001

  const handleSave = () => {
    if (!formData.id || !formData.name || !formData.weight) {
      toast.error("Semua field harus diisi!")
      return
    }
    const newCriteria = { ...formData, weight: Number(formData.weight) }
    setCriteria([...criteria, newCriteria])
    setIsAddOpen(false)
    setFormData({ id: "", name: "", weight: "", type: "benefit" })
    toast.success("Kriteria berhasil ditambahkan")
  }

  const handleDelete = (id) => {
    setCriteria(criteria.filter(c => c.id !== id))
    toast.success("Kriteria berhasil dihapus")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center shadow-md shadow-orange-500/20">
            <ListChecks className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Manajemen Kriteria SAW</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kelola aspek perkembangan yang akan dinilai</p>
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0 gradient-primary text-white rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:opacity-95 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" /> Tambah Kriteria
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Tambah Kriteria Penilaian</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Kode Kriteria (Misal: C1, C2)</Label>
                <Input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="C6" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Aspek Perkembangan</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Misal: Seni" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Bobot (Total semua harus 1.0)</Label>
                <Input type="number" step="0.05" min="0" max="1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="0.2" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Sifat Kriteria</Label>
                <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="benefit">Benefit (Makin tinggi makin baik)</SelectItem>
                    <SelectItem value="cost">Cost (Makin rendah makin baik)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">Batal</Button>
              <Button className="gradient-primary text-white rounded-xl" onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weight Warning */}
      {!isWeightValid && (
        <div className="bg-rose-50/80 backdrop-blur-sm border border-rose-200/60 text-rose-700 px-5 py-4 rounded-2xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <p className="font-bold text-sm">Total Bobot Tidak Sama Dengan 1.0</p>
            <p className="text-xs mt-0.5 text-rose-600">Total bobot saat ini adalah <strong>{totalWeight.toFixed(2)}</strong>. Perhitungan SAW memerlukan total bobot tepat 1.0 (100%).</p>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5 space-y-4">
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Kode</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Aspek Perkembangan</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Sifat</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Bobot</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-slate-500">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-12">
                    <div className="flex flex-col items-center gap-2">
                      <ListChecks className="w-8 h-8 text-slate-300" />
                      <span>Kriteria tidak ditemukan</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                criteria.map((crt) => (
                  <TableRow key={crt.id} className="table-row-hover transition-colors">
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                        {crt.id}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{crt.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        crt.type === 'benefit' 
                          ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/10' 
                          : 'bg-rose-50 text-rose-600 ring-rose-500/10'
                      }`}>
                        {crt.type === 'benefit' ? '↑ Benefit' : '↓ Cost'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                          <div 
                            className="h-full rounded-full gradient-primary transition-all duration-500"
                            style={{ width: `${Number(crt.weight) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-10 text-right">
                          {(Number(crt.weight) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => toast.info("Fitur Edit dipanggil")}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(crt.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Total Weight Footer */}
        {criteria.length > 0 && (
          <div className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium ${
            isWeightValid 
              ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-100' 
              : 'bg-amber-50/80 text-amber-700 border border-amber-100'
          }`}>
            <span>Total Bobot</span>
            <span className="font-bold">{(totalWeight * 100).toFixed(0)}% / 100%</span>
          </div>
        )}
      </div>
    </div>
  )
}
