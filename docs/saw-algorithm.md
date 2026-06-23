# Cara Kerja Algoritma SAW

## Apa itu SAW?

**Simple Additive Weighting (SAW)** adalah metode pengambilan keputusan multi-kriteria (MCDM) yang paling banyak digunakan karena sederhana, transparan, dan akurat. Metode ini bekerja dengan cara:

1. Mengumpulkan nilai setiap alternatif (siswa) pada setiap kriteria
2. Menormalisasikan nilai agar dapat dibandingkan secara adil
3. Mengalikan nilai ternormalisasi dengan bobot kriteria
4. Menjumlahkan hasil untuk menghasilkan skor akhir (V)

---

## Alur Kerja dalam Sistem Ini

```
Guru Input Nilai Mingguan (BB/MB/BSH/BSB)
          │
          ▼
  Tersimpan sebagai WeeklyProgress + Assessment di database
          │
          ▼
Admin/Guru tekan "Kalkulasi Nilai SAW Baru"
          │
          ▼
┌─────────────────────────────────────────┐
│         PROSES KALKULASI SAW            │
│                                         │
│  Langkah 1: Agregasi Nilai              │
│  Langkah 2: Normalisasi Matriks         │
│  Langkah 3: Pembobotan & Skor Akhir     │
│  Langkah 4: Penentuan Predikat          │
└─────────────────────────────────────────┘
          │
          ▼
  Hasil tersimpan ke tabel SawResult
          │
          ▼
  Tampil di dashboard Guru & Orang Tua
```

---

## Langkah-Langkah Kalkulasi Detail

### Langkah 1 — Agregasi Nilai (Rata-rata Mingguan)

Setiap bulan, guru mengisi nilai per kriteria di minggu 1 hingga 5. Sistem mengambil **rata-rata** semua minggu yang sudah diisi sebagai skor dasar siswa.

**Rumus:**

```
x_ij = Σ(nilai_minggu_ke-n_kriteria_j) / jumlah_minggu_terisi
```

**Contoh:**

Siswa Bunga, Kriteria C1 (Nilai Agama & Moral):
- Minggu 1: BSH (3)
- Minggu 2: BSB (4)
- Minggu 3: BSH (3)
- Minggu 4: BSB (4)
- Minggu 5: _(tidak diisi)_

```
x_Bunga_C1 = (3 + 4 + 3 + 4) / 4 = 3.5
```

---

### Langkah 2 — Normalisasi Matriks

Normalisasi mengubah semua nilai ke rentang **0.0 – 1.0** agar kriteria dengan skala berbeda dapat dibandingkan secara adil.

Sistem mendukung dua jenis kriteria:

#### Kriteria Benefit (semakin tinggi = semakin baik)
Contoh: Motorik Kasar, Kemampuan Bahasa, dll.

```
r_ij = x_ij / max(x_j)
```

#### Kriteria Cost (semakin rendah = semakin baik)
Contoh: Frekuensi Perilaku Negatif (jarang muncul lebih baik)

```
r_ij = min(x_j) / x_ij
```

**Contoh Normalisasi (Benefit):**

| Siswa | x (skor rata-rata C1 — Nilai Agama & Moral) | Normalisasi (÷ max) |
|-------|--------------------------------------------|---------------------|
| Bunga | 3.5 | 3.5 / 4.0 = **0.875** |
| Rizky | 4.0 | 4.0 / 4.0 = **1.000** |
| Dinda | 2.5 | 2.5 / 4.0 = **0.625** |

> **Catatan:** Max yang digunakan adalah **max dari nilai siswa di kelas tersebut**, bukan max absolut skala (4). Jika semua siswa maksimal di angka 3.5, maka normalisasi pakai 3.5 sebagai max.

---

### Langkah 3 — Pembobotan & Skor Akhir (V)

Setiap nilai ternormalisasi dikalikan dengan **bobot kriteria** (ditentukan Admin, total bobot sebaiknya = 1.0 atau 100%).

```
V_i = Σ(w_j × r_ij)
```

Di mana:
- `V_i` = Skor akhir siswa ke-i
- `w_j` = Bobot kriteria ke-j (contoh: 0.25 = 25%)
- `r_ij` = Nilai ternormalisasi siswa ke-i pada kriteria ke-j

**Contoh (menggunakan 4 dari 6 kriteria nyata):**

| Kriteria | Bobot (w) | r_Bunga | Kontribusi |
|----------|-----------|---------|------------|
| C1 (Nilai Agama & Moral) | 0.20 | 0.875 | 0.20 × 0.875 = **0.175** |
| C2 (Fisik-Motorik) | 0.15 | 0.750 | 0.15 × 0.750 = **0.113** |
| C3 (Kognitif) | 0.20 | 1.000 | 0.20 × 1.000 = **0.200** |
| C4 (Bahasa) | 0.15 | 0.500 | 0.15 × 0.500 = **0.075** |
| C5 (Sosial-Emosional) | 0.10 | 0.750 | 0.10 × 0.750 = **0.075** |
| C6 (Seni) | 0.20 | 0.875 | 0.20 × 0.875 = **0.175** |

```
V_Bunga = 0.175 + 0.113 + 0.200 + 0.075 + 0.075 + 0.175 = 0.813
```

