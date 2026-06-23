# Dokumentasi Sistem TK Management

Selamat datang di dokumentasi resmi **Sistem Manajemen TK** berbasis metode SAW (Simple Additive Weighting).

## Daftar Dokumen

| Dokumen | Deskripsi | Untuk Siapa |
|---|---|---|
| [saw-algorithm.md](./saw-algorithm.md) | Penjelasan teknis cara kerja algoritma SAW | Developer / Admin |
| [panduan-admin.md](./panduan-admin.md) | Panduan penggunaan lengkap untuk Administrator | Admin |
| [panduan-guru.md](./panduan-guru.md) | Panduan penggunaan untuk Guru / Wali Kelas | Guru |
| [panduan-orang-tua.md](./panduan-orang-tua.md) | Panduan penggunaan untuk Orang Tua Siswa | Orang Tua |

---

## Tentang Sistem

Sistem ini merupakan aplikasi manajemen sekolah TK (Taman Kanak-kanak) yang mengintegrasikan:

- **Manajemen Data Master** — Siswa, Guru, Orang Tua, Kelas
- **Penilaian Mingguan** — Input nilai perkembangan anak berbasis skala PAUD nasional
- **Algoritma SAW** — Perankingan objektif berdasarkan multi-kriteria tumbuh kembang
- **Laporan Orang Tua** — Dashboard transparan untuk memantau perkembangan anak

## Skala Penilaian PAUD Nasional

Seluruh penilaian menggunakan standar resmi Kemendikbud:

| Nilai | Kode | Keterangan |
|-------|------|------------|
| 1 | **BB** | Belum Berkembang |
| 2 | **MB** | Mulai Berkembang |
| 3 | **BSH** | Berkembang Sesuai Harapan |
| 4 | **BSB** | Berkembang Sangat Baik |

## Struktur Peran (Role)

```
Admin
 ├── Kelola data master (siswa, guru, orang tua, kelas)
 ├── Atur kriteria SAW dan bobotnya
 └── Lihat semua hasil dan laporan

Guru
 ├── Input nilai mingguan per siswa
 ├── Tulis catatan perkembangan
 └── Kalkulasi dan lihat hasil SAW kelasnya

Orang Tua
 ├── Lihat peringkat anak di kelas
 ├── Lihat laporan perkembangan mingguan
 └── Pantau histori per periode (bulan)
```

## Teknologi

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Session-based (JWT cookie)
- **Deployment**: Node.js server
