export type StudentStatus = 'Aktif' | 'Pindah Masuk' | 'Pindah Keluar' | 'Lulus' | 'Keluar Sekolah';
export type Gender = 'Laki-laki' | 'Perempuan';
export type Agama = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu' | 'Lainnya';

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: Gender;
  agama?: Agama;
  kelas: string;
  jurusan: string;
  tahunAjaran: string;
  alamat: string;
  namaOrangTua: string;
  noHp: string;
  status: StudentStatus;
  keterangan?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AchievementType = 'Akademik' | 'Non-Akademik';
export type AchievementLevel = 'Sekolah' | 'Kecamatan' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';

export interface Achievement {
  id: string;
  nis: string;
  namaSiswa: string;
  kelas: string;
  jenisPrestasi: AchievementType;
  namaKejuaraan: string;
  tingkat: AchievementLevel;
  peringkat: string;
  tanggalPerolehan: string;
  penyelenggara: string;
  keteranganDokumen?: string;
}

export type ScholarshipSource = 'Pemerintah' | 'Swasta' | 'Yayasan' | 'Sekolah' | 'Lainnya';
export type ScholarshipType = 'Penuh' | 'Sebagian' | 'Bantuan Biaya';
export type ScholarshipStatus = 'Diajukan' | 'Disetujui' | 'Ditolak' | 'Selesai';

export interface Scholarship {
  id: string;
  nis: string;
  namaSiswa: string;
  kelas: string;
  namaBeasiswa: string;
  sumber: ScholarshipSource;
  jenis: ScholarshipType;
  periode: string;
  besaranNilai: number; // In IDR (Rupiah)
  status: ScholarshipStatus;
  tanggalMulai: string;
  tanggalBerakhir: string;
  keteranganDokumen?: string;
}

export type IncomingMutationStatus = 'Diterima' | 'Dalam Proses' | 'Ditolak';

export interface IncomingMutation {
  id: string;
  nis: string;
  nisn: string;
  namaLengkap: string;
  asalSekolah: string;
  alamatSekolahAsal: string;
  nomorSuratPindah: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  kelasTujuan: string;
  jurusanTujuan?: string;
  alasanPindah: string;
  petugasPenerima: string;
  berkasPendukung: string;
  status: IncomingMutationStatus;
  keterangan?: string;
}

export type OutgoingMutationStatus = 'Diajukan' | 'Disetujui' | 'Selesai';

export interface OutgoingMutation {
  id: string;
  nis: string;
  nisn: string;
  namaLengkap: string;
  kelasSaatIni: string;
  jurusanSaatIni?: string;
  tujuanSekolah: string;
  alamatSekolahTujuan: string;
  nomorSuratKeluar: string;
  tanggalPengajuan: string;
  tanggalKeluar: string;
  alasanKeluar: string;
  administrasiPembayaran: string;
  petugasPenandatangan: string;
  status: OutgoingMutationStatus;
  keterangan?: string;
}

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  nss: string;
  statusSekolah: 'Negeri' | 'Swasta';
  dinasPendidikan: string;
  cabangDinas: string;
  alamat: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaPetugasKesiswaan: string;
  nipPetugasKesiswaan: string;
  tahunAjaranAktif: string;
  semesterAktif: 'Ganjil' | 'Genap';
  logoUrl?: string;
}

export type TracerStudyStatus = 'Bekerja' | 'Kuliah' | 'Wirausaha' | 'Bekerja & Kuliah' | 'Mencari Kerja';
export type TracerLinearity = 'Linear' | 'Tidak Linear' | 'Belum Relevan';

export interface TracerStudy {
  id: string;
  nis: string;
  nisn: string;
  namaLengkap: string;
  tahunLulus: string; // e.g. "2025", "2026"
  jurusanAsal: string; // e.g. "MIPA", "IPS", "RPL"
  statusTracer: TracerStudyStatus;
  namaInstansiKampus: string; // PTN / Perusahaan / Usaha
  bidangPekerjaanStudi: string; // Jabatan atau Program Studi
  keselarasanJurusan: TracerLinearity;
  rentangPendapatan?: string; // e.g. "< 3 Juta", "3 - 5 Juta", "> 5 Juta"
  noHpWa: string;
  email: string;
  alamatDomisili: string;
  tanggalUpdate: string;
  keterangan?: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'students' 
  | 'achievements' 
  | 'scholarships' 
  | 'incoming_mutations' 
  | 'outgoing_mutations' 
  | 'tracer_study'
  | 'import' 
  | 'export' 
  | 'reports' 
  | 'settings'
  | 'guide';

export type UserRole = 'Kepala Sekolah' | 'Petugas TU Kesiswaan' | 'Guru BK / Wali Kelas';

export interface ImportValidationRow<T> {
  rowNumber: number;
  data: Partial<T>;
  isValid: boolean;
  errors: string[];
}

export interface ImportSummary<T> {
  templateType: 'students' | 'achievements' | 'scholarships' | 'incoming' | 'outgoing' | 'tracer';
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: ImportValidationRow<T>[];
}
