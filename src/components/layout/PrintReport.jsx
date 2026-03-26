"use client"

export function PrintReport({ title, subtitle, date, children, show }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] bg-white print:static print:z-auto overflow-auto">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body > *:not(.print-container) { display: none !important; }
          .print-container { display: block !important; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      <div className="print-container max-w-4xl mx-auto p-8 print:p-0">
        {/* Close button (hidden in print) */}
        <div className="print:hidden mb-6 flex justify-between items-center">
          <p className="text-sm text-slate-500">Tekan <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">Ctrl+P</kbd> untuk cetak / simpan PDF</p>
        </div>

        {/* Letterhead */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">TK Pintar</h1>
          <p className="text-sm text-slate-600 mt-1">Jl. Pendidikan No. 123, Kota Belajar</p>
          <p className="text-xs text-slate-500">Telp: (021) 123-4567 | Email: tk@pintar.sch.id</p>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 uppercase">{title}</h2>
          {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
          <p className="text-xs text-slate-500 mt-2">Tanggal Cetak: {date || new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        {/* Content */}
        <div className="mb-8">
          {children}
        </div>

        {/* Signature */}
        <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
          <div>
            <p className="text-slate-600">Mengetahui,</p>
            <p className="font-semibold text-slate-800">Kepala TK Pintar</p>
            <div className="mt-16 border-b border-slate-400 w-48 mx-auto" />
            <p className="mt-1 text-xs text-slate-500">NIP: _______________</p>
          </div>
          <div>
            <p className="text-slate-600">Kota Belajar, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p className="font-semibold text-slate-800">Guru Kelas</p>
            <div className="mt-16 border-b border-slate-400 w-48 mx-auto" />
            <p className="mt-1 text-xs text-slate-500">NIP: _______________</p>
          </div>
        </div>
      </div>
    </div>
  )
}
