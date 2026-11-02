import * as XLSX from 'xlsx';
import { 
  Student, 
  Achievement, 
  Scholarship, 
  IncomingMutation, 
  OutgoingMutation,
  TracerStudy 
} from '../types/kesiswaan';

/**
 * Universal Excel exporter using xlsx
 */
export function exportToExcel(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const data = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Auto-fit column widths
  const colWidths = headers.map((header, colIdx) => {
    let max = header.length;
    rows.forEach(row => {
      const cellVal = row[colIdx] != null ? String(row[colIdx]) : '';
      if (cellVal.length > max) max = cellVal.length;
    });
    return { wch: Math.min(Math.max(max + 3, 10), 45) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Universal CSV exporter with UTF-8 BOM
 */
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const escapeCell = (val: string | number) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headerRow = headers.map(escapeCell).join(',');
  const rowLines = rows.map(r => r.map(escapeCell).join(','));
  const csvContent = '\uFEFF' + [headerRow, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Specialized Exporters

export function exportStudents(students: Student[], format: 'xlsx' | 'csv' = 'xlsx') {
  const headers = [
    'NIS', 'NISN', 'Nama Lengkap', 'Tempat Lahir', 'Tgl Lahir', 'Jenis Kelamin', 'Agama',
    'Kelas', 'Jurusan', 'Tahun Ajaran', 'Alamat', 'Nama Orang Tua', 'No. HP', 'Status', 'Keterangan'
  ];
  const rows = students.map(s => [
    s.nis,
    s.nisn,
    s.namaLengkap,
    s.tempatLahir,
    s.tanggalLahir,
    s.jenisKelamin,
    s.agama || 'Islam',
    s.kelas,
    s.jurusan,
    s.tahunAjaran,
    s.alamat,
    s.namaOrangTua,
    s.noHp,
    s.status,
    s.keterangan || ''
  ]);

  const filename = `data_siswa_${new Date().toISOString().split('T')[0]}`;
  if (format === 'xlsx') {
    exportToExcel(filename, 'Data_Siswa', headers, rows);
  } else {
    exportToCSV(filename, headers, rows);
  }
}

export function exportAchievements(achievements: Achievement[], format: 'xlsx' | 'csv' = 'xlsx') {
  const headers = [
    'NIS', 'Nama Siswa', 'Kelas', 'Jenis Prestasi', 'Nama Kejuaraan/Kegiatan',
    'Tingkat', 'Peringkat', 'Tgl Perolehan', 'Penyelenggara', 'Keterangan Dokumen'
  ];
  const rows = achievements.map(a => [
    a.nis,
    a.namaSiswa,
    a.kelas,
    a.jenisPrestasi,
    a.namaKejuaraan,
    a.tingkat,
    a.peringkat,
    a.tanggalPerolehan,
    a.penyelenggara,
    a.keteranganDokumen || ''
  ]);

  const filename = `siswa_berprestasi_${new Date().toISOString().split('T')[0]}`;
  if (format === 'xlsx') {
    exportToExcel(filename, 'Siswa_Berprestasi', headers, rows);
  } else {
    exportToCSV(filename, headers, rows);
  }
}

export function exportScholarships(scholarships: Scholarship[], format: 'xlsx' | 'csv' = 'xlsx') {
  const headers = [
    'NIS', 'Nama Siswa', 'Kelas', 'Nama Beasiswa', 'Sumber', 'Jenis',
    'Periode', 'Besaran Nilai (Rp)', 'Status', 'Tgl Mulai', 'Tgl Berakhir', 'Keterangan'
  ];
  const rows = scholarships.map(s => [
    s.nis,
    s.namaSiswa,
    s.kelas,
    s.namaBeasiswa,
    s.sumber,
    s.jenis,
    s.periode,
    s.besaranNilai,
    s.status,
    s.tanggalMulai,
    s.tanggalBerakhir,
    s.keteranganDokumen || ''
  ]);

  const filename = `siswa_penerima_beasiswa_${new Date().toISOString().split('T')[0]}`;
  if (format === 'xlsx') {
    exportToExcel(filename, 'Penerima_Beasiswa', headers, rows);
  } else {
    exportToCSV(filename, headers, rows);
  }
}

export function exportIncomingMutations(mutations: IncomingMutation[], format: 'xlsx' | 'csv' = 'xlsx') {
  const headers = [
    'NIS', 'NISN', 'Nama Lengkap', 'Asal Sekolah', 'Alamat Asal',
    'No. Surat Masuk', 'Tgl Surat', 'Tgl Diterima', 'Kelas Tujuan',
    'Alasan Pindah', 'Petugas Penerima', 'Berkas', 'Status', 'Keterangan'
  ];
  const rows = mutations.map(m => [
    m.nis,
    m.nisn,
    m.namaLengkap,
    m.asalSekolah,
    m.alamatSekolahAsal,
    m.nomorSuratPindah,
    m.tanggalSurat,
    m.tanggalDiterima,
    m.kelasTujuan,
    m.alasanPindah,
    m.petugasPenerima,
    m.berkasPendukung,
    m.status,
    m.keterangan || ''
  ]);

  const filename = `daftar_mutasi_masuk_${new Date().toISOString().split('T')[0]}`;
  if (format === 'xlsx') {
    exportToExcel(filename, 'Mutasi_Masuk', headers, rows);
  } else {
    exportToCSV(filename, headers, rows);
  }
}

export function exportOutgoingMutations(mutations: OutgoingMutation[], format: 'xlsx' | 'csv' = 'xlsx') {
  const headers = [
    'NIS', 'NISN', 'Nama Lengkap', 'Kelas Asal', 'Tujuan Sekolah',
    'Alamat Tujuan', 'No. Surat Keluar', 'Tgl Ajuan', 'Tgl Keluar',
    'Alasan Keluar', 'Administrasi', 'Petugas', 'Status', 'Keterangan'
  ];
  const rows = mutations.map(m => [
    m.nis,
    m.nisn,
    m.namaLengkap,
    m.kelasSaatIni,
    m.tujuanSekolah,
    m.alamatSekolahTujuan,
    m.nomorSuratKeluar,
    m.tanggalPengajuan,
    m.tanggalKeluar,
    m.alasanKeluar,
    m.administrasiPembayaran,
    m.petugasPenandatangan,
    m.status,
    m.keterangan || ''
  ]);

  const filename = `daftar_mutasi_keluar_${new Date().toISOString().split('T')[0]}`;
  if (format === 'xlsx') {
    exportToExcel(filename, 'Mutasi_Keluar', headers, rows);
  } else {
    exportToCSV(filename, headers, rows);
  }
}

export function exportTracerStudy(tracerList: TracerStudy[], format: 'xlsx' | 'csv' = 'xlsx') {
  const headers = [
    'NIS', 'NISN', 'Nama Lengkap', 'Tahun Lulus', 'Jurusan Asal',
    'Status Tracer (BMW)', 'Instansi / Kampus / Usaha', 'Prodi / Posisi',
    'Keselarasan Jurusan', 'Rentang Pendapatan', 'No. WhatsApp', 'Email',
    'Alamat Domisili', 'Tgl Update', 'Keterangan'
  ];
  const rows = tracerList.map(t => [
    t.nis,
    t.nisn,
    t.namaLengkap,
    t.tahunLulus,
    t.jurusanAsal,
    t.statusTracer,
    t.namaInstansiKampus,
    t.bidangPekerjaanStudi,
    t.keselarasanJurusan,
    t.rentangPendapatan || '-',
    t.noHpWa,
    t.email,
    t.alamatDomisili,
    t.tanggalUpdate,
    t.keterangan || ''
  ]);

  const filename = `tracer_study_alumni_${new Date().toISOString().split('T')[0]}`;
  if (format === 'xlsx') {
    exportToExcel(filename, 'Tracer_Study', headers, rows);
  } else {
    exportToCSV(filename, headers, rows);
  }
}
