# Sistem Manajemen Administrasi Kesiswaan Sekolah Indonesia (SIM-Kesiswaan)

Aplikasi komprehensif administrasi kesiswaan berstandar sekolah di Indonesia untuk pengelolaan data induk siswa, prestasi, beasiswa, mutasi masuk dan keluar (dengan sinkronisasi status otomatis), impor/ekspor data berbasis 5 template Excel/CSV siap pakai, serta pelaporan dan cetak dokumen resmi ber-KOP sekolah.

## User Review & Critical Decisions

> [!IMPORTANT]
> Konfirmasi preferensi dan pengaturan bawaan aplikasi kesiswaan yang diadopsi:

- **Jenjang & Struktur Kelas**: Standar fleksibel SMA/SMK/SMP (pilihan kelas X, XI, XII dengan jurusan IPA, IPS, TKJ, RPL, Akuntansi, serta dukungan kustomisasi nama kelas dan rombel di menu Pengaturan).
- **Dataset Awal (Seed Data)**: Dimuat data simulasi awal yang realistis (siswa aktif, siswa berprestasi di OSN/O2SN/FLS2N, penerima PIP/KIP & Beasiswa Prestasi, mutasi masuk dan mutasi keluar) agar aplikasi langsung dapat diuji coba seketika.
- **Identitas Visual & KOP**: Nuansa Resmi Biru Navy Kemdikbudristek (`#1E3A8A` / `#0F172A`) dengan tipografi tabular bersih, tata letak data grid berdensitas tinggi, dan format KOP Surat Dinas Pendidikan / Sekolah lengkap dengan logo, nomor surat dinas, serta kolom tanda tangan Kepala Sekolah dan Petugas Tata Usaha Kesiswaan.

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**: Sebuah sistem informasi administrasi kesiswaan terpadu untuk sekolah di Indonesia yang mencakup:
  1. **Data Utama Siswa**: Rekam jejak NIS, NISN (unik & wajib), biodata lengkap, orang tua/wali, kontak, dan status siswa (*Aktif, Pindah Masuk, Pindah Keluar, Lulus, Keluar Sekolah*).
  2. **Modul Siswa Berprestasi**: Pencatatan kejuaraan akademik & non-akademik dari tingkat sekolah hingga internasional beserta dokumen pembuktian.
  3. **Modul Beasiswa Siswa**: Pelacakan beasiswa (PIP, KIP, Baznas, Djarum, Yayasan), nominal bantuan (format Rupiah otomatis), status pengajuan, dan periode aktif.
  4. **Modul Mutasi Masuk**: Pencatatan siswa pindahan masuk dari sekolah asal, surat pindah, kelas yang dimasuki, dan pemutakhiran otomatis status siswa menjadi *Pindah Masuk* atau *Aktif*.
  5. **Modul Mutasi Keluar**: Pencatatan mutasi siswa keluar ke sekolah tujuan, riwayat administrasi surat keluar, verifikasi kelulusan/biaya, dan pengubahan otomatis status siswa menjadi *Pindah Keluar*.
  6. **Impor Data Terpadu**: 5 Template Excel/CSV resmi siap unduh, preview validasi baris-per-baris dengan deteksi NIS duplikat atau kolom kosong, serta laporan ringkasan sukses/gagal.
  7. **Ekspor & Cetak Laporan Resmi**: Ekspor data ke format file spreadsheet (.xlsx / .csv) dan dokumen cetak resmi PDF dengan KOP Surat Sekolah, filter periode harian/bulanan/tahunan, dan ruang tanda tangan resmi.
  8. **Pengaturan Identitas Sekolah**: Nama sekolah, NPSN, NSS, alamat, nomor telepon/website, logo sekolah, nama & NIP Kepala Sekolah, serta nama Petugas Kesiswaan.
