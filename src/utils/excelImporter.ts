import * as XLSX from 'xlsx';
import { 
  Student, 
  Achievement, 
  Scholarship, 
  IncomingMutation, 
  OutgoingMutation,
  ImportSummary,
  ImportValidationRow,
  StudentStatus,
  Gender,
  Agama,
  AchievementType,
  AchievementLevel,
  ScholarshipSource,
  ScholarshipType,
  ScholarshipStatus,
  IncomingMutationStatus,
  OutgoingMutationStatus,
  TracerStudy,
  TracerStudyStatus,
  TracerLinearity
} from '../types/kesiswaan';

/**
 * Parses raw ArrayBuffer or string into rows of objects
 */
export async function parseSpreadsheetFile(file: File): Promise<Record<string, any>[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  // Convert to JSON with raw values
  const jsonRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  return jsonRows;
}

/**
 * Normalizes field key by removing accents, spaces, and punctuation
 */
function normalizeKey(k: string): string {
  return k.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getVal(row: Record<string, any>, possibleKeys: string[]): any {
  const normalizedMap = new Map<string, any>();
  for (const [key, value] of Object.entries(row)) {
    normalizedMap.set(normalizeKey(key), value);
  }
  for (const pk of possibleKeys) {
    const val = normalizedMap.get(normalizeKey(pk));
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      return String(val).trim();
    }
  }
  return '';
}

/**
 * Validates Students import rows
 */
