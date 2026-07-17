// Logika Perhitungan Simple Additive Weighting (SAW)
// Catatan: Semua kriteria bertipe BENEFIT (karena semakin tinggi skor perkembangan anak, semakin baik).
export const calculateSAW = (students, criteria, assessments, week = null) => {
  // Filter penilaian berdasarkan minggu yang dipilih
  let filteredAssessments = assessments;
  if (week) {
    filteredAssessments = assessments.filter(a => a.week === week);
  } else {
    // Jika tidak ditentukan, otomatis gunakan data minggu terakhir
    const weeks = [...new Set(assessments.map(a => a.week).filter(Boolean))].sort();
    if (weeks.length > 0) {
      filteredAssessments = assessments.filter(a => a.week === weeks[weeks.length - 1]);
    }
  }

  // Jika data tidak lengkap, kembalikan array kosong
  if (!students.length || !criteria.length || !filteredAssessments.length) return [];

  // TAHAP 1: Menentukan nilai maksimum (Max) untuk setiap kriteria (Benefit)
  // Formula Benefit: Kriteria di mana semakin besar nilainya semakin baik.
  const maxValues = {};
  criteria.forEach((c) => {
    maxValues[c.id] = Math.max(...filteredAssessments.map((a) => a.scores[c.id] || 0));
  });

  // TAHAP 2: Normalisasi Matriks Keputusan (R)
  // Untuk kriteria BENEFIT, rumusnya adalah: R_ij = X_ij / Max(X_ij)
  const normalized = filteredAssessments.map((a) => {
    const normScores = {};
    criteria.forEach((c) => {
      const val = a.scores[c.id] || 0;
      // Normalisasi Benefit: Nilai data dibagi nilai maksimum kriteria tersebut
      normScores[c.id] = maxValues[c.id] > 0 ? val / maxValues[c.id] : 0;
    });
    return { studentId: a.studentId, normScores };
  });

  // TAHAP 3: Proses Perankingan (V)
  // Mengalikan matriks ternormalisasi (R) dengan bobot kriteria (W), kemudian menjumlahkannya.
  // Rumus: V_i = Sum(R_ij * W_j)
  const results = normalized.map((n) => {
    let finalScore = 0;
    criteria.forEach((c) => {
      finalScore += n.normScores[c.id] * c.weight;
    });
    
    // Cari detail profil siswa
    const student = students.find((s) => s.id === n.studentId);
    return {
      studentId: n.studentId,
      name: student ? student.name : "Tidak Dikenal",
      nis: student ? student.nis : "-",
      classId: student ? student.classId : "-",
      score: Number((finalScore * 100).toFixed(2)), // Skala diubah ke 100 untuk kemudahan pembacaan
    };
  });

  // TAHAP 4: Mengurutkan Hasil Penilaian dari Skor Tertinggi ke Terendah (Ranking)
  results.sort((a, b) => b.score - a.score);

  // Menambahkan atribut ranking berdasarkan urutan array yang telah disortir
  results.forEach((r, idx) => (r.rank = idx + 1));

  return results;
};