- **Pengguna Sasaran**: Petugas Administrasi Tata Usaha (TU), Wakil Kepala Sekolah Bidang Kesiswaan, Guru BK, dan Kepala Sekolah.
- **Nilai Utama**: Memangkas waktu pengerjaan administrasi kesiswaan manual, mencegah inkonsistensi nomor induk siswa, dan menghasilkan laporan cetak siap tanda tangan sesuai regulasi Kemdikbudristek.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Navigasi Utama Melalui Sidebar & Breadcrumbs**:
   - Menu: **Dashboard Ringkasan** $\rightarrow$ **Data Utama Siswa** $\rightarrow$ **Prestasi Siswa** $\rightarrow$ **Penerima Beasiswa** $\rightarrow$ **Mutasi Masuk** $\rightarrow$ **Mutasi Keluar** $\rightarrow$ **Impor Data** $\rightarrow$ **Ekspor Data** $\rightarrow$ **Laporan & Cetak** $\rightarrow$ **Pengaturan Sekolah & Bantuan**.
2. **Pencarian Cepat & Penyaringan Multi-Kriteria**:
   - Pencarian instan berdasarkan NIS, NISN, atau Nama Siswa.
   - Filter dropdown: Kelas/Jurusan, Tahun Ajaran, Status Siswa, Kategori Prestasi, dan Status Mutasi.
3. **Alur Mutasi dengan Sinkronisasi Status Otomatis**:
   - Saat input Mutasi Masuk disetujui $\rightarrow$ Sistem membuat data siswa baru (atau mengaktifkan) dan menetapkan status *Pindah Masuk* / *Aktif*.
   - Saat input Mutasi Keluar diajukan dan disetujui $\rightarrow$ Sistem langsung mengubah status siswa bersangkutan dari *Aktif* menjadi *Pindah Keluar*, menjaga riwayat mutasi permanen tanpa menghapus data master siswa.
4. **Alur Impor Template Excel**:
   - Pilih jenis data $\rightarrow$ Unduh Template contoh $\rightarrow$ Unggah file $\rightarrow$ Modal validasi menampilkan tabel baris hijau (valid) dan merah (galat format/duplikat) $\rightarrow$ Klik "Simpan Data Valid".
5. **Alur Cetak Laporan Resmi**:
   - Pilih jenis laporan (Mutasi Masuk / Mutasi Keluar / Siswa Berprestasi / Beasiswa / Rekap Kesiswaan) $\rightarrow$ Tentukan periode tanggal/bulan/tahun $\rightarrow$ Pratinjau cetak interaktif ber-KOP resmi $\rightarrow$ Klik "Cetak Langsung" (`window.print`) atau "Unduh PDF".

### Visual Identity & Theme
- **Aesthetic Direction**: *Official Institutional Executive* — Antarmuka bersih, teratur, tanpa ornamen berlebih (anti-AI slop), mengedepankan keterbacaan data tabel dan dokumen cetak yang presisi.
- **Color Palette**:
  - *Dominant Canvas (60%)*: Bersih `bg-slate-50` / `bg-white` untuk keterbacaan dokumen.
  - *Structural Surfaces (30%)*: Deep Navy `#1E3A8A` dan `#0F172A` untuk sidebar & header, garis pembatas halus `border-slate-200`.
  - *Accent Budget (10%)*: Blue Kemdikbud `#2563EB`, Gold/Amber `#D97706` untuk highlight prestasi/beasiswa, Emerald `#16A34A` untuk status aktif/disetujui, dan Crimson `#DC2626` untuk mutasi keluar/ditolak.
- **Typography & Tabular Discipline**:
  - Teks umum & navigasi: *Plus Jakarta Sans* / *DM Sans*.
  - Angka, NIS, NISN, Rupiah, dan tanggal: Monospace tabular (`tabular-nums font-mono`).
- **Responsive Layout**:
  - Desktop: Sidebar penuh dengan data grid berdensitas tinggi dan tombol aksi cepat.
  - Mobile & Tablet: Drawer navigasi responsif, kartu ringkasan geser horizontal, dan formulir vertikal yang nyaman diakses lewat ponsel.

---

## 3. Key Product Decisions & Trade-Offs

- **Penyimpanan Data Lokal Berkelanjutan (LocalStorage + Backup JSON/Excel)**:
  - *Pilihan*: State berbasis React dengan sinkronisasi `localStorage` persisten, dilengkapi tombol "Reset Data Sampel" dan "Backup/Restore Database".
  - *Alasan*: Bekerja instan tanpa latensi jaringan, 100% andal di lingkungan sandbox preview AI Studio, serta menjaga privasi data kesiswaan tanpa ketergantungan API pihak ketiga.