---

### Langkah 4 — Penentuan Predikat

Skor akhir (V) dipetakan ke predikat perkembangan:

| Rentang Skor V | Predikat | Kode |
|----------------|----------|------|
| 0.85 ≤ V ≤ 1.0 | Berkembang Sangat Baik | BSB |
| 0.70 ≤ V < 0.85 | Berkembang Sesuai Harapan | BSH |
| 0.50 ≤ V < 0.70 | Mulai Berkembang | MB |
| V < 0.50 | Perlu Bimbingan | BB |

Contoh: Bunga dengan V = 0.807 → **Berkembang Sesuai Harapan (BSH)**

---

## Contoh Lengkap Matriks SAW

Menggunakan **6 kriteria nyata** sistem ini, dengan 3 siswa dan bobot sesuai konfigurasi:

**Bobot:** C1=0.20, C2=0.15, C3=0.20, C4=0.15, C5=0.10, C6=0.20

### Matriks Nilai Rata-rata (x)

| Siswa | C1 (Agama) | C2 (Fisik) | C3 (Kognitif) | C4 (Bahasa) | C5 (Sosial) | C6 (Seni) |
|-------|-----------|-----------|--------------|------------|------------|----------|
| Bunga | 3.5 | 3.0 | 4.0 | 3.5 | 3.0 | 4.0 |
| Rizky | 4.0 | 2.5 | 3.5 | 4.0 | 4.0 | 3.0 |
| Dinda | 3.0 | 4.0 | 3.0 | 3.0 | 3.5 | 3.5 |
| **Max** | **4.0** | **4.0** | **4.0** | **4.0** | **4.0** | **4.0** |

### Matriks Ternormalisasi (r = x / max)

| Siswa | C1 | C2 | C3 | C4 | C5 | C6 |
|-------|----|----|----|----|----|----|----|
| Bunga | 0.875 | 0.750 | 1.000 | 0.875 | 0.750 | 1.000 |
| Rizky | 1.000 | 0.625 | 0.875 | 1.000 | 1.000 | 0.750 |
| Dinda | 0.750 | 1.000 | 0.750 | 0.750 | 0.875 | 0.875 |

### Skor Akhir (V = Σ w × r)

| Siswa | Perhitungan V | Skor V | Predikat |
|-------|--------------|--------|----------|
| Bunga | (0.20×0.875)+(0.15×0.750)+(0.20×1.000)+(0.15×0.875)+(0.10×0.750)+(0.20×1.000) | **0.895** | BSB |
| Rizky | (0.20×1.000)+(0.15×0.625)+(0.20×0.875)+(0.15×1.000)+(0.10×1.000)+(0.20×0.750) | **0.869** | BSB |
| Dinda | (0.20×0.750)+(0.15×1.000)+(0.20×0.750)+(0.15×0.750)+(0.10×0.875)+(0.20×0.875) | **0.820** | BSH |

### Ranking Akhir

| Rank | Siswa | Skor V | Predikat |
|------|-------|--------|----------|
| 🥇 1 | Bunga | 0.895 | Berkembang Sangat Baik |
| 🥈 2 | Rizky | 0.869 | Berkembang Sangat Baik |
| 🥉 3 | Dinda | 0.820 | Berkembang Sesuai Harapan |

---

## Implementasi Teknis

Kalkulasi SAW dilakukan di endpoint:
```
POST /api/saw/calculate
```

**Payload yang dikirim:**
```json
{
  "classId": "A",
  "month": "Juni",
  "year": 2026,
  "period": "Juni 2026"
}
```

**Logika kode (ringkasan):**

```javascript
// 1. Ambil semua WeeklyProgress untuk kelas & bulan
const progressRecords = await prisma.weeklyProgress.findMany({ ... })

// 2. Hitung rata-rata per siswa per kriteria
progressRecords.forEach(prog => {
  prog.assessments.forEach(ass => {
    sums[studentId][criteriaId] += ass.score
    counts[studentId][criteriaId] += 1
  })
})
const avg = sum / count  // skor rata-rata

// 3. Cari max (dan min untuk cost criteria) per kriteria
// 4. Normalisasi
norm = (type === "benefit") ? raw / max : min / raw

// 5. Weighted sum
totalScore = Σ(normalized[criteriaId] × criteria.weight)

// 6. Tentukan predikat & simpan ke SawResult
```

**Hasil disimpan ke tabel `SawResult`** dengan format unik `(studentId, period)` sehingga kalkulasi ulang akan meng-update data lama (upsert).

---

## Catatan Penting

> **Mengapa hasil bisa berubah setelah data baru diinput?**
> SAW menggunakan **nilai maksimum relatif dari kelas tersebut**, bukan skala absolut. Jika satu siswa mendapat nilai lebih tinggi setelah minggu baru diinput, normalisasi seluruh kelas akan berubah. Selalu lakukan kalkulasi ulang setelah menginput data minggu baru.

> **Apa yang terjadi jika siswa tidak punya nilai di satu minggu?**
> Minggu yang kosong tidak dihitung dalam rata-rata (hanya minggu yang terisi yang dirata-rata). Jika siswa sama sekali tidak punya nilai di bulan tersebut, ia tidak akan masuk dalam perankingan SAW bulan itu.