export function validateStudentsImport(
  rawRows: Record<string, any>[],
  existingStudents: Student[]
): ImportSummary<Student> {
  const existingNisSet = new Set(existingStudents.map(s => s.nis.trim()));
  const existingNisnSet = new Set(existingStudents.map(s => s.nisn.trim()));
  const seenNisInBatch = new Set<string>();
  const seenNisnInBatch = new Set<string>();

  const rows: ImportValidationRow<Student>[] = rawRows.map((row, index) => {
    const rowNumber = index + 2; // considering header is row 1
    const errors: string[] = [];

    const nis = getVal(row, ['NIS', 'No Induk', 'Nomor Induk Siswa']);
    const nisn = getVal(row, ['NISN', 'Nomor Induk Siswa Nasional']);
    const namaLengkap = getVal(row, ['Nama Lengkap', 'Nama Siswa', 'Nama']);
    const tempatLahir = getVal(row, ['Tempat Lahir', 'Tempat']);
    const tanggalLahir = getVal(row, ['Tgl Lahir', 'Tanggal Lahir']);
    let jenisKelamin = getVal(row, ['Jenis Kelamin', 'JK', 'Gender']);
    const kelas = getVal(row, ['Kelas', 'Rombel']);
    const jurusan = getVal(row, ['Jurusan', 'Peminatan', 'Program']);
    const tahunAjaran = getVal(row, ['Tahun Ajaran', 'TA', 'Tahun']) || '2026/2027';
    const alamat = getVal(row, ['Alamat', 'Alamat Lengkap', 'Domisili']);
    const namaOrangTua = getVal(row, ['Nama Orang Tua', 'Orang Tua', 'Wali']);
    const noHp = getVal(row, ['No. HP', 'No HP', 'Telepon', 'HP']);
    let status = getVal(row, ['Status', 'Status Siswa']) || 'Aktif';
    const keterangan = getVal(row, ['Keterangan', 'Catatan']);

    // Validations
    if (!nis) {
      errors.push('NIS wajib diisi.');
    } else if (existingNisSet.has(nis)) {
      errors.push(`NIS "${nis}" sudah terdaftar di database utama.`);
    } else if (seenNisInBatch.has(nis)) {
      errors.push(`NIS "${nis}" duplikat di dalam berkas impor.`);
    } else {
      seenNisInBatch.add(nis);
    }

    if (!nisn) {
      errors.push('NISN wajib diisi.');
    } else if (existingNisnSet.has(nisn)) {
      errors.push(`NISN "${nisn}" sudah terdaftar di database utama.`);
    } else if (seenNisnInBatch.has(nisn)) {
      errors.push(`NISN "${nisn}" duplikat di dalam berkas impor.`);
    } else {
      seenNisnInBatch.add(nisn);
    }

    if (!namaLengkap) {
      errors.push('Nama Lengkap wajib diisi.');
    }

    if (!kelas) {
      errors.push('Kelas wajib diisi.');
    }

    // Gender standardization
    const jkLower = jenisKelamin.toLowerCase();
    if (jkLower.startsWith('l') || jkLower === 'pria' || jkLower === 'laki') {
      jenisKelamin = 'Laki-laki';
    } else if (jkLower.startsWith('p') || jkLower === 'wanita' || jkLower === 'perempuan') {
      jenisKelamin = 'Perempuan';
    } else {
      jenisKelamin = 'Laki-laki'; // default fallback
    }

    // Status standardization
    const validStatuses: StudentStatus[] = ['Aktif', 'Pindah Masuk', 'Pindah Keluar', 'Lulus', 'Keluar Sekolah'];
    const matchedStatus = validStatuses.find(s => s.toLowerCase() === status.toLowerCase());
    const finalStatus: StudentStatus = matchedStatus || 'Aktif';

    // Agama parsing
    const rawAgama = getVal(row, ['Agama', 'Kepercayaan', 'Religion']);
    const validAgamaList: Agama[] = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];
    const matchedAgama = validAgamaList.find(a => a.toLowerCase() === rawAgama.toLowerCase());
    const finalAgama: Agama = matchedAgama || 'Islam';

    const studentData: Partial<Student> = {
      id: `std-imp-${Date.now()}-${index}`,
      nis,
      nisn,
      namaLengkap,
      tempatLahir: tempatLahir || 'Indonesia',
      tanggalLahir: tanggalLahir || '2008-01-01',
      jenisKelamin: jenisKelamin as Gender,
      agama: finalAgama,
      kelas,
      jurusan: jurusan || 'Umum',
      tahunAjaran,
      alamat: alamat || '-',
      namaOrangTua: namaOrangTua || '-',
      noHp: noHp || '-',
      status: finalStatus,
      keterangan: keterangan || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      rowNumber,
      data: studentData,
      isValid: errors.length === 0,
      errors,
    };
  });

  const validCount = rows.filter(r => r.isValid).length;
  return {
    templateType: 'students',
    totalRows: rows.length,
    validRows: validCount,
    invalidRows: rows.length - validCount,
    rows,
  };
}

/**
 * Validates Achievements import rows
 */
