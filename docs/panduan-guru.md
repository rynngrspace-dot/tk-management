# Panduan Guru / Wali Kelas

Panduan ini ditujukan untuk **Guru atau Wali Kelas** yang bertanggung jawab menginput penilaian perkembangan siswa setiap minggu.

---

## Daftar Isi

1. [Login](#1-login)
2. [Dashboard Guru](#2-dashboard-guru)
3. [Input Nilai Mingguan](#3-input-nilai-mingguan)
4. [Ringkasan Progres Mingguan](#4-ringkasan-progres-mingguan)
5. [Kalkulasi & Hasil SAW](#5-kalkulasi--hasil-saw)
6. [Daftar Siswa Saya](#6-daftar-siswa-saya)
7. [Absensi](#7-absensi)
8. [Kalender](#8-kalender)
9. [Alur Kerja Bulanan](#9-alur-kerja-bulanan)
10. [FAQ Guru](#10-faq-guru)

---

## 1. Login

1. Buka aplikasi dan akses halaman `/login`
2. Masukkan **Email** dan **Password** yang diberikan oleh Admin sekolah
3. Klik **Masuk**
4. Sistem akan langsung mengarahkan ke **Dashboard Guru**

> Jika lupa password, hubungi Administrator untuk reset.

---

## 2. Dashboard Guru

Dashboard menampilkan ringkasan kelas Anda:

| Kartu | Informasi |
|-------|-----------|
| **Total Siswa** | Jumlah siswa di kelas Anda |
| **Input Nilai** | Shortcut ke halaman input nilai |
| **Hasil SAW** | Shortcut ke halaman hasil perankingan |
| **Kalender** | Jadwal dan pengumuman |

Bagian bawah menampilkan **daftar siswa** di kelas Anda dan shortcut ke berbagai fitur.

---

## 3. Input Nilai Mingguan

**Halaman:** `Sidebar → Input Nilai`  
**URL:** `/dashboard/teacher/assessment`

Ini adalah fitur utama yang Anda gunakan **setiap minggu**.

### Langkah-langkah Input Nilai

**Step 1 — Pilih periode:**
- **Kelas** — otomatis terisi dengan kelas Anda (tidak dapat diubah guru)
- **Minggu Ke** — pilih minggu yang sedang berjalan (1, 2, 3, 4, atau 5)
- **Bulan** — pilih bulan yang sedang berjalan
- **Tahun** — pilih tahun

**Step 2 — Isi nilai per kriteria:**

Tabel menampilkan seluruh siswa di baris, dan setiap kriteria di kolom. Untuk setiap siswa dan setiap kriteria, pilih nilai dari dropdown:

| Pilihan | Kode | Artinya |
|---------|------|---------|
| BB (1) | Belum Berkembang | Anak belum menunjukkan kemampuan pada aspek ini |
| MB (2) | Mulai Berkembang | Anak mulai menunjukkan kemampuan dengan bantuan |
| BSH (3) | Berkembang Sesuai Harapan | Anak mampu tanpa bantuan sesuai usia |
| BSB (4) | Berkembang Sangat Baik | Anak melampaui capaian yang diharapkan |

**Step 3 — Tulis catatan perkembangan (opsional):**

Di kolom paling kanan, tulis catatan naratif tentang perkembangan anak selama minggu tersebut. Catatan ini akan terlihat oleh orang tua di dashboard mereka.

**Step 4 — Simpan:**
- Klik **Simpan Penilaian** (pojok kanan bawah)
- Sistem akan menampilkan notifikasi berhasil

> **Tips:** Nilai yang dropdown-nya masih "— Pilih —" tidak akan disimpan. Pastikan semua kolom terisi sebelum menyimpan.

### Memuat Data yang Sudah Ada

Jika Anda sudah pernah mengisi nilai untuk minggu dan bulan yang sama, data tersebut akan **otomatis tampil** saat Anda membuka halaman dengan filter yang sama. Anda bisa langsung mengedit dan menyimpan ulang.

---

## 4. Ringkasan Progres Mingguan

**Halaman:** `Sidebar → Ringkasan Progres`  
**URL:** `/dashboard/teacher/progress`

Halaman ini menampilkan **tabel rekap** seluruh nilai yang sudah diinput untuk bulan tertentu.

### Cara Membaca Tabel

| Kolom | Keterangan |
|-------|------------|
| **Nama Siswa** | Nama dan NIS siswa |
| **W1 – W5** | Total skor semua kriteria pada minggu tersebut. Klik angka untuk melihat breakdown per kriteria. |
| **Skor Total (V)** | Skor akhir SAW (tersedia setelah kalkulasi dilakukan) |
| **Keterangan (SAW)** | Predikat perkembangan: BSB / BSH / MB / BB |

### Tooltip Breakdown Nilai

Arahkan kursor ke angka di kolom **W1–W5** untuk melihat rincian nilai per kriteria:

```
Breakdown Nilai W2
──────────────────
MK:  BSH
BHS: BSB
KOG: MB
SEM: BSH
```

---

## 5. Kalkulasi & Hasil SAW

**Halaman:** `Sidebar → Hasil SAW`  
**URL:** `/dashboard/teacher/saw-results`

Setelah selesai mengisi nilai selama **satu bulan penuh**, lakukan kalkulasi SAW untuk mendapatkan perankingan siswa.

### Cara Kalkulasi

1. Pilih **Bulan** dan **Tahun** yang ingin dihitung
2. Klik tombol **Kalkulasi Nilai SAW Baru** (biru, pojok kanan atas)
3. Tunggu beberapa saat — sistem akan memproses semua nilai
4. Notifikasi sukses muncul: _"Berhasil mengevaluasi X siswa via algoritma SAW"_
5. Tabel ranking akan langsung diperbarui

### Membaca Tabel Hasil

| Kolom | Keterangan |
|-------|------------|
| **Rank** | Urutan siswa (🏆 = peringkat 1) |
| **Nama Siswa** | Nama dan NIS |
| **W1–W5** | Total nilai per minggu (klik untuk detail) |
| **Skor (V)** | Nilai SAW akhir dalam desimal (0.000 – 1.000) |
| **Evaluasi** | Predikat: BSB / BSH / MB / BB |

### Keterangan Predikat

| Skor V | Predikat | Warna |
|--------|----------|-------|
| ≥ 0.85 | Berkembang Sangat Baik (BSB) | Hijau |
| ≥ 0.70 | Berkembang Sesuai Harapan (BSH) | Biru |
| ≥ 0.50 | Mulai Berkembang (MB) | Kuning |
| < 0.50 | Perlu Bimbingan (BB) | Merah |

> Kalkulasi dapat dilakukan **lebih dari satu kali** dalam sebulan. Setiap kalkulasi ulang akan **memperbarui** hasil sebelumnya dengan data terbaru.

---

## 6. Daftar Siswa Saya

**Halaman:** `Sidebar → Siswa Saya`  
**URL:** `/dashboard/teacher/my-students`

Menampilkan daftar lengkap siswa di kelas Anda beserta informasi profil dasar.

---

## 7. Absensi

**Halaman:** `Sidebar → Absensi`  
**URL:** `/dashboard/teacher/attendance`

Fitur pencatatan kehadiran siswa harian. _(Dokumentasi fitur ini akan diperbarui)_

---

## 8. Kalender

**Halaman:** `Sidebar → Kalender`  
**URL:** `/dashboard/teacher/calendar`

Menampilkan kalender akademik, hari libur, dan pengumuman penting. _(Dokumentasi fitur ini akan diperbarui)_

---

## 9. Alur Kerja Bulanan

Ikuti alur ini setiap bulan untuk memastikan data lengkap dan akurat:

```
Awal Bulan
  ↓
Minggu 1 selesai → Input nilai W1 (semua siswa, semua kriteria)
  ↓
Minggu 2 selesai → Input nilai W2
  ↓
Minggu 3 selesai → Input nilai W3
  ↓
Minggu 4 selesai → Input nilai W4
  ↓
Minggu 5 (jika ada) → Input nilai W5
  ↓
Akhir Bulan → Klik "Kalkulasi Nilai SAW Baru"
  ↓
Hasil perankingan tersedia untuk Admin dan Orang Tua
```

---

## 10. FAQ Guru

**Q: Bolehkah saya mengosongkan beberapa nilai?**  
A: Boleh. Nilai yang tidak diisi tidak dihitung dalam rata-rata. Namun pastikan konsisten — jika semua siswa lain punya nilai di W3, siswa yang kosong di W3 akan mendapat skor 0 untuk minggu itu dalam agregasi.

**Q: Bagaimana jika saya salah input?**  
A: Buka kembali halaman Input Nilai dengan filter minggu, bulan, dan tahun yang sama. Data lama akan tampil, ubah nilainya, lalu klik Simpan. Setelah itu lakukan Kalkulasi SAW ulang agar hasil berubah.

**Q: Kapan orang tua bisa melihat hasil?**  
A: Segera setelah Anda klik **Kalkulasi Nilai SAW Baru**. Hasil langsung tersedia di dashboard orang tua.

**Q: Apakah saya bisa melihat data kelas lain?**  
A: Tidak. Guru hanya bisa melihat dan menginput data untuk **kelas yang ditugaskan** Admin kepada akun Anda.

**Q: Apa arti skor V = 0.000 atau N/A?**  
A: Berarti siswa tersebut **belum pernah dikalkulasi** untuk periode yang dipilih. Kemungkinan karena nilai belum diinput atau kalkulasi belum dilakukan.
