"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";

export default function CriteriaPage() {
  const [criteria, setCriteria] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    weight: "",
    type: "benefit",
  });

  const fetchCriteria = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/criteria");
      const data = await res.json();
      setCriteria(data);
    } catch (err) {
      console.error("Failed to fetch criteria", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        code: item.code,
        name: item.name,
        weight: item.weight,
        type: "benefit",
      });
    } else {
      setEditingId(null);
      setFormData({ code: "", name: "", weight: "", type: "benefit" });
    }
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const parsedWeight = parseFloat(formData.weight || 0);
    if (isNaN(parsedWeight) || parsedWeight < 0 || parsedWeight > 1) {
      setError("Bobot harus berupa angka desimal antara 0 dan 1");
      return;
    }

    const otherCriteriaWeight = criteria
      .filter(item => item.id !== editingId)
      .reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);
      
    if (otherCriteriaWeight + parsedWeight > 1.0001) {
      setError(`Total bobot tidak boleh melebihi 1.00. Sisa bobot yang tersedia: ${(1.00 - otherCriteriaWeight).toFixed(2)}`);
      return;
    }

    try {
      const url = editingId ? `/api/criteria/${editingId}` : "/api/criteria";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan kriteria");
      }

      setIsModalOpen(false);
      fetchCriteria();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kriteria ini?")) return;
    try {
      const res = await fetch(`/api/criteria/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus kriteria");
      fetchCriteria();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalWeight = criteria.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.0001;

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Kriteria SAW</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola kriteria dan bobot untuk penilaian akhir</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={totalWeight >= 0.9999}
          className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
            totalWeight >= 0.9999
              ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          }`}
          title={totalWeight >= 0.9999 ? "Total bobot sudah 1.00, tidak bisa menambah kriteria baru" : "Tambah Kriteria"}
        >
          <Plus className="w-4 h-4" />
          Tambah Kriteria
        </button>
      </div>

      {/* Info Total Bobot Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
        isWeightValid 
          ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800' 
          : 'bg-amber-50/60 border-amber-200/80 text-amber-800'
      }`}>
        <div className="flex items-start gap-3">
          <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isWeightValid ? 'text-emerald-600' : 'text-amber-600'}`} />
          <div>
            <h3 className="font-semibold text-sm">Informasi Total Bobot</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {totalWeight >= 0.9999 
                ? "Total bobot kriteria telah mencapai 1.00 (100%). Kurangi bobot kriteria yang ada jika ingin menambah kriteria baru."
                : "Semua kriteria dalam perhitungan SAW harus memiliki total bobot tepat 1.00 (100%)."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-xs font-medium text-slate-500">Total Bobot saat ini:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isWeightValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {totalWeight.toFixed(2)} / 1.00 {isWeightValid ? '✓' : '⚠️'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Kode</th>
                <th className="px-6 py-4 font-semibold">Nama Kriteria</th>
                <th className="px-6 py-4 font-semibold">Bobot</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criteria.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.code}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.weight}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {criteria.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    Belum ada kriteria yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-2xl shadow-xl w-full max-w-xl min-h-screen sm:min-h-0 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Kriteria" : "Tambah Kriteria"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-grow overflow-y-auto sm:overflow-visible flex flex-col justify-between sm:justify-start">
              <div className="space-y-5">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-600">{error}</p>
                  </div>
                )}

                <div className="p-4 bg-indigo-50 border border-indigo-100/80 rounded-xl flex items-start gap-3 text-indigo-950">
                  <AlertCircle className="w-5 h-5 shrink-0 text-indigo-600 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-semibold block mb-0.5">Informasi Pembobotan Kriteria</span>
                    <span>
                      Total bobot dari seluruh kriteria harus bernilai tepat **1.00 (100%)**. 
                      Saat ini, total jumlah bobot adalah **{totalWeight.toFixed(2)}**. Pastikan kriteria yang dibuat memiliki nilai bobot yang proporsional.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-sm font-medium text-slate-700">Kode Kriteria</label>
                    <input
                      type="text"
                      required
                      placeholder="C1"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Nama Kriteria</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nilai Agama & Moral"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Bobot Kriteria (0 sampai 1)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="e.g. 0.20"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium text-slate-800"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs font-semibold text-slate-400">
                      {formData.weight ? `${(parseFloat(formData.weight) * 100).toFixed(0)}%` : '0%'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Masukkan nilai desimal antara 0 dan 1 (contoh: 0.15 untuk 15%).
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all cursor-pointer"
                >
                  {editingId ? "Simpan Perubahan" : "Simpan Kriteria"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
