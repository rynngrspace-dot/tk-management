# Panduan Administrator

Panduan ini ditujukan untuk **Administrator** sistem TK Management. Admin memiliki akses penuh ke seluruh fitur aplikasi.

---

## Daftar Isi

1. [Login](#1-login)
2. [Dashboard Admin](#2-dashboard-admin)
3. [Manajemen Siswa](#3-manajemen-siswa)
4. [Manajemen Orang Tua](#4-manajemen-orang-tua)
5. [Manajemen Guru](#5-manajemen-guru)
6. [Manajemen Kelas](#6-manajemen-kelas)
7. [Manajemen Kriteria SAW](#7-manajemen-kriteria-saw)
8. [Melihat Hasil SAW](#8-melihat-hasil-saw)
9. [Log Aktivitas](#9-log-aktivitas)
10. [Alur Kerja yang Direkomendasikan](#10-alur-kerja-yang-direkomendasikan)

---

## 1. Login

1. Buka aplikasi dan akses halaman `/login`
2. Masukkan **Email** dan **Password** akun admin
3. Klik tombol **Masuk**
4. Sistem akan mengarahkan ke `/dashboard/admin` secara otomatis

> **Credential default** (ubah setelah pertama login): lihat konfigurasi awal di tim developer.

---

## 2. Dashboard Admin

Dashboard menampilkan ringkasan real-time:

| Kartu | Informasi |
|-------|-----------|
| **Total Siswa** | Jumlah siswa aktif terdaftar |
| **Total Guru** | Jumlah guru yang terdaftar |
| **Total Kelas** | Jumlah kelas yang aktif |
| **Total Kriteria** | Jumlah kriteria SAW yang dikonfigurasi |

Di bagian bawah terdapat **Log Aktivitas Terbaru** — 5 aktivitas sistem terakhir yang dilakukan oleh pengguna manapun.

---

## 3. Manajemen Siswa

**Halaman:** `Dashboard → Siswa`

### Melihat Daftar Siswa

- Tabel menampilkan: No, Nama, NIS, Kelas, Jenis Kelamin, dan Nama Orang Tua
- Gunakan fitur pencarian untuk menyaring nama siswa
- Klik ikon **Edit** (pensil) untuk mengubah data siswa

### Menambah Siswa Baru

1. Klik tombol **+ Tambah Siswa** (pojok kanan atas)
2. Isi formulir:
   - **NIS** (Nomor Induk Siswa) — wajib, harus unik
   - **Nama Lengkap** — wajib
   - **Jenis Kelamin** — pilih L atau P
   - **Tanggal Lahir**
   - **Kelas** — pilih kelas yang tersedia
   - **Nama Orang Tua**, **No. HP Orang Tua**, **Alamat**, **Alergi** (opsional)
3. Klik **Simpan Siswa**

> **Penting:** Saat siswa baru ditambahkan, akun orang tua **belum** otomatis dibuat. Buat akun orang tua secara terpisah di menu Orang Tua dan hubungkan ke siswa.

### Mengedit Data Siswa

Halaman edit memiliki dua tab:

**Tab "Data Siswa":**
- Edit semua informasi profil siswa (nama, NIS, kelas, dll.)
- Terlihat juga nama dan email orang tua yang sudah terhubung

**Tab "Data Akademik":**
- Melihat histori nilai dan catatan perkembangan _(read-only di sisi admin)_

---

## 4. Manajemen Orang Tua

**Halaman:** `Dashboard → Orang Tua`

### Melihat Daftar Orang Tua

Tabel menampilkan: No, Nama, Email, Nama Anak yang Terhubung.

> Orang tua yang belum terhubung ke siswa manapun akan terlihat tetapi tidak bisa mengakses data anak.

### Menambah Akun Orang Tua

1. Klik **+ Tambah Orang Tua**
2. Isi formulir:
   - **Nama Orang Tua** — wajib
   - **Email** — wajib, digunakan untuk login
   - **Siswa yang Ditautkan** — pilih nama anak dari dropdown
   - **Password** — otomatis terisi dengan **NIS anak** yang dipilih (dapat diubah manual)
3. Klik **Simpan**

> **Password default = NIS anak.** Informasikan kepada orang tua bahwa password awal mereka adalah NIS putra/putri mereka.

### Mengedit Akun Orang Tua

- Dapat mengubah nama, email, dan tautan ke siswa
- Jika siswa ditautkan diubah, field password akan otomatis terisi NIS siswa baru (sebagai saran; admin tetap bisa mengubahnya)
- Kosongkan field password jika **tidak ingin** mengubah password

---

## 5. Manajemen Guru

**Halaman:** `Dashboard → Guru`

### Menambah Guru

1. Klik **+ Tambah Guru**
2. Isi formulir:
   - **Nama Lengkap** — wajib
   - **Email** — wajib, digunakan untuk login
   - **Password** — atur password awal
   - **Kelas Pengampu** — pilih kelas yang diajar (opsional, bisa diset nanti)
3. Klik **Simpan**

### Mengedit Data Guru

- Ubah nama, email, dan kelas pengampu
- Kosongkan field password jika tidak ingin mengubah password guru

> Guru hanya dapat melihat dan menginput nilai untuk **kelas yang ditautkan** ke akunnya.

---

## 6. Manajemen Kelas

**Halaman:** `Dashboard → Kelas`

### Menambah Kelas

1. Klik **+ Tambah Kelas**
2. Isi:
   - **ID Kelas** — kode singkat, contoh: `A`, `B`, `C`
   - **Nama Kelas** — nama lengkap, contoh: `Kelas A (Usia 4-5 Tahun)`
3. Klik **Simpan**

### Mengedit Kelas

Ubah nama kelas. ID kelas tidak dapat diubah setelah dibuat.

> Pastikan kelas sudah dibuat **sebelum** menambahkan siswa dan guru.

---

## 7. Manajemen Kriteria SAW

**Halaman:** `Dashboard → Kriteria SAW`

Kriteria adalah aspek perkembangan anak yang dinilai oleh guru setiap minggu.

### Menambah Kriteria

1. Klik **+ Tambah Kriteria**
2. Isi formulir:
   - **Kode** — singkatan unik, contoh: `C1`, `C2`, `MK`, `BHS`
   - **Nama Kriteria** — deskripsi lengkap, contoh: `Motorik Kasar`
   - **Bobot (%)** — angka desimal, contoh: `0.25` untuk 25%
   - **Tipe**:
     - `benefit` — semakin tinggi nilainya semakin baik (contoh: kemampuan bahasa)
     - `cost` — semakin rendah nilainya semakin baik (jarang digunakan di PAUD)
3. Klik **Simpan**

> **Penting:** Total bobot semua kriteria sebaiknya = **1.0 (100%)**. Contoh: 4 kriteria masing-masing 0.25. Jika tidak, skor SAW akhir tidak akan berskala 0-1.

### Kriteria yang Dikonfigurasi di Sistem

Berikut adalah 6 kriteria penilaian yang aktif dalam sistem:

| Kode | Nama Kriteria | Bobot | Tipe |
|------|---------------|-------|------|
| C1 | Nilai Agama & Moral | 0.20 (20%) | benefit |
| C2 | Fisik-Motorik | 0.15 (15%) | benefit |
| C3 | Kognitif | 0.20 (20%) | benefit |
| C4 | Bahasa | 0.15 (15%) | benefit |
| C5 | Sosial-Emosional | 0.10 (10%) | benefit |
| C6 | Seni | 0.20 (20%) | benefit |

**Total bobot: 1.00 (100%)** ✓

---

## 8. Melihat Hasil SAW

**Halaman:** `Dashboard → Hasil SAW` _(atau via menu Guru)_

Admin dapat melihat hasil SAW dari **semua kelas** dengan memilih filter:
- **Kelas** — pilih kelas atau "Semua Kelas"
- **Bulan** dan **Tahun** periode penilaian

Tabel menampilkan ranking siswa beserta skor SAW dan predikat perkembangan.

> Admin tidak perlu melakukan kalkulasi SAW sendiri — guru bertanggung jawab mengklik tombol **Kalkulasi** setelah menginput nilai.

---

## 9. Log Aktivitas

**Halaman:** `Dashboard → Log Aktivitas`

Menampilkan histori aktivitas sistem: siapa yang login, siapa yang menambah/mengubah data, dan kapan. Berguna untuk audit.

---

## 10. Alur Kerja yang Direkomendasikan

### Setup Awal (Sekali saja)

```
1. Buat semua Kelas
      ↓
2. Tambah Kriteria SAW dan atur bobotnya (total = 1.0)
      ↓
3. Tambah data Guru dan tautkan ke Kelas
      ↓
4. Tambah data Siswa dan masukkan ke Kelas
      ↓
5. Buat akun Orang Tua dan tautkan ke Siswa
      ↓
6. Informasikan email & password awal ke guru dan orang tua
```

### Setiap Bulan

```
Guru input nilai mingguan (W1-W5 per bulan)
      ↓
Guru klik "Kalkulasi Nilai SAW Baru" di akhir bulan
      ↓
Admin verifikasi hasil di halaman Hasil SAW
      ↓
Orang Tua otomatis dapat melihat hasil di dashboard mereka
```