export function validateAchievementsImport(
  rawRows: Record<string, any>[],
  existingStudents: Student[]
): ImportSummary<Achievement> {
  const studentMap = new Map(existingStudents.map(s => [s.nis.trim(), s]));

  const rows: ImportValidationRow<Achievement>[] = rawRows.map((row, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];

    const nis = getVal(row, ['NIS', 'No Induk']);
    let nama = getVal(row, ['Nama', 'Nama Siswa', 'Nama Lengkap']);
    let kelas = getVal(row, ['Kelas']);
    let jenisPrestasi = getVal(row, ['Jenis Prestasi', 'Jenis']);
    const namaKegiatan = getVal(row, ['Nama Kegiatan', 'Nama Kejuaraan', 'Kejuaraan']);
    let tingkat = getVal(row, ['Tingkat', 'Level']);
    const peringkat = getVal(row, ['Peringkat', 'Juara']);
    const tglPerolehan = getVal(row, ['Tgl Perolehan', 'Tanggal Perolehan', 'Tanggal']);
    const penyelenggara = getVal(row, ['Penyelenggara']);
    const keterangan = getVal(row, ['Keterangan', 'Dokumen Pendukung']);

    if (!nis) {
      errors.push('NIS wajib diisi.');
    } else {
      const matched = studentMap.get(nis);
      if (!matched) {
        errors.push(`NIS "${nis}" belum terdaftar di Data Utama Siswa.`);
      } else {
        if (!nama) nama = matched.namaLengkap;
        if (!kelas) kelas = matched.kelas;
      }
    }

    if (!namaKegiatan) errors.push('Nama Kegiatan / Kejuaraan wajib diisi.');
    if (!peringkat) errors.push('Peringkat / Juara wajib diisi.');

    // Jenis Prestasi
    if (jenisPrestasi.toLowerCase().includes('non')) {
      jenisPrestasi = 'Non-Akademik';
    } else {
      jenisPrestasi = 'Akademik';
    }

    // Tingkat
    const levels: AchievementLevel[] = ['Sekolah', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional'];
    const matchedLevel = levels.find(l => l.toLowerCase() === tingkat.toLowerCase()) || 'Kabupaten';

    const achievementData: Partial<Achievement> = {
      id: `ach-imp-${Date.now()}-${index}`,
      nis,
      namaSiswa: nama || 'Siswa',
      kelas: kelas || '-',
      jenisPrestasi: jenisPrestasi as AchievementType,
      namaKejuaraan: namaKegiatan,
      tingkat: matchedLevel,
      peringkat: peringkat || 'Juara',
      tanggalPerolehan: tglPerolehan || new Date().toISOString().split('T')[0],
      penyelenggara: penyelenggara || 'Kementerian Pendidikan',
      keteranganDokumen: keterangan || '',
    };

    return {
      rowNumber,
      data: achievementData,
      isValid: errors.length === 0,
      errors,
    };
  });

  const validCount = rows.filter(r => r.isValid).length;
  return {
    templateType: 'achievements',
    totalRows: rows.length,
    validRows: validCount,
    invalidRows: rows.length - validCount,
    rows,
  };
}

/**
 * Validates Scholarships import rows
 */
export function validateScholarshipsImport(
  rawRows: Record<string, any>[],
  existingStudents: Student[]
): ImportSummary<Scholarship> {
  const studentMap = new Map(existingStudents.map(s => [s.nis.trim(), s]));

  const rows: ImportValidationRow<Scholarship>[] = rawRows.map((row, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];

    const nis = getVal(row, ['NIS', 'No Induk']);
    let nama = getVal(row, ['Nama', 'Nama Siswa']);
    let kelas = getVal(row, ['Kelas']);
    const namaBeasiswa = getVal(row, ['Nama Beasiswa', 'Beasiswa']);
    let sumber = getVal(row, ['Sumber']);
    let jenis = getVal(row, ['Jenis']);
    const periode = getVal(row, ['Periode']);
    const rawBesaran = getVal(row, ['Besaran (Rp)', 'Besaran', 'Nilai (Rp)', 'Nilai']);
    let status = getVal(row, ['Status']);
    const tglMulai = getVal(row, ['Tgl Mulai', 'Tanggal Mulai']);
    const tglSelesai = getVal(row, ['Tgl Selesai', 'Tanggal Selesai']);
    const keterangan = getVal(row, ['Keterangan', 'Dokumen']);

    if (!nis) {
      errors.push('NIS wajib diisi.');
    } else {
      const matched = studentMap.get(nis);
      if (!matched) {
        errors.push(`NIS "${nis}" belum terdaftar di Data Utama Siswa.`);
      } else {
        if (!nama) nama = matched.namaLengkap;
        if (!kelas) kelas = matched.kelas;
      }
    }

    if (!namaBeasiswa) errors.push('Nama Beasiswa wajib diisi.');

    // Clean numeric besaran
    const besaranNum = Number(String(rawBesaran).replace(/[^0-9]/g, '')) || 0;
    if (besaranNum <= 0) {
      errors.push('Besaran (Rp) harus bernilai angka lebih dari 0.');
    }

    const sources: ScholarshipSource[] = ['Pemerintah', 'Swasta', 'Yayasan', 'Sekolah', 'Lainnya'];
    const matchedSource = sources.find(s => s.toLowerCase() === sumber.toLowerCase()) || 'Pemerintah';

    const types: ScholarshipType[] = ['Penuh', 'Sebagian', 'Bantuan Biaya'];
    const matchedType = types.find(t => t.toLowerCase() === jenis.toLowerCase()) || 'Bantuan Biaya';

    const statuses: ScholarshipStatus[] = ['Diajukan', 'Disetujui', 'Ditolak', 'Selesai'];
    const matchedStatus = statuses.find(s => s.toLowerCase() === status.toLowerCase()) || 'Disetujui';

    const scholarshipData: Partial<Scholarship> = {
      id: `sch-imp-${Date.now()}-${index}`,
      nis,
      namaSiswa: nama || 'Siswa',
      kelas: kelas || '-',
      namaBeasiswa,
      sumber: matchedSource,
      jenis: matchedType,
      periode: periode || '2026/2027',
      besaranNilai: besaranNum,
      status: matchedStatus,
      tanggalMulai: tglMulai || '2026-07-01',
      tanggalBerakhir: tglSelesai || '2027-06-30',
      keteranganDokumen: keterangan || '',
    };

    return {
      rowNumber,
      data: scholarshipData,
      isValid: errors.length === 0,
      errors,
    };
  });

  const validCount = rows.filter(r => r.isValid).length;
  return {
    templateType: 'scholarships',
    totalRows: rows.length,
    validRows: validCount,
    invalidRows: rows.length - validCount,
    rows,
  };
}

