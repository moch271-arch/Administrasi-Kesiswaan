import React, { useState } from 'react';
import { 
  BookOpen, 
  FileSpreadsheet, 
  UploadCloud, 
  DownloadCloud, 
  Printer, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const HelpView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'template' | 'import' | 'mutasi' | 'cetak'>('template');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Panduan Lengkap Operasional SIM-Kesiswaan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tata cara pengisian 5 template Excel, impor data, ekspor rekapitulasi, pengelolaan mutasi, dan pencetakan dokumen resmi
            </p>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="mt-4 flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('template')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'template' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            1. Panduan Mengisi 5 Templat
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'import' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            2. Prosedur Impor & Ekspor Data
          </button>
          <button
            onClick={() => setActiveTab('mutasi')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'mutasi' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            3. SOP Mutasi Masuk & Keluar
          </button>
          <button
            onClick={() => setActiveTab('cetak')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'cetak' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            4. Panduan Cetak KOP Surat Resmi
          </button>
        </div>
      </div>

      {/* Tab 1: Panduan 5 Template */}
      {activeTab === 'template' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Ketentuan Penulisan 5 Templat Resmi Excel</span>
            </h3>

            <div className="space-y-4">
              {/* Template 1 */}
              <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-blue-900">
                  TEMPLATE 1: DATA UTAMA SISWA (14 Kolom)
                </h4>
                <p className="text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                  NIS | NISN | Nama Lengkap | Tempat Lahir | Tgl Lahir | Jenis Kelamin | Kelas | Jurusan | Tahun Ajaran | Alamat | Nama Orang Tua | No. HP | Status | Keterangan
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>NIS & NISN:</strong> Wajib diisi angka unik, tidak boleh ada nomor duplikat dalam satu sekolah.</li>
                  <li><strong>Tgl Lahir:</strong> Gunakan format baku ISO <code>YYYY-MM-DD</code> (contoh: <code>2008-05-14</code>).</li>
                  <li><strong>Jenis Kelamin:</strong> Tulis <code>Laki-laki</code> atau <code>Perempuan</code> (singkatan L/P juga dikenali otomatis).</li>
                  <li><strong>Status:</strong> <code>Aktif</code>, <code>Pindah Masuk</code>, <code>Pindah Keluar</code>, <code>Lulus</code>, atau <code>Keluar Sekolah</code>.</li>
                </ul>
              </div>

              {/* Template 2 */}
              <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-purple-900">
                  TEMPLATE 2: SISWA BERPRESTASI (10 Kolom)
                </h4>
                <p className="text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                  NIS | Nama | Kelas | Jenis Prestasi | Nama Kegiatan | Tingkat | Peringkat | Tgl Perolehan | Penyelenggara | Keterangan
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>NIS:</strong> Harus cocok dengan NIS siswa yang sudah terdaftar di Data Pokok.</li>
                  <li><strong>Jenis Prestasi:</strong> Pilih <code>Akademik</code> atau <code>Non-Akademik</code>.</li>
                  <li><strong>Tingkat:</strong> <code>Sekolah</code>, <code>Kecamatan</code>, <code>Kabupaten</code>, <code>Provinsi</code>, <code>Nasional</code>, atau <code>Internasional</code>.</li>
                </ul>
              </div>

              {/* Template 3 */}
              <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-emerald-900">
                  TEMPLATE 3: SISWA PENERIMA BEASISWA (12 Kolom)
                </h4>
                <p className="text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                  NIS | Nama | Kelas | Nama Beasiswa | Sumber | Jenis | Periode | Besaran (Rp) | Status | Tgl Mulai | Tgl Selesai | Keterangan
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Besaran (Rp):</strong> Masukkan angka murni tanpa tanda titik atau lambang Rp (contoh: <code>1800000</code>). Sistem otomatis memformat ke mata uang Rupiah.</li>
                  <li><strong>Sumber:</strong> <code>Pemerintah</code>, <code>Swasta</code>, <code>Yayasan</code>, <code>Sekolah</code>, atau <code>Lainnya</code>.</li>
                  <li><strong>Status:</strong> <code>Diajukan</code>, <code>Disetujui</code>, <code>Ditolak</code>, atau <code>Selesai</code>.</li>
                </ul>
              </div>

              {/* Template 4 */}
              <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-emerald-900">
                  TEMPLATE 4: MUTASI MASUK (12 Kolom)
                </h4>
                <p className="text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                  NIS | NISN | Nama Lengkap | Asal Sekolah | No. Surat Masuk | Tgl Surat | Tgl Diterima | Kelas Tujuan | Alasan | Petugas | Status | Keterangan
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Status:</strong> <code>Diterima</code>, <code>Dalam Proses</code>, atau <code>Ditolak</code>.</li>
                  <li>Siswa yang berstatus "Diterima" otomatis terdaftar ke Data Pokok sebagai siswa <strong>Pindah Masuk</strong>.</li>
                </ul>
              </div>

              {/* Template 5 */}
              <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-amber-900">
                  TEMPLATE 5: MUTASI KELUAR (13 Kolom)
                </h4>
                <p className="text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                  NIS | NISN | Nama Lengkap | Kelas Asal | Tujuan Sekolah | No. Surat Keluar | Tgl Ajuan | Tgl Keluar | Alasan | Administrasi | Petugas | Status | Keterangan
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Administrasi:</strong> Keterangan bebas tanggungan SPP/buku perpustakaan sekolah.</li>
                  <li><strong>Status:</strong> <code>Diajukan</code>, <code>Disetujui</code>, atau <code>Selesai</code>.</li>
                  <li>Setelah berstatus Disetujui/Selesai, status siswa di Data Pokok otomatis berubah menjadi <strong>Pindah Keluar</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prosedur Impor & Ekspor */}
      {activeTab === 'import' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-blue-600" />
            <span>Alur Kerja Impor Data Excel & Penanganan Galat</span>
          </h3>

          <div className="space-y-3 text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">1. Unduh Berkas Templat</strong>
              Buka menu <em>Impor Data Excel</em>, pilih kategori yang diinginkan, lalu klik tombol <code>.XLSX</code> atau <code>.CSV</code>.
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">2. Pengisian Data di Excel</strong>
              Buka berkas di Microsoft Excel, LibreOffice, atau Google Sheets. Jangan mengubah susunan urutan kolom header baris pertama. Hapus baris contoh sebelum mengisi data sekolah Anda.
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">3. Unggah Berkas & Validasi Baris-demi-Baris</strong>
              Tarik atau pilih berkas hasil pengisian ke kotak unggah. Sistem secara otomatis menjalankan pemeriksaan keamanan:
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-500">
                <li>Memeriksa kolom wajib terisi (NIS, NISN, Nama, dsb).</li>
                <li>Mendeteksi NIS ganda di dalam berkas impor maupun di database utama.</li>
                <li>Memvalidasi format tanggal dan angka besaran bantuan.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">4. Tinjau Ringkasan & Simpan Data</strong>
              Tabel validasi akan memilah data yang lolos (warna hijau) dan baris bermasalah (warna merah beserta rincian kesalahannya). Klik <strong>"Simpan Data Valid"</strong> untuk memasukkan baris yang sudah benar ke sistem.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SOP Mutasi */}
      {activeTab === 'mutasi' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
            <span>SOP Standar Pengelolaan Mutasi Masuk & Keluar</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                <ArrowDownLeft className="h-4 w-4 text-emerald-700" />
                <span>SOP Mutasi Masuk (Siswa Pindahan)</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>Petugas menerima berkas permohonan pindah (Surat Rekomendasi Dinas, Surat Pindah Asal, Buku Rapor).</li>
                <li>Input formulir mutasi masuk dengan status <em>"Dalam Proses"</em>.</li>
                <li>Setelah divalidasi daya tampung kelas oleh Kepala Sekolah, ubah status menjadi <em>"Diterima"</em>.</li>
                <li>Sistem secara otomatis menambahkan biodata siswa ke <strong>Data Utama Siswa</strong> dengan status <strong>"Pindah Masuk"</strong>.</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4 text-amber-700" />
                <span>SOP Mutasi Keluar</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>Orang tua siswa menyerahkan surat permohonan mutasi ke sekolah tujuan.</li>
                <li>Petugas memeriksa kelengkapan administrasi (bebas SPP & tanggungan pinjaman perpustakaan).</li>
                <li>Input mutasi keluar dengan mengisi sekolah tujuan dan nomor surat keluar dinas.</li>
                <li>Saat status disetujui, status siswa di Buku Induk berubah menjadi <strong>"Pindah Keluar"</strong>. Data riwayat siswa tersimpan permanen dan tidak terhapus.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Panduan Cetak */}
      {activeTab === 'cetak' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Printer className="h-4 w-4 text-blue-700" />
            <span>Tata Cara Cetak Dokumen Resmi & Pengaturan PDF</span>
          </h3>

          <div className="space-y-3 text-slate-600">
            <p>
              Modul <strong>Laporan & Cetak</strong> telah dioptimalkan dengan CSS media print berstandar dinas pendidikan:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded border border-slate-200 p-3 bg-slate-50">
                <span className="font-bold text-slate-800 block mb-1">Setelan Kertas Printer:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Ukuran Kertas: <strong>A4</strong> atau <strong>F4 / Folio</strong></li>
                  <li>Orientasi: <strong>Potrait</strong> (atau Landscape untuk tabel berkolom banyak)</li>
                  <li>Margin: <strong>Default</strong> atau <strong>Minimum</strong></li>
                </ul>
              </div>

              <div className="rounded border border-slate-200 p-3 bg-slate-50">
                <span className="font-bold text-slate-800 block mb-1">Menyimpan ke File PDF:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Pada jendela dialog printer browser, ubah pilihan Destination menjadi <strong>"Save as PDF"</strong> / <strong>"Simpan sebagai PDF"</strong>.</li>
                  <li>Centang opsi <em>"Background graphics"</em> jika ingin arsip KOP surat berwarna tercetak tajam.</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
              <strong>Tips Tambahan:</strong> Navigasi bilah samping (sidebar) dan tombol-tombol antarmuka secara otomatis disembunyikan saat mencetak, sehingga lembar kerja yang keluar adalah lembaran dinas resmi siap tanda tangan dan stempel.
            </div>
          </div>
        </div>
      )}

      {/* Footer Attribution */}
      <div className="text-center text-xs text-slate-500 py-3 border-t border-slate-200">
        SIM-Kesiswaan Sekolah Indonesia · <strong className="text-slate-800">CREATED BY MOCH. ANGGA KURNIAWAN, AMd Kom</strong>
      </div>
    </div>
  );
};
