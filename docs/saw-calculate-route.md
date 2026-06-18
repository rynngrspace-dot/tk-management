# Penjelasan Proses Route API `saw/calculate`

Dokumen ini menjelaskan alur kerja dan detail proses kode program pada file **`src/app/api/saw/calculate/route.js`**. Route API ini berfungsi untuk melakukan seluruh kalkulasi metode SAW (Simple Additive Weighting) pada periode (bulan dan tahun) tertentu dan menyimpan hasilnya ke database.

---

## Pemetaan Tabel Database

Proses kalkulasi ini berinteraksi dengan beberapa tabel di database melalui Prisma client:

| Nama Tabel | Peran dalam Route | Operasi | Keterangan |
| :--- | :--- | :--- | :--- |
| **`Criteria`** | Sumber Kriteria & Bobot | `findMany` | Mengambil seluruh kriteria beserta bobot ($W_j$) dan tipenya (*benefit*/*cost*). |
| **`WeeklyProgress`** | Sumber Progres Mingguan | `findMany` | Mengambil data perkembangan mingguan anak yang dicatat dalam periode bulan & tahun tertentu. |
| **`Assessment`** | Sumber Nilai Mentah | `include` | Relasi dari `WeeklyProgress`. Mengambil skor mentah ($1-4$) per kriteria untuk minggu-minggu terkait. |
| **`Student`** | Penyaringan Kelas | Relasi query | Memfilter pengambilan data perkembangan berdasarkan `classId` (kelas) dari siswa tersebut. |
| **`SawResult`** | Hasil Perhitungan Akhir | `upsert` | Menyimpan/memperbarui peringkat total skor preferensi ($V_i$) dan status kelulusan perkembangan per siswa untuk periode tersebut. |

---

## Alur Eksekusi Kode Program

Route ini menerima request HTTP `POST` dan memprosesnya dengan tahapan berikut:

### 1. Autentikasi & Otorisasi Sesi
```javascript
const session = await getSession()
if (!session || (session.role !== "admin" && session.role !== "teacher")) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```
* **Proses:** Mengambil informasi sesi aktif pengguna menggunakan `getSession()`.
* **Fungsi:** Memastikan pengguna sudah login dan memiliki peran (`role`) sebagai `"admin"` atau `"teacher"`. Jika tidak valid, mengembalikan status error `401 Unauthorized`.

---

### 2. Parsing & Validasi Request Body
```javascript
const body = await req.json()
let { month, year, period, classId } = body

// Enforce teacher's class
if (session.role === "teacher") {
  classId = session.classId
}

if (!month || !year || !period) {
  return NextResponse.json({ error: "Parameter wajib: month, year, period" }, { status: 400 })
}
```
* **Proses:** Membaca data JSON yang dikirim oleh client: `month` (bulan), `year` (tahun), `period` (nama periode, misal: "Agustus 2026"), dan `classId` (opsional untuk filter kelas).
* **Fungsi:** 
  * Jika pengguna adalah `"teacher"`, sistem secara otomatis membatasi `classId` hanya pada kelas guru tersebut (`session.classId`).
  * Mengecek kelengkapan parameter wajib. Jika ada yang kosong, mengembalikan status error `400 Bad Request`.

---

### 3. Mengambil Daftar Kriteria Penilaian
```javascript
// 1. Dapatkan daftar kriteria
const criteriaList = await prisma.criteria.findMany()
if (criteriaList.length === 0) {
  return NextResponse.json({ error: "Belum ada kriteria, matriks tidak bisa dihitung" }, { status: 400 })
}
```
* **Proses:** Menanyakan ke database seluruh kriteria penilaian yang terdaftar melalui `prisma.criteria.findMany()`.
* **Fungsi:** Mengambil data kriteria beserta bobotnya ($W_j$) dan tipenya (benefit/cost). Jika tabel kriteria kosong, perhitungan SAW dihentikan dengan status error `400`.

---

### 4. Mengumpulkan Rekaman Nilai Mingguan Siswa
```javascript
// 2. Kumpulkan semua nilai assessment dari progress mingguan untuk kelas dan periode tsb
const filterStudent = classId ? { classId: classId.toString() } : {}

const progressRecords = await prisma.weeklyProgress.findMany({
  where: {
    month: month.toString(),
    year: parseInt(year),
    student: filterStudent
  },
  include: {
    assessments: true
  }
})

if (progressRecords.length === 0) {
  return NextResponse.json({ message: "Tidak ada data nilai yang diproses pada periode ini" }, { status: 404 })
}
```
* **Proses:** Mengambil data perkembangan mingguan siswa (`weeklyProgress`) beserta rincian skor penilaiannya (`assessments`) untuk periode bulan dan tahun yang sesuai. Jika dikirim parameter `classId`, maka pencarian disaring hanya untuk siswa di kelas tersebut.
* **Fungsi:** Mengumpulkan matriks keputusan mentah ($X_{ij}$) dari database. Jika tidak ada rekaman nilai sama sekali pada periode tersebut, mengembalikan status `404 Not Found`.

---

### 5. Agregasi Nilai Mingguan Menjadi Rata-Rata Bulanan
```javascript
const studentTrack = {}

progressRecords.forEach(prog => {
  const sId = prog.studentId
  if (!studentTrack[sId]) studentTrack[sId] = { sums: {}, counts: {} }

  prog.assessments.forEach(ass => {
    const cId = ass.criteriaId
    if (!studentTrack[sId].sums[cId]) {
      studentTrack[sId].sums[cId] = 0
      studentTrack[sId].counts[cId] = 0
    }
    studentTrack[sId].sums[cId] += ass.score
    studentTrack[sId].counts[cId] += 1
  })
})
```
* **Proses:** Karena guru menilai perkembangan anak setiap minggu (Minggu 1, Minggu 2, dst.), nilai untuk kriteria yang sama diakumulasikan (`sums`) dan dihitung frekuensinya (`counts`) per siswa.
* **Fungsi:** Mempersiapkan data untuk menghitung rata-rata bulanan.

```javascript
const studentAverageScores = {}
const cMaxMin = {} // { cId: { max: X, min: Y } }

Object.keys(studentTrack).forEach(sId => {
  studentAverageScores[sId] = {}
  criteriaList.forEach(c => {
    const sum = studentTrack[sId].sums[c.id] || 0
    const count = studentTrack[sId].counts[c.id] || 0
    const avg = count > 0 ? sum / count : 0

    studentAverageScores[sId][c.id] = avg

    if (!cMaxMin[c.id]) cMaxMin[c.id] = { max: avg, min: avg }
    if (avg > cMaxMin[c.id].max) cMaxMin[c.id].max = avg
    if (avg < cMaxMin[c.id].min) cMaxMin[c.id].min = avg
  })
})
```
* **Proses:** Menghitung rata-rata nilai bulanan siswa per kriteria. Secara bersamaan, kode ini juga mencari nilai rata-rata maksimum (`max`) dan minimum (`min`) di antara seluruh siswa untuk setiap kriteria.

---

### 6. Normalisasi Matriks Keputusan ($R_{ij}$)
```javascript
// 3. Normalisasi
const normalized = {}
Object.keys(studentAverageScores).forEach(sId => {
  normalized[sId] = {}
  criteriaList.forEach(c => {
    const raw = studentAverageScores[sId][c.id]
    let norm = 0
    if (c.type === "benefit") {
      norm = cMaxMin[c.id].max > 0 ? raw / cMaxMin[c.id].max : 0
    } else {
      norm = raw > 0 ? cMaxMin[c.id].min / raw : 0
    }
    normalized[sId][c.id] = norm
  })
})
```
* **Proses:** Melakukan normalisasi nilai berdasarkan tipe kriteria:
  * **Benefit:** Nilai siswa dibagi dengan nilai tertinggi di kelompoknya ($\frac{X_{ij}}{\text{Max } X_j}$).
  * **Cost:** Nilai terendah di kelompoknya dibagi dengan nilai siswa ($\frac{\text{Min } X_j}{X_{ij}}$).

---

### 7. Pembobotan & Klasifikasi Status Perkembangan Akhir
```javascript
// 4. Pembobotan & Hasil Akhir
const bulkUpsert = []
for (const sId of Object.keys(normalized)) {
  let totalScore = 0
  criteriaList.forEach(c => {
    totalScore += (normalized[sId][c.id] || 0) * c.weight
  })

  // Predikat (Maturitas TK)
  let status = "Perlu Bimbingan (BB)"
  if (totalScore >= 0.85) status = "Berkembang Sangat Baik (BSB)"
  else if (totalScore >= 0.70) status = "Berkembang Sesuai Harapan (BSH)"
  else if (totalScore >= 0.50) status = "Mulai Berkembang (MB)"

  bulkUpsert.push({
    studentId: parseInt(sId),
    period: period,
    totalScore: parseFloat(totalScore.toFixed(3)),
    status
  })
}
```
* **Proses:** 
  1. Menghitung nilai preferensi akhir dengan mengalikan nilai normalisasi dengan bobot masing-masing kriteria ($W_j$) lalu menjumlahkannya.
  2. Menentukan predikat perkembangan siswa berdasarkan rentang skor akhir.
  3. Memasukkan hasil kalkulasi ke dalam array `bulkUpsert` untuk dipersiapkan masuk ke database.

---

### 8. Menyimpan atau Memperbarui Hasil Akhir Ke Database
```javascript
// 5. Simpan ke database
for (const record of bulkUpsert) {
  await prisma.sawResult.upsert({
    where: {
      studentId_period: {
        studentId: record.studentId,
        period: record.period
      }
    },
    update: {
      totalScore: record.totalScore,
      status: record.status
    },
    create: {
      studentId: record.studentId,
      period: record.period,
      totalScore: record.totalScore,
      status: record.status
    }
  })
}
```
* **Proses:** Menyimpan hasil akhir menggunakan `prisma.sawResult.upsert(...)`.
* **Fungsi:** Mencegah terjadinya duplikasi data. Jika data nilai siswa pada periode tersebut sudah ada, maka skor dan statusnya akan diperbarui (*update*). Jika belum ada, sistem akan membuat rekaman data baru (*create*).

---

### 9. Return Response Berhasil & Penanganan Kesalahan (Error Handling)
```javascript
    return NextResponse.json({ success: true, processedStudents: bulkUpsert.length })
  } catch (error) {
    console.error("Calculation Error:", error)
    return NextResponse.json({ error: "Gagal menghitung SAW", details: error.message }, { status: 500 })
  }
}
```
* **Proses:** 
  * Jika sukses, mengembalikan response JSON `success: true` beserta jumlah siswa yang berhasil dihitung.
  * Jika terjadi error/kesalahan sistem, blok `catch` akan menangkap error tersebut, mencatat detailnya di log server, dan mengembalikan HTTP status `500 Internal Server Error` dengan pesan kesalahan terkait.