/**
 * Validates Incoming Mutations import rows
 */
export function validateIncomingImport(
  rawRows: Record<string, any>[]
): ImportSummary<IncomingMutation> {
  const rows: ImportValidationRow<IncomingMutation>[] = rawRows.map((row, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];

    const nis = getVal(row, ['NIS', 'No Induk']);
    const nisn = getVal(row, ['NISN']);
    const namaLengkap = getVal(row, ['Nama Lengkap', 'Nama Siswa']);
    const asalSekolah = getVal(row, ['Asal Sekolah', 'Sekolah Asal']);
    const noSuratMasuk = getVal(row, ['No. Surat Masuk', 'No Surat Masuk', 'Nomor Surat Pindah']);
    const tglSurat = getVal(row, ['Tgl Surat', 'Tanggal Surat']);
    const tglDiterima = getVal(row, ['Tgl Diterima', 'Tanggal Diterima']);
    const kelasTujuan = getVal(row, ['Kelas Tujuan', 'Kelas']);
    const alasan = getVal(row, ['Alasan', 'Alasan Pindah']);
    const petugas = getVal(row, ['Petugas', 'Petugas Penerima']);
    let status = getVal(row, ['Status']);
    const keterangan = getVal(row, ['Keterangan', 'Berkas']);

    if (!nis) errors.push('NIS wajib diisi.');
    if (!namaLengkap) errors.push('Nama Lengkap wajib diisi.');
    if (!asalSekolah) errors.push('Asal Sekolah wajib diisi.');
    if (!kelasTujuan) errors.push('Kelas Tujuan wajib diisi.');

    const validStatuses: IncomingMutationStatus[] = ['Diterima', 'Dalam Proses', 'Ditolak'];
    const matchedStatus = validStatuses.find(s => s.toLowerCase() === status.toLowerCase()) || 'Diterima';

    const mutationData: Partial<IncomingMutation> = {
      id: `mut-in-imp-${Date.now()}-${index}`,
      nis,
      nisn: nisn || '-',
      namaLengkap,
      asalSekolah,
      alamatSekolahAsal: '-',
      nomorSuratPindah: noSuratMasuk || '421.3/SPM/2026',
      tanggalSurat: tglSurat || new Date().toISOString().split('T')[0],
      tanggalDiterima: tglDiterima || new Date().toISOString().split('T')[0],
      kelasTujuan,
      alasanPindah: alasan || 'Pindah domisili orang tua',
      petugasPenerima: petugas || 'Petugas Kesiswaan',
      berkasPendukung: 'Surat Pindah Asal, Rapor Terakhir',
      status: matchedStatus,
      keterangan: keterangan || '',
    };

    return {
      rowNumber,
      data: mutationData,
      isValid: errors.length === 0,
      errors,
    };
  });

  const validCount = rows.filter(r => r.isValid).length;
  return {
    templateType: 'incoming',
    totalRows: rows.length,
    validRows: validCount,
    invalidRows: rows.length - validCount,
    rows,
  };
}

