# Panduan Migrasi & Perubahan Skema Database (Prisma & Supabase)

Dokumen ini berisi panduan langkah-demi-langkah jika Anda diuji saat sidang untuk **mengubah nama kolom (field)** atau **struktur database**. 

Ada 2 skenario cara kerja yang bisa Anda lakukan tergantung pada perintah dosen penguji:

---

## 🛠️ SKENARIO A: Mengubah dari Kode (Code-First) - *Sangat Direkomendasikan*
Gunakan alur ini jika dosen meminta Anda mengubah kolom melalui file konfigurasi kode aplikasi Anda.

### **Langkah 1: Edit file `prisma/schema.prisma`**
1. Buka file `prisma/schema.prisma` di VS Code.
2. Cari tabel/model yang ingin diubah (misalnya `User` atau `Student`).
3. Ubah nama field/kolom yang diinginkan.
   * *Contoh:* Mengubah `name` menjadi `nama` pada model `User`:
     ```prisma
     model User {
       id    Int    @id @default(autoincrement())
       nama  String // <-- Ganti dari "name String"
       email String @uniqueV
       // ...
     }
     ```

### **Langkah 2: Terapkan Migrasi ke Supabase**
Jalankan perintah ini di terminal VS Code Anda:
```bash
npx prisma migrate dev --name ubah_nama_kolom
```
* **Apa yang dilakukan perintah ini?**
  1. Prisma membandingkan file `schema.prisma` dengan database Supabase Anda.
  2. Prisma membuat file SQL migrasi di folder `prisma/migrations`.
  3. Prisma menjalankan SQL tersebut ke database Supabase untuk mengubah kolom secara fisik.
  4. Prisma **otomatis** menjalankan `npx prisma generate` untuk memperbarui library Prisma Client di proyek Next.js.

---

## ☁️ SKENARIO B: Mengubah Langsung dari Dashboard Supabase (Database-First)
Gunakan alur ini jika dosen meminta Anda membuka browser, masuk ke Supabase, dan mengubah kolom langsung dari tabel editor Supabase.

### **Langkah 1: Ubah Nama Kolom di Supabase**
1. Buka browser dan masuk ke **Dashboard Supabase**.
2. Pilih menu **Table Editor** di sebelah kiri.
3. Pilih tabel yang ingin diubah (misalnya tabel `User`).
4. Cari kolom yang ingin diganti (misal `name`), klik ikon tiga titik di kolom tersebut, lalu pilih **Edit Column**.
5. Ubah namanya menjadi `nama`, lalu klik **Save**.

### **Langkah 2: Tarik Struktur Baru ke Kode Lokal**
Jalankan perintah berikut di terminal VS Code agar file `schema.prisma` lokal Anda diperbarui otomatis sesuai dengan Supabase:
```bash
npx prisma db pull
```

### **Langkah 3: Perbarui Kode Prisma Client**
Karena struktur lokal sudah di-update oleh perintah di atas, Anda **wajib** memperbarui generator Prisma Client agar Next.js mengenali tipe data/kolom baru tersebut. Jalankan perintah:
```bash
npx prisma generate
```

---

## 💻 Langkah 3 (Wajib Untuk Kedua Skenario): Sesuaikan Kode Next.js
Setelah database dan Prisma Client diperbarui, Anda harus mengganti pemanggilan nama kolom lama di kode JavaScript Next.js Anda.

1. Tekan tombol **`Ctrl + Shift + F`** (Windows) atau **`Cmd + Shift + F`** (Mac) di VS Code untuk mencari kata kunci secara massal.
2. Cari nama field lama (contoh: `.name` untuk user).
3. Sesuaikan kode di:
   * **API Routes (`src/app/api/...`):** Ubah nama properti di dalam query Prisma (misal `select: { name: true }` menjadi `select: { nama: true }`).
   * **Halaman Frontend (`src/app/(dashboard)/...`):** Ubah variabel tampilan data (misal `{user.name}` menjadi `{user.nama}`).
4. Simpan semua file dan restart server dev jika perlu dengan menekan `Ctrl + C` di terminal lalu ketik `npm run dev`.

