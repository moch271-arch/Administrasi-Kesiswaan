import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  FileText, 
  Calendar, 
  CheckCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Trophy, 
  GraduationCap, 
  Users 
} from 'lucide-react';
import { 
  Student, 
  Achievement, 
  Scholarship, 
  IncomingMutation, 
  OutgoingMutation,
  TracerStudy, 
  SchoolProfile 
} from '../types/kesiswaan';
import { formatTanggalIndo, formatRupiah } from '../utils/formatters';

interface ReportsPrintViewProps {
  schoolProfile: SchoolProfile;
  students: Student[];
  achievements: Achievement[];
  scholarships: Scholarship[];
  incomingMutations: IncomingMutation[];
  outgoingMutations: OutgoingMutation[];
  tracerStudies?: TracerStudy[];
}

type ReportType = 
  | 'mutasi_masuk'
  | 'mutasi_keluar'
  | 'siswa_seluruh'
  | 'siswa_berprestasi'
  | 'siswa_beasiswa'
  | 'tracer_study'
  | 'rekapitulasi_gabungan';

type PeriodType = 'semua' | 'harian' | 'bulanan' | 'tahunan';

export const ReportsPrintView: React.FC<ReportsPrintViewProps> = ({
  schoolProfile,
  students,
  achievements,
  scholarships,
  incomingMutations,
  outgoingMutations,
  tracerStudies = [],
}) => {
  const [reportType, setReportType] = useState<ReportType>('mutasi_masuk');
  const [periodType, setPeriodType] = useState<PeriodType>('semua');
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customMonth, setCustomMonth] = useState<string>('2026-07');
  const [customYear, setCustomYear] = useState<string>('2026');
  const [selectedClass, setSelectedClass] = useState<string>('Semua');

  // Filtered by Period
  const filterByDate = (dateStr: string) => {
    if (periodType === 'semua') return true;
    if (!dateStr) return false;
    if (periodType === 'harian') return dateStr === customDate;
    if (periodType === 'bulanan') return dateStr.startsWith(customMonth);
    if (periodType === 'tahunan') return dateStr.startsWith(customYear);
    return true;
  };

  // Filtered Data according to reportType
  const filteredIncoming = useMemo(() => {
    return incomingMutations.filter(m => filterByDate(m.tanggalDiterima));
  }, [incomingMutations, periodType, customDate, customMonth, customYear]);

  const filteredOutgoing = useMemo(() => {
    return outgoingMutations.filter(m => filterByDate(m.tanggalKeluar));
  }, [outgoingMutations, periodType, customDate, customMonth, customYear]);

  const filteredStudents = useMemo(() => {
    if (selectedClass === 'Semua') return students;
    return students.filter(s => s.kelas === selectedClass);
  }, [students, selectedClass]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter(a => filterByDate(a.tanggalPerolehan));
  }, [achievements, periodType, customDate, customMonth, customYear]);

  const filteredScholarships = useMemo(() => {
    return scholarships;
  }, [scholarships]);

  const handlePrint = () => {
    window.print();
  };

  const periodLabel = useMemo(() => {
    if (periodType === 'semua') return `Tahun Ajaran ${schoolProfile.tahunAjaranAktif}`;
    if (periodType === 'harian') return `Tanggal: ${formatTanggalIndo(customDate)}`;
    if (periodType === 'bulanan') {
      const [y, m] = customMonth.split('-');
      const d = new Date(Number(y), Number(m) - 1, 1);
      return `Bulan: ${d.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`;
    }
    return `Tahun: ${customYear}`;
  }, [periodType, customDate, customMonth, customYear, schoolProfile.tahunAjaranAktif]);

  return (
    <div className="space-y-6">
      {/* Control Panel (Hidden during print) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs no-print space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pusat Laporan & Cetak Dokumen Kesiswaan Resmi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih jenis laporan dan periode waktu untuk menghasilkan format cetak ber-KOP sekolah resmi siap tanda tangan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Langsung / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Report Type Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setReportType('mutasi_masuk')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              reportType === 'mutasi_masuk'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laporan Mutasi Masuk
          </button>
          <button
            onClick={() => setReportType('mutasi_keluar')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              reportType === 'mutasi_keluar'
                ? 'bg-white text-amber-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laporan Mutasi Keluar
          </button>
          <button
            onClick={() => setReportType('siswa_seluruh')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              reportType === 'siswa_seluruh'
                ? 'bg-white text-blue-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Seluruh Siswa
          </button>
          <button
            onClick={() => setReportType('siswa_berprestasi')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              reportType === 'siswa_berprestasi'
                ? 'bg-white text-purple-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Siswa Berprestasi
          </button>
          <button
            onClick={() => setReportType('siswa_beasiswa')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              reportType === 'siswa_beasiswa'
                ? 'bg-white text-blue-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Penerima Beasiswa
          </button>
          <button
            onClick={() => setReportType('tracer_study')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              reportType === 'tracer_study'
                ? 'bg-white text-blue-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laporan Tracer Study Alumni
          </button>
          <button
            onClick={() => setReportType('rekapitulasi_gabungan')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              reportType === 'rekapitulasi_gabungan'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekapitulasi Gabungan
          </button>
        </div>

        {/* Filter Controls for Reports */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Periode Laporan:</label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as PeriodType)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="semua">Semua Periode (Tahun Ajaran Aktif)</option>
              <option value="harian">Harian (Per Tanggal Spesifik)</option>
              <option value="bulanan">Bulanan</option>
              <option value="tahunan">Tahunan</option>
            </select>
          </div>

          {periodType === 'harian' && (
            <div>
              <label className="block text-slate-600 font-medium mb-1">Pilih Tanggal:</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-mono"
              />
            </div>
          )}

          {periodType === 'bulanan' && (
            <div>
              <label className="block text-slate-600 font-medium mb-1">Pilih Bulan & Tahun:</label>
              <input
                type="month"
                value={customMonth}
                onChange={(e) => setCustomMonth(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-mono"
              />
            </div>
          )}

          {periodType === 'tahunan' && (
            <div>
              <label className="block text-slate-600 font-medium mb-1">Pilih Tahun:</label>
              <input
                type="number"
                min="2020"
                max="2035"
                value={customYear}
                onChange={(e) => setCustomYear(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-mono"
              />
            </div>
          )}

          {reportType === 'siswa_seluruh' && (
            <div>
              <label className="block text-slate-600 font-medium mb-1">Saring Kelas:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs"
              >
                <option value="Semua">Semua Kelas</option>
                {Array.from(new Set(students.map(s => s.kelas))).sort().map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Official Indonesian School Document Paper Preview (Ready for Print) */}
      <div className="rounded-xl border border-slate-300 bg-white p-8 md:p-12 shadow-sm max-w-4xl mx-auto print-container text-black">
        {/* KOP SURAT RESMI SEKOLAH INDONESIA */}
        <div className="relative pb-3 border-b-[3px] border-black text-center">
          <div className="flex items-center justify-between">
            {/* Logo Tut Wuri Handayani / Lambang Pendidikan */}
            <div className="w-20 h-20 flex items-center justify-center border-2 border-slate-800 rounded-full font-bold text-xs p-1 text-center shrink-0">
              TUT WURI HANDAYANI
            </div>

            {/* Kop Details */}
            <div className="flex-1 px-4 leading-tight">
              <div className="text-xs font-semibold uppercase tracking-wider text-black">
                {schoolProfile.dinasPendidikan}
              </div>
              <div className="text-xs font-medium uppercase text-slate-800">
                {schoolProfile.cabangDinas}
              </div>
              <div className="text-lg md:text-xl font-bold uppercase tracking-tight text-black mt-1">
                {schoolProfile.namaSekolah}
              </div>
              <div className="text-[11px] text-slate-700 mt-1">
                {schoolProfile.alamat}, {schoolProfile.kabupatenKota}, {schoolProfile.provinsi} {schoolProfile.kodePos}
              </div>
              <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                NPSN: {schoolProfile.npsn} | NSS: {schoolProfile.nss} | Telp: {schoolProfile.telepon} | Email: {schoolProfile.email}
              </div>
            </div>

            {/* School Emblem Placeholder */}
            <div className="w-20 h-20 flex items-center justify-center border-2 border-slate-800 rounded-md font-bold text-[10px] p-1 text-center shrink-0">
              SEKOLAH TELADAN
            </div>
          </div>
          {/* Garis KOP Ganda Tipis */}
          <div className="mt-1 border-b border-black"></div>
        </div>

        {/* Judul & Nomor Dokumen Laporan */}
        <div className="text-center my-6">
          <h2 className="text-base md:text-lg font-bold uppercase tracking-wide underline underline-offset-4">
            {reportType === 'mutasi_masuk' && 'LAPORAN REKAPITULASI MUTASI MASUK SISWA'}
            {reportType === 'mutasi_keluar' && 'LAPORAN REKAPITULASI MUTASI KELUAR SISWA'}
            {reportType === 'siswa_seluruh' && 'DAFTAR INDUK SELURUH SISWA (PESERTA DIDIK)'}
            {reportType === 'siswa_berprestasi' && 'LAPORAN DAFTAR SISWA BERPRESTASI'}
            {reportType === 'siswa_beasiswa' && 'LAPORAN DAFTAR SISWA PENERIMA BEASISWA'}
            {reportType === 'tracer_study' && 'LAPORAN PENELUSURAN ALUMNI & TAMATAN (TRACER STUDY BMW)'}
            {reportType === 'rekapitulasi_gabungan' && 'LAPORAN REKAPITULASI GABUNGAN ADMINISTRASI KESISWAAN'}
          </h2>
          <p className="text-xs font-medium mt-1">
            Periode: <span className="font-semibold">{periodLabel}</span>
          </p>
          <p className="text-[11px] text-slate-600 font-mono mt-0.5">
            Nomor Dokumen: 421.3 / LAP-KESISWAAN / {new Date().getFullYear()}
          </p>
        </div>

        {/* Tabel Konten Sesuai Pilihan */}

        {/* 1. Laporan Mutasi Masuk */}
        {reportType === 'mutasi_masuk' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-black">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-semibold text-[11px]">
                  <th className="p-2 border-r border-black text-center w-8">No</th>
                  <th className="p-2 border-r border-black">NIS / NISN</th>
                  <th className="p-2 border-r border-black">Nama Siswa</th>
                  <th className="p-2 border-r border-black">Asal Sekolah</th>
                  <th className="p-2 border-r border-black">No. & Tgl Surat</th>
                  <th className="p-2 border-r border-black">Tgl Diterima</th>
                  <th className="p-2 border-r border-black">Kelas</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncoming.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center italic text-slate-500">
                      Tidak ada catatan mutasi masuk pada periode ini.
                    </td>
                  </tr>
                ) : (
                  filteredIncoming.map((item, index) => (
                    <tr key={item.id} className="border-b border-black/30">
                      <td className="p-2 border-r border-black text-center font-mono">{index + 1}</td>
                      <td className="p-2 border-r border-black font-mono font-semibold">
                        {item.nis}
                        <div className="text-[10px] text-slate-500 font-normal">{item.nisn}</div>
                      </td>
                      <td className="p-2 border-r border-black font-semibold">{item.namaLengkap}</td>
                      <td className="p-2 border-r border-black">
                        <div>{item.asalSekolah}</div>
                        <div className="text-[10px] text-slate-500">{item.alasanPindah}</div>
                      </td>
                      <td className="p-2 border-r border-black font-mono text-[11px]">
                        <div>{item.nomorSuratPindah}</div>
                        <div className="text-[10px] text-slate-500">{formatTanggalIndo(item.tanggalSurat)}</div>
                      </td>
                      <td className="p-2 border-r border-black font-mono text-[11px]">
                        {formatTanggalIndo(item.tanggalDiterima)}
                      </td>
                      <td className="p-2 border-r border-black font-semibold">{item.kelasTujuan}</td>
                      <td className="p-2 text-center font-semibold">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="text-xs font-semibold">
              Jumlah Siswa Pindah Masuk: <span className="font-mono">{filteredIncoming.length} Siswa</span>
            </div>
          </div>
        )}

        {/* 2. Laporan Mutasi Keluar */}
        {reportType === 'mutasi_keluar' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-black">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-semibold text-[11px]">
                  <th className="p-2 border-r border-black text-center w-8">No</th>
                  <th className="p-2 border-r border-black">NIS / NISN</th>
                  <th className="p-2 border-r border-black">Nama Siswa</th>
                  <th className="p-2 border-r border-black">Kelas Asal</th>
                  <th className="p-2 border-r border-black">Tujuan Sekolah</th>
                  <th className="p-2 border-r border-black">Tgl Keluar</th>
                  <th className="p-2 border-r border-black">Alasan Pindah</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOutgoing.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center italic text-slate-500">
                      Tidak ada catatan mutasi keluar pada periode ini.
                    </td>
                  </tr>
                ) : (
                  filteredOutgoing.map((item, index) => (
                    <tr key={item.id} className="border-b border-black/30">
                      <td className="p-2 border-r border-black text-center font-mono">{index + 1}</td>
                      <td className="p-2 border-r border-black font-mono font-semibold">
                        {item.nis}
                        <div className="text-[10px] text-slate-500 font-normal">{item.nisn}</div>
                      </td>
                      <td className="p-2 border-r border-black font-semibold">{item.namaLengkap}</td>
                      <td className="p-2 border-r border-black">{item.kelasSaatIni}</td>
                      <td className="p-2 border-r border-black font-medium">{item.tujuanSekolah}</td>
                      <td className="p-2 border-r border-black font-mono text-[11px]">
                        {formatTanggalIndo(item.tanggalKeluar)}
                      </td>
                      <td className="p-2 border-r border-black text-[11px]">
                        <div>{item.alasanKeluar}</div>
                        <div className="text-[10px] text-slate-500">Admin: {item.administrasiPembayaran}</div>
                      </td>
                      <td className="p-2 text-center font-semibold">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="text-xs font-semibold">
              Jumlah Siswa Pindah Keluar: <span className="font-mono">{filteredOutgoing.length} Siswa</span>
            </div>
          </div>
        )}

        {/* 3. Daftar Seluruh Siswa */}
        {reportType === 'siswa_seluruh' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-black">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-semibold text-[11px]">
                  <th className="p-2 border-r border-black text-center w-8">No</th>
                  <th className="p-2 border-r border-black">NIS / NISN</th>
                  <th className="p-2 border-r border-black">Nama Lengkap Siswa</th>
                  <th className="p-2 border-r border-black text-center">JK</th>
                  <th className="p-2 border-r border-black">Kelas</th>
                  <th className="p-2 border-r border-black">Tempat, Tgl Lahir</th>
                  <th className="p-2 border-r border-black">Orang Tua / Wali</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, index) => (
                  <tr key={s.id} className="border-b border-black/30">
                    <td className="p-2 border-r border-black text-center font-mono">{index + 1}</td>
                    <td className="p-2 border-r border-black font-mono">
                      <div className="font-semibold">{s.nis}</div>
                      <div className="text-[10px] text-slate-500">{s.nisn}</div>
                    </td>
                    <td className="p-2 border-r border-black font-semibold">{s.namaLengkap}</td>
                    <td className="p-2 border-r border-black text-center">{s.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                    <td className="p-2 border-r border-black font-medium">{s.kelas}</td>
                    <td className="p-2 border-r border-black text-[11px]">
                      {s.tempatLahir}, {formatTanggalIndo(s.tanggalLahir)}
                    </td>
                    <td className="p-2 border-r border-black text-[11px]">{s.namaOrangTua || '-'}</td>
                    <td className="p-2 text-center font-semibold">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs font-semibold">
              Total Peserta Didik: <span className="font-mono">{filteredStudents.length} Siswa</span>
            </div>
          </div>
        )}

        {/* 4. Siswa Berprestasi */}
        {reportType === 'siswa_berprestasi' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-black">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-semibold text-[11px]">
                  <th className="p-2 border-r border-black text-center w-8">No</th>
                  <th className="p-2 border-r border-black">NIS</th>
                  <th className="p-2 border-r border-black">Nama Siswa</th>
                  <th className="p-2 border-r border-black">Kelas</th>
                  <th className="p-2 border-r border-black">Nama Kejuaraan / Kegiatan</th>
                  <th className="p-2 border-r border-black">Tingkat</th>
                  <th className="p-2 border-r border-black">Peringkat</th>
                  <th className="p-2 border-r border-black">Penyelenggara</th>
                  <th className="p-2">Tgl Perolehan</th>
                </tr>
              </thead>
              <tbody>
                {filteredAchievements.map((a, index) => (
                  <tr key={a.id} className="border-b border-black/30">
                    <td className="p-2 border-r border-black text-center font-mono">{index + 1}</td>
                    <td className="p-2 border-r border-black font-mono">{a.nis}</td>
                    <td className="p-2 border-r border-black font-semibold">{a.namaSiswa}</td>
                    <td className="p-2 border-r border-black">{a.kelas}</td>
                    <td className="p-2 border-r border-black font-medium">{a.namaKejuaraan}</td>
                    <td className="p-2 border-r border-black">{a.tingkat}</td>
                    <td className="p-2 border-r border-black font-bold font-mono">{a.peringkat}</td>
                    <td className="p-2 border-r border-black text-[11px]">{a.penyelenggara}</td>
                    <td className="p-2 font-mono text-[11px]">{formatTanggalIndo(a.tanggalPerolehan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs font-semibold">
              Total Perolehan Prestasi: <span className="font-mono">{filteredAchievements.length} Kejuaraan</span>
            </div>
          </div>
        )}

        {/* 5. Siswa Penerima Beasiswa */}
        {reportType === 'siswa_beasiswa' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-black">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-semibold text-[11px]">
                  <th className="p-2 border-r border-black text-center w-8">No</th>
                  <th className="p-2 border-r border-black">NIS</th>
                  <th className="p-2 border-r border-black">Nama Siswa</th>
                  <th className="p-2 border-r border-black">Kelas</th>
                  <th className="p-2 border-r border-black">Nama Beasiswa</th>
                  <th className="p-2 border-r border-black">Sumber</th>
                  <th className="p-2 border-r border-black">Besaran Bantuan (Rp)</th>
                  <th className="p-2 border-r border-black">Periode</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredScholarships.map((s, index) => (
                  <tr key={s.id} className="border-b border-black/30">
                    <td className="p-2 border-r border-black text-center font-mono">{index + 1}</td>
                    <td className="p-2 border-r border-black font-mono">{s.nis}</td>
                    <td className="p-2 border-r border-black font-semibold">{s.namaSiswa}</td>
                    <td className="p-2 border-r border-black">{s.kelas}</td>
                    <td className="p-2 border-r border-black font-medium">{s.namaBeasiswa}</td>
                    <td className="p-2 border-r border-black">{s.sumber}</td>
                    <td className="p-2 border-r border-black font-mono font-semibold">
                      {formatRupiah(s.besaranNilai)}
                    </td>
                    <td className="p-2 border-r border-black text-[11px]">{s.periode}</td>
                    <td className="p-2 text-center font-semibold">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs font-semibold">
              Total Penerima: <span className="font-mono">{filteredScholarships.length} Siswa</span> · Akumulasi Dana: <span className="font-mono">{formatRupiah(filteredScholarships.reduce((sum, item) => sum + item.besaranNilai, 0))}</span>
            </div>
          </div>
        )}

        {/* 6. Laporan Tracer Study Alumni */}
        {reportType === 'tracer_study' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-black">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-semibold text-[11px]">
                  <th className="p-2 border-r border-black text-center w-8">No</th>
                  <th className="p-2 border-r border-black">NIS / NISN</th>
                  <th className="p-2 border-r border-black">Nama Lengkap Alumni</th>
                  <th className="p-2 border-r border-black text-center">Thn Lulus</th>
                  <th className="p-2 border-r border-black">Status BMW</th>
                  <th className="p-2 border-r border-black">Kampus / Perusahaan / Usaha</th>
                  <th className="p-2 border-r border-black">Prodi / Posisi</th>
                  <th className="p-2 border-r border-black text-center">Keselarasan</th>
                  <th className="p-2">Kontak WA</th>
                </tr>
              </thead>
              <tbody>
                {tracerStudies.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-4 text-center italic text-slate-500">
                      Belum ada data penelusuran tamatan (Tracer Study).
                    </td>
                  </tr>
                ) : (
                  tracerStudies.map((t, index) => (
                    <tr key={t.id} className="border-b border-black/30">
                      <td className="p-2 border-r border-black text-center font-mono">{index + 1}</td>
                      <td className="p-2 border-r border-black font-mono">
                        <div className="font-semibold">{t.nis}</div>
                        <div className="text-[10px] text-slate-500">{t.nisn}</div>
                      </td>
                      <td className="p-2 border-r border-black font-semibold">{t.namaLengkap}</td>
                      <td className="p-2 border-r border-black text-center font-mono">{t.tahunLulus}</td>
                      <td className="p-2 border-r border-black font-semibold">{t.statusTracer}</td>
                      <td className="p-2 border-r border-black font-medium">{t.namaInstansiKampus}</td>
                      <td className="p-2 border-r border-black">{t.bidangPekerjaanStudi}</td>
                      <td className="p-2 border-r border-black text-center font-medium">{t.keselarasanJurusan}</td>
                      <td className="p-2 font-mono text-[11px]">{t.noHpWa}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="text-xs font-semibold">
              Total Alumni Terlacak: <span className="font-mono">{tracerStudies.length} Orang</span> · Kuliah: <span className="font-mono">{tracerStudies.filter(t => t.statusTracer === 'Kuliah').length}</span> · Bekerja: <span className="font-mono">{tracerStudies.filter(t => t.statusTracer === 'Bekerja').length}</span> · Wirausaha: <span className="font-mono">{tracerStudies.filter(t => t.statusTracer === 'Wirausaha').length}</span>
            </div>
          </div>
        )}

        {/* 7. Rekapitulasi Gabungan */}
        {reportType === 'rekapitulasi_gabungan' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-black">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-semibold text-[11px]">
                  <th className="p-2 border-r border-black text-center w-8">No</th>
                  <th className="p-2 border-r border-black">Komponen Kesiswaan</th>
                  <th className="p-2 border-r border-black">Jumlah / Satuan</th>
                  <th className="p-2">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/30">
                <tr>
                  <td className="p-2 border-r border-black text-center font-mono">1</td>
                  <td className="p-2 border-r border-black font-semibold">Siswa Aktif Terdaftar</td>
                  <td className="p-2 border-r border-black font-mono font-bold">{students.filter(s => s.status === 'Aktif').length} Siswa</td>
                  <td className="p-2">Peserta didik aktif belajar di rombel reguler</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black text-center font-mono">2</td>
                  <td className="p-2 border-r border-black font-semibold">Siswa Mutasi Masuk</td>
                  <td className="p-2 border-r border-black font-mono font-bold">{incomingMutations.length} Siswa</td>
                  <td className="p-2">{incomingMutations.filter(m => m.status === 'Diterima').length} diterima, {incomingMutations.filter(m => m.status === 'Dalam Proses').length} dalam proses</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black text-center font-mono">3</td>
                  <td className="p-2 border-r border-black font-semibold">Siswa Mutasi Keluar</td>
                  <td className="p-2 border-r border-black font-mono font-bold">{outgoingMutations.length} Siswa</td>
                  <td className="p-2">Pindah sekolah keluar daerah / dinas orang tua</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black text-center font-mono">4</td>
                  <td className="p-2 border-r border-black font-semibold">Siswa Berprestasi Terdata</td>
                  <td className="p-2 border-r border-black font-mono font-bold">{achievements.length} Rekam Jejak</td>
                  <td className="p-2">OSN, FLS2N, O2SN, kejuaraan resmi</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black text-center font-mono">5</td>
                  <td className="p-2 border-r border-black font-semibold">Penerima Beasiswa & Bantuan</td>
                  <td className="p-2 border-r border-black font-mono font-bold">{scholarships.length} Siswa</td>
                  <td className="p-2">Total Dana: {formatRupiah(scholarships.reduce((sum, item) => sum + item.besaranNilai, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* KOLOM TANDA TANGAN RESMI KEPALA SEKOLAH & PETUGAS */}
        <div className="mt-12 pt-6 border-t border-black/40 grid grid-cols-2 text-center text-xs print-break-inside-avoid">
          {/* Petugas Tata Usaha Kesiswaan */}
          <div>
            <p className="text-slate-600 mb-1">Mengetahui / Memeriksa,</p>
            <p className="font-semibold text-black">Petugas Urusan Kesiswaan</p>
            <div className="h-20 flex items-center justify-center italic text-slate-300 text-[10px]">
              (Tanda Tangan & Cap)
            </div>
            <p className="font-bold underline text-black">
              {schoolProfile.namaPetugasKesiswaan}
            </p>
            <p className="font-mono text-[11px] text-slate-700">
              NIP. {schoolProfile.nipPetugasKesiswaan}
            </p>
          </div>

          {/* Kepala Sekolah */}
          <div>
            <p className="text-slate-600 mb-1">
              {schoolProfile.kabupatenKota.replace('Kota Administrasi ', '').replace('Kabupaten ', '')}, {formatTanggalIndo(new Date().toISOString().split('T')[0])}
            </p>
            <p className="font-semibold text-black">Kepala {schoolProfile.namaSekolah}</p>
            <div className="h-20 flex items-center justify-center italic text-slate-300 text-[10px]">
              (Tanda Tangan & Cap Dinas)
            </div>
            <p className="font-bold underline text-black">
              {schoolProfile.namaKepalaSekolah}
            </p>
            <p className="font-mono text-[11px] text-slate-700">
              NIP. {schoolProfile.nipKepalaSekolah}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