/**
 * Validates Outgoing Mutations import rows
 */
export function validateOutgoingImport(
  rawRows: Record<string, any>[],
  existingStudents: Student[]
): ImportSummary<OutgoingMutation> {
  const studentMap = new Map(existingStudents.map(s => [s.nis.trim(), s]));

  const rows: ImportValidationRow<OutgoingMutation>[] = rawRows.map((row, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];

    const nis = getVal(row, ['NIS', 'No Induk']);
    let nisn = getVal(row, ['NISN']);
    let namaLengkap = getVal(row, ['Nama Lengkap', 'Nama Siswa']);
    let kelasAsal = getVal(row, ['Kelas Asal', 'Kelas']);
    const tujuanSekolah = getVal(row, ['Tujuan Sekolah', 'Sekolah Tujuan']);
    const noSuratKeluar = getVal(row, ['No. Surat Keluar', 'No Surat Keluar']);
    const tglAjuan = getVal(row, ['Tgl Ajuan', 'Tanggal Ajuan']);
    const tglKeluar = getVal(row, ['Tgl Keluar', 'Tanggal Keluar']);
    const alasan = getVal(row, ['Alasan', 'Alasan Keluar']);
    const administrasi = getVal(row, ['Administrasi', 'Keterangan Administrasi']);
    const petugas = getVal(row, ['Petugas']);
    let status = getVal(row, ['Status']);
    const keterangan = getVal(row, ['Keterangan']);

    if (!nis) {
      errors.push('NIS wajib diisi.');
    } else {
      const matched = studentMap.get(nis);
      if (matched) {
        if (!namaLengkap) namaLengkap = matched.namaLengkap;
        if (!nisn) nisn = matched.nisn;
        if (!kelasAsal) kelasAsal = matched.kelas;
      }
    }

    if (!tujuanSekolah) errors.push('Tujuan Sekolah wajib diisi.');
    if (!alasan) errors.push('Alasan Pindah/Keluar wajib diisi.');

    const validStatuses: OutgoingMutationStatus[] = ['Diajukan', 'Disetujui', 'Selesai'];
    const matchedStatus = validStatuses.find(s => s.toLowerCase() === status.toLowerCase()) || 'Disetujui';

    const mutationData: Partial<OutgoingMutation> = {
      id: `mut-out-imp-${Date.now()}-${index}`,
      nis,
      nisn: nisn || '-',
      namaLengkap: namaLengkap || 'Siswa',
      kelasSaatIni: kelasAsal || '-',
      tujuanSekolah,
      alamatSekolahTujuan: '-',
      nomorSuratKeluar: noSuratKeluar || '421.3/SKP/2026',
      tanggalPengajuan: tglAjuan || new Date().toISOString().split('T')[0],
      tanggalKeluar: tglKeluar || new Date().toISOString().split('T')[0],
      alasanKeluar: alasan,
      administrasiPembayaran: administrasi || 'Lengkap & Bebas Tanggungan',
      petugasPenandatangan: petugas || 'Kepala Sekolah',
      status: matchedStatus,
      keterangan: keterangan || '',
    };

    return {
      rowNumber,
      data: mutationData,
      isValid: errors.length === 0,
      errors,
    };
  });

  const validCount = rows.filter(r => r.isValid).length;
  return {
    templateType: 'outgoing',
    totalRows: rows.length,
    validRows: validCount,
    invalidRows: rows.length - validCount,
    rows,
  };
}