---

## 💡 Contekan Perintah Cepat (Cheat Sheet)

| Perintah Terminal | Kegunaan | Kapan Digunakan? |
| :--- | :--- | :--- |
| `npx prisma migrate dev --name <nama>` | Mengirim perubahan skema dari file lokal ke database Supabase (Auto-Generate). | Skenario A (Code-First) |
| `npx prisma db pull` | Menarik struktur database dari Supabase ke file `schema.prisma` lokal Anda. | Skenario B (Database-First) |
| `npx prisma generate` | Membuat ulang library compiler Prisma Client lokal sesuai file `schema.prisma` terbaru. | Setelah `db pull` atau saat tipe data tidak terdeteksi. |
| `npx prisma studio` | Membuka antarmuka web lokal untuk melihat/mengedit data database secara visual. | Untuk memeriksa data di database secara cepat tanpa membuka Supabase. |

---

## 🎓 SIMULASI PENGUJIAN SIDANG: Memperbaiki Error Secara Cepat

Jika dosen penguji sengaja meminta Anda mengubah kolom untuk **melihat bagaimana Anda melacak dan memperbaiki error**, ikuti simulasi skenario paling aman dan cepat ini.

### 🎯 Skenario Uji Terbaik: Mengubah `Criteria.weight` (Bobot) Menjadi `bobot`

Kolom **`weight`** pada tabel **`Criteria`** adalah pilihan terbaik untuk simulasi karena memicu error validasi backend (Prisma Client Validation) yang terlihat profesional, tetapi letak perbaikan kodenya sangat terpusat dan sedikit.

#### **Langkah 1: Lakukan Perubahan di Database**
1. Ubah nama kolom `weight` menjadi `bobot` langsung di **Supabase Table Editor** (Skenario B) atau di `schema.prisma` (Skenario A).
2. Jalankan di terminal:
   ```bash
   npx prisma db pull
   npx prisma generate
   ```
3. Buka halaman **Manajemen Kriteria** di browser. Halaman akan menampilkan error **500 Internal Server Error** (atau loading terus menerus).

#### **Langkah 2: Baca Pesan Error di Terminal**
1. Buka terminal VS Code tempat server dev berjalan (`npm run dev`).
2. Tunjukkan ke penguji pesan error merah berikut:
   ```text
   Unknown field `weight` for select statement on model `Criteria`. Did you mean `bobot`?
   ```
3. Katakan kepada dosen penguji:
   > *"Sistem mengalami error karena Prisma mendeteksi properti `weight` sudah diganti namanya di database menjadi `bobot`. Kita perlu menyelaraskan nama properti ini di dalam kode Next.js."*

#### **Langkah 3: Perbaiki Kode (Hanya di 3 File)**

Tekan `Ctrl + P` (atau `Cmd + P` di Mac), lalu buka file-file berikut untuk mengubah `weight` menjadi `bobot`:

1. **📄 `src/app/api/criteria/route.js`** (API POST & GET)
   * Ganti baris input data pada method `POST`:
     ```javascript
     // Sebelum:
     data: { code, name, weight: parseFloat(weight), type }
     // Sesudah:
     data: { code, name, bobot: parseFloat(bobot), type }
     ```

2. **📄 `src/app/api/criteria/[id]/route.js`** (API PUT)
   * Ganti baris input data pada method `PUT`:
     ```javascript
     // Sebelum:
     data: { code, name, weight: parseFloat(weight), type }
     // Sesudah:
     data: { code, name, bobot: parseFloat(bobot), type }
     ```

3. **📄 `src/app/(dashboard)/dashboard/admin/criteria/page.jsx`** (Frontend UI)
   * Cari semua kata `weight` di file ini dengan `Ctrl + F`, lalu sesuaikan ke `bobot`:
     * Pada data tabel kriteria: `{crit.weight}` ➡️ `{crit.bobot}`
     * Pada input modal form: `formData.weight` ➡️ `formData.bobot`
     * Pada fungsi validasi bobot di client.

