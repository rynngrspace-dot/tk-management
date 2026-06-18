# Panduan Instalasi Project

Dokumen ini menjelaskan langkah-langkah untuk melakukan instalasi dan konfigurasi project **TK Management System** di lingkungan lokal Anda.

## Prasyarat (Prerequisites)

Sebelum memulai, pastikan perangkat Anda telah terpasang:
1. **Node.js** (Rekomendasi versi `v20.x` atau lebih baru; project ini berhasil diuji menggunakan `v24.x`)
2. **npm** (biasanya terinstal bersama Node.js)
3. Database **PostgreSQL** (bisa menggunakan PostgreSQL lokal atau layanan cloud seperti Supabase)

---

## Langkah-Langkah Instalasi

### 1. Clone Repository
Clone repository project ke komputer lokal Anda:
```bash
git clone https://github.com/rynngrspace-dot/tk-management.git
cd tk-management
```

### 2. Instalasi Dependencies
Jalankan perintah berikut untuk menginstal seluruh library yang dibutuhkan:
```bash
npm install
```
*Catatan: Perintah ini juga akan menjalankan skrip `postinstall` secara otomatis untuk membuat Prisma Client (`prisma generate`).*

### 3. Konfigurasi Environment Variables (`.env`)
Buat file bernama `.env` di direktori utama (root) project Anda, lalu masukkan konfigurasi berikut:

```env
# Koneksi pooler untuk aplikasi (misal menggunakan port 6543 dengan pgbouncer=true di Supabase)
DATABASE_URL="postgresql://username:password@host:6543/postgres?pgbouncer=true&connection_limit=1"

# Koneksi langsung (direct) untuk migrasi & Prisma CLI (misal menggunakan port 5432)
# Penting: Prisma CLI membutuhkan koneksi langsung (non-pooler)
DIRECT_URL="postgresql://username:password@host:5432/postgres"

# Kunci rahasia untuk enkripsi JWT Token
JWT_SECRET="masukkan-kunci-rahasia-keamanan-disini"
```

### 4. Sinkronisasi Skema Database
Untuk menyinkronkan struktur tabel dari file `prisma/schema.prisma` ke database PostgreSQL Anda, jalankan perintah:
```bash
npx prisma db push
```

### 5. Seeding Data Awal
Untuk mengisi database dengan data default (seperti kelas, akun admin, guru, dan siswa), jalankan perintah:
```bash
node --experimental-strip-types prisma/seed.mts
```

### 6. Menjalankan Aplikasi secara Lokal
Jalankan development server Next.js:
```bash
npm run dev
```
Buka browser Anda dan akses **http://localhost:3000**.

---

## Akun Uji Coba Default (Hasil Seeding)

Setelah menjalankan seeder di langkah 5, Anda dapat menggunakan akun-akun berikut untuk masuk ke sistem:

* **Role Admin:**
  * **Email:** `admin@tk.com`
  * **Password:** `123`
* **Role Guru (Mengajar Kelas Kelompok A):**
  * **Email:** `nisa@tk.com`
  * **Password:** `123`
* **Role Guru (Mengajar Kelas Kelompok B):**
  * **Email:** `asep@tk.com`
  * **Password:** `123`