- **Validasi Integritas Data & NIS Unik**:
  - *Pilihan*: Validasi ketat di tingkat formulir dan parser impor. NIS duplikat akan dicegah dengan peringatan baris spesifik.
  - *Alasan*: Standar Dapodik/Kemdikbud mengharuskan NIS dan NISN unik sebagai kunci identitas utama peserta didik.
- **Mesin Cetak KOP Surat CSS Print-Ready**:
  - *Pilihan*: Komponen pratinjau cetak khusus dengan CSS `@media print` yang mengisolasi KOP surat resmi, menyembunyikan navigasi web saat dicetak, dan mematuhi ukuran kertas A4/F4 standar kantor sekolah di Indonesia.
- **Generator & Parser Excel/CSV Murni Tanpa Ketergantungan Eksternal Rentan**:
  - *Pilihan*: Pustaka utilitas CSV & spreadsheet terstruktur yang memproduksi file CSV dengan BOM UTF-8 (agar karakter khusus dan format angka tidak rusak saat dibuka di Microsoft Excel versi apa pun di Windows/Mac).

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Aplikasi SIM-Kesiswaan (App.tsx)                      │
│                                                                        │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │   Sidebar Navigasi    │   │         Top Header & Profil          │  │
│  │  - Dashboard Utama    │   │  - Tahun Ajaran Aktif (2026/2027)    │  │
│  │  - Data Induk Siswa   │   │  - Indikator Petugas Kesiswaan       │  │
│  │  - Prestasi Siswa     │   │  - Pencarian Global Cepat            │  │
│  │  - Beasiswa Siswa     │   └──────────────────────────────────────┘  │
│  │  - Mutasi Masuk       │   ┌──────────────────────────────────────┐  │
│  │  - Mutasi Keluar      │   │           Viewport Konten            │  │
│  │  - Menu Impor Data    │   │  [Filter Bar: Kelas, Status, Tahun]  │  │
│  │  - Menu Ekspor Data   │   │  [Tabel Data Grid Berdensitas Tinggi]│  │
│  │  - Laporan & Cetak    │   │  [Modal Form Tambah / Ubah Data]     │  │
│  │  - Pengaturan Sekolah │   │  [Modal Validasi Hasil Impor Excel]  │  │
│  │  - Bantuan Penggunaan │   │  [Area Cetak KOP Surat Resmi (A4/F4)]│  │
│  └───────────────────────┘   └──────────────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │    State Store & Business Logic       │
                 │  - studentsState (NISN unik, status)  │
                 │  - achievementsState (Prestasi)       │
                 │  - scholarshipsState (Beasiswa Rp)    │
                 │  - incomingMutationsState (Masuk)     │
                 │  - outgoingMutationsState (Keluar)    │
                 │  - schoolProfileState (KOP & Kepsek)  │
                 │  - mutationSyncEngine (Auto-status)   │
                 └───────────────────┬───────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │       Layanan Utilitas & Ekspor       │
                 │  - excelTemplateDownloader (5 Berkas) │
                 │  - dataImporterValidator (Baris-demi) │
                 │  - printReportEngine (KOP Surat A4)   │
                 │  - localPersistenceStorage (Simpan)   │
                 └───────────────────────────────────────┘