/**
 * Validates Tracer Study import rows
 */
export function validateTracerImport(
  rawRows: Record<string, any>[]
): ImportSummary<TracerStudy> {
  const rows: ImportValidationRow<TracerStudy>[] = rawRows.map((row, index) => {
    const rowNumber = index + 2;
    const errors: string[] = [];

    const nis = getVal(row, ['NIS', 'No Induk']);
    const nisn = getVal(row, ['NISN']);
    const namaLengkap = getVal(row, ['Nama Lengkap', 'Nama Siswa', 'Nama Alumni']);
    const tahunLulus = getVal(row, ['Tahun Lulus', 'Angkatan', 'Lulusan']) || new Date().getFullYear().toString();
    const jurusanAsal = getVal(row, ['Jurusan Asal', 'Jurusan']) || 'MIPA';
    let statusTracer = getVal(row, ['Status Tracer', 'Status', 'Status BMW']) || 'Kuliah';
    const namaInstansiKampus = getVal(row, ['Nama Kampus / Perusahaan / Usaha', 'Kampus/Perusahaan', 'Instansi']);
    const prodiPosisi = getVal(row, ['Prodi / Posisi Jabatan', 'Prodi', 'Jabatan', 'Posisi']);
    let keselarasan = getVal(row, ['Keselarasan Jurusan', 'Keselarasan', 'Linearitas']) || 'Linear';
    const rentangGaji = getVal(row, ['Rentang Penghasilan', 'Gaji', 'Omset']);
    const noHpWa = getVal(row, ['No. WhatsApp', 'No HP', 'WhatsApp', 'No. HP']);
    const email = getVal(row, ['Email']);
    const alamat = getVal(row, ['Alamat Domisili', 'Alamat', 'Domisili']);
    const keterangan = getVal(row, ['Keterangan', 'Catatan']);

    if (!nis) errors.push('NIS wajib diisi.');
    if (!namaLengkap) errors.push('Nama Lengkap Alumni wajib diisi.');
    if (!namaInstansiKampus) errors.push('Nama Perguruan Tinggi / Perusahaan / Usaha wajib diisi.');

    // Status standardization
    const statuses: TracerStudyStatus[] = ['Bekerja', 'Kuliah', 'Wirausaha', 'Bekerja & Kuliah', 'Mencari Kerja'];
    const matchedStatus = statuses.find(s => s.toLowerCase() === statusTracer.toLowerCase()) || 'Kuliah';

    // Linearitas
    const linearities: TracerLinearity[] = ['Linear', 'Tidak Linear', 'Belum Relevan'];
    const matchedLinearity = linearities.find(l => l.toLowerCase() === keselarasan.toLowerCase()) || 'Linear';

    const tracerData: Partial<TracerStudy> = {
      id: `trc-imp-${Date.now()}-${index}`,
      nis,
      nisn: nisn || '-',
      namaLengkap,
      tahunLulus,
      jurusanAsal,
      statusTracer: matchedStatus,
      namaInstansiKampus,
      bidangPekerjaanStudi: prodiPosisi || '-',
      keselarasanJurusan: matchedLinearity,
      rentangPendapatan: rentangGaji || '-',
      noHpWa: noHpWa || '-',
      email: email || '-',
      alamatDomisili: alamat || '-',
      tanggalUpdate: new Date().toISOString().split('T')[0],
      keterangan: keterangan || '',
    };

    return {
      rowNumber,
      data: tracerData,
      isValid: errors.length === 0,
      errors,
    };
  });

  const validCount = rows.filter(r => r.isValid).length;
  return {
    templateType: 'tracer',
    totalRows: rows.length,
    validRows: validCount,
    invalidRows: rows.length - validCount,
    rows,
  };
}