```

### Entitas Data Utama
1. **Student (Siswa)**: `nis`, `nisn`, `namaLengkap`, `tempatLahir`, `tanggalLahir`, `jenisKelamin`, `kelas`, `jurusan`, `tahunAjaran`, `alamat`, `namaOrangTua`, `telepon`, `status` (*Aktif* | *Pindah Masuk* | *Pindah Keluar* | *Lulus* | *Keluar Sekolah*), `keterangan`.
2. **Achievement (Prestasi)**: `id`, `nis`, `namaSiswa`, `kelas`, `jenisPrestasi` (*Akademik* | *Non-Akademik*), `namaKejuaraan`, `tingkat` (*Sekolah* | *Kecamatan* | *Kabupaten* | *Provinsi* | *Nasional* | *Internasional*), `peringkat`, `tanggalPerolehan`, `penyelenggara`, `keteranganDokumen`.
3. **Scholarship (Beasiswa)**: `id`, `nis`, `namaSiswa`, `kelas`, `namaBeasiswa`, `sumber` (*Pemerintah* | *Swasta* | *Yayasan* | *Sekolah* | *Lainnya*), `jenis` (*Penuh* | *Sebagian* | *Bantuan Biaya*), `periode`, `besaranNilai` (number, format Rp), `status` (*Diajukan* | *Disetujui* | *Ditolak* | *Selesai*), `tanggalMulai`, `tanggalBerakhir`, `keteranganDokumen`.
4. **IncomingMutation (Mutasi Masuk)**: `id`, `nis`, `nisn`, `namaLengkap`, `asalSekolah`, `alamatSekolahAsal`, `nomorSuratPindah`, `tanggalSurat`, `tanggalDiterima`, `kelasTujuan`, `alasanPindah`, `petugasPenerima`, `berkasPendukung`, `status` (*Diterima* | *Dalam Proses* | *Ditolak*), `keterangan`.
5. **OutgoingMutation (Mutasi Keluar)**: `id`, `nis`, `nisn`, `namaLengkap`, `kelasSaatIni`, `tujuanSekolah`, `alamatSekolahTujuan`, `nomorSuratKeluar`, `tanggalPengajuan`, `tanggalKeluar`, `alasanKeluar`, `administrasiPembayaran`, `petugasPenandatangan`, `status` (*Diajukan* | *Disetujui* | *Selesai*), `keterangan`.
6. **SchoolProfile**: `namaSekolah`, `npsn`, `nss`, `statusSekolah`, `alamat`, `kabupatenKota`, `provinsi`, `kodePos`, `telepon`, `email`, `website`, `namaKepalaSekolah`, `nipKepalaSekolah`, `namaPetugasKesiswaan`, `tahunAjaranAktif`, `semesterAktif`.

### 5 Template Siap Unduh
- Template 1: `template_data_utama_siswa.csv`
- Template 2: `template_siswa_berprestasi.csv`
- Template 3: `template_siswa_penerima_beasiswa.csv`
- Template 4: `template_mutasi_masuk.csv`
- Template 5: `template_mutasi_keluar.csv`
Setiap template menyertakan baris header baku, 2 baris contoh pengisian, serta panduan format tanggal (`YYYY-MM-DD` atau `DD/MM/YYYY`) dan format mata uang.

---

## 5. Verification & Testing Plan

1. **Uji Validasi Form & NIS Unik**: Verifikasi bahwa formulir siswa menolak duplikasi NIS dan NISN.
2. **Uji Sinkronisasi Otomatis Mutasi**:
   - Tambah mutasi keluar siswa aktif $\rightarrow$ Ubah status mutasi ke "Disetujui" $\rightarrow$ Pastikan status siswa di tabel utama otomatis berubah menjadi "Pindah Keluar".
   - Tambah mutasi masuk disetujui $\rightarrow$ Pastikan siswa otomatis masuk ke daftar siswa utama dengan status "Pindah Masuk".
3. **Uji 5 Template Impor Data**:
   - Unduh kelima template $\rightarrow$ Masukkan data uji valid dan data galat $\rightarrow$ Verifikasi dialog validasi menampilkan pesan galat yang akurat per baris dan berhasil menyimpan data valid.
4. **Uji Cetak KOP Surat Resmi & Ekspor PDF**:
   - Cetak Laporan Mutasi Masuk (Harian/Bulanan/Tahunan).
   - Cetak Laporan Mutasi Keluar.
   - Periksa tata letak KOP Sekolah, tabel ber-tata letak rapi, serta kolom tanda tangan Kepala Sekolah dan Petugas Tata Usaha.
5. **Uji Kompilasi & Responsivitas**:
   - Jalankan `compile_applet` untuk menjamin tidak ada kesalahan sintaks maupun TypeScript.
