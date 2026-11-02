import React from 'react';
import { 
  Users, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Trophy, 
  GraduationCap, 
  FileSpreadsheet, 
  Printer, 
  UserPlus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Briefcase,
  Store,
  BarChart3,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { 
  Student, 
  Achievement, 
  Scholarship, 
  IncomingMutation, 
  OutgoingMutation, 
  SchoolProfile, 
  ActiveTab,
  TracerStudy,
  StudentStatus,
  Agama
} from '../types/kesiswaan';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';

interface StatusTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      status: StudentStatus;
      label: string;
      count: number;
      percentage: number;
      color: string;
    };
  }>;
}

const StatusCustomTooltip: React.FC<StatusTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs min-w-[170px]">
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-100">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-bold text-slate-900">{data.label}</span>
        </div>
        <div className="space-y-1.5 text-slate-600">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500">Jumlah Siswa:</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {data.count} Siswa
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500">Proporsi:</span>
            <span className="font-mono font-bold text-blue-700 tabular-nums">
              {data.percentage}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface DashboardViewProps {
  schoolProfile: SchoolProfile;
  students: Student[];
  achievements: Achievement[];
  scholarships: Scholarship[];
  incomingMutations: IncomingMutation[];
  outgoingMutations: OutgoingMutation[];
  tracerStudies?: TracerStudy[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onOpenAddIncoming: () => void;
  onOpenAddOutgoing: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  schoolProfile,
  students,
  achievements,
  scholarships,
  incomingMutations,
  outgoingMutations,
  tracerStudies = [],
  onNavigate,
  onOpenAddStudent,
  onOpenAddIncoming,
  onOpenAddOutgoing,
}) => {
  // Compute metrics
  const activeStudents = students.filter(s => s.status === 'Aktif');
  const incomingStudents = students.filter(s => s.status === 'Pindah Masuk');
  const outgoingStudents = students.filter(s => s.status === 'Pindah Keluar');
  const graduatedStudents = students.filter(s => s.status === 'Lulus');

  // BMW Tracer Metrics
  const tracerBekerja = tracerStudies.filter(t => t.statusTracer === 'Bekerja' || t.statusTracer === 'Bekerja & Kuliah').length;
  const tracerKuliah = tracerStudies.filter(t => t.statusTracer === 'Kuliah' || t.statusTracer === 'Bekerja & Kuliah').length;
  const tracerWirausaha = tracerStudies.filter(t => t.statusTracer === 'Wirausaha').length;

  const totalScholarshipFunds = scholarships
    .filter(s => s.status === 'Disetujui' || s.status === 'Selesai')
    .reduce((sum, item) => sum + item.besaranNilai, 0);

  // Grade distributions
  const gradeX = students.filter(s => s.kelas.startsWith('X-') || s.kelas.startsWith('X ')).length;
  const gradeXI = students.filter(s => s.kelas.startsWith('XI-') || s.kelas.startsWith('XI ')).length;
  const gradeXII = students.filter(s => s.kelas.startsWith('XII-') || s.kelas.startsWith('XII ')).length;

  // Status Distribution for Recharts Bar Chart
  const statusCounts: Record<StudentStatus, number> = {
    'Aktif': 0,
    'Pindah Masuk': 0,
    'Pindah Keluar': 0,
    'Lulus': 0,
    'Keluar Sekolah': 0,
  };

  students.forEach((s) => {
    if (statusCounts[s.status] !== undefined) {
      statusCounts[s.status]++;
    }
  });

  const totalStudents = students.length || 1;

  const statusChartData = [
    {
      status: 'Aktif' as StudentStatus,
      label: 'Siswa Aktif',
      count: statusCounts['Aktif'],
      percentage: Math.round((statusCounts['Aktif'] / totalStudents) * 100),
      color: '#10b981',
    },
    {
      status: 'Pindah Masuk' as StudentStatus,
      label: 'Pindah Masuk',
      count: statusCounts['Pindah Masuk'],
      percentage: Math.round((statusCounts['Pindah Masuk'] / totalStudents) * 100),
      color: '#0284c7',
    },
    {
      status: 'Pindah Keluar' as StudentStatus,
      label: 'Pindah Keluar',
      count: statusCounts['Pindah Keluar'],
      percentage: Math.round((statusCounts['Pindah Keluar'] / totalStudents) * 100),
      color: '#f59e0b',
    },
    {
      status: 'Lulus' as StudentStatus,
      label: 'Lulus / Alumni',
      count: statusCounts['Lulus'],
      percentage: Math.round((statusCounts['Lulus'] / totalStudents) * 100),
      color: '#6366f1',
    },
    {
      status: 'Keluar Sekolah' as StudentStatus,
      label: 'Keluar Sekolah',
      count: statusCounts['Keluar Sekolah'],
      percentage: Math.round((statusCounts['Keluar Sekolah'] / totalStudents) * 100),
      color: '#f43f5e',
    },
  ];

  // Gender Demographics
  const maleCount = students.filter(s => s.jenisKelamin === 'Laki-laki').length;
  const femaleCount = students.filter(s => s.jenisKelamin === 'Perempuan').length;
  const malePercentage = totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 0;
  const femalePercentage = totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0;

  // Religion Demographics
  const religionList: { key: Agama; label: string; color: string; bg: string; border: string; text: string }[] = [
    { key: 'Islam', label: 'Islam', color: '#10b981', bg: 'bg-emerald-50/70', border: 'border-emerald-200', text: 'text-emerald-700' },
    { key: 'Kristen', label: 'Kristen', color: '#0284c7', bg: 'bg-sky-50/70', border: 'border-sky-200', text: 'text-sky-700' },
    { key: 'Katolik', label: 'Katolik', color: '#6366f1', bg: 'bg-indigo-50/70', border: 'border-indigo-200', text: 'text-indigo-700' },
    { key: 'Hindu', label: 'Hindu', color: '#f59e0b', bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-700' },
    { key: 'Buddha', label: 'Buddha', color: '#ea580c', bg: 'bg-orange-50/70', border: 'border-orange-200', text: 'text-orange-700' },
    { key: 'Konghucu', label: 'Konghucu', color: '#e11d48', bg: 'bg-rose-50/70', border: 'border-rose-200', text: 'text-rose-700' },
  ];

  const religionCounts: Record<string, number> = {
    'Islam': 0,
    'Kristen': 0,
    'Katolik': 0,
    'Hindu': 0,
    'Buddha': 0,
    'Konghucu': 0,
    'Lainnya': 0,
  };

  students.forEach((s) => {
    const rel = s.agama || 'Islam';
    if (religionCounts[rel] !== undefined) {
      religionCounts[rel]++;
    } else {
      religionCounts['Lainnya'] = (religionCounts['Lainnya'] || 0) + 1;
    }
  });

  const religionStats = religionList.map(r => ({
    ...r,
    count: religionCounts[r.key] || 0,
    percentage: totalStudents > 0 ? Math.round(((religionCounts[r.key] || 0) / totalStudents) * 100) : 0,
  }));

  const majorityReligion = religionStats.reduce(
    (max, curr) => (curr.count > max.count ? curr : max),
    religionStats[0]
  );

  return (
    <div className="space-y-6">
      {/* School Header Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <span>{schoolProfile.statusSekolah.toUpperCase()}</span>
              <span>·</span>
              <span>NPSN {schoolProfile.npsn}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
              {schoolProfile.namaSekolah}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {schoolProfile.alamat}, {schoolProfile.kabupatenKota}, {schoolProfile.provinsi}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors shadow-xs"
            >
              <UserPlus className="h-4 w-4" />
              <span>Tambah Siswa</span>
            </button>
            <button
              onClick={() => onNavigate('import')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Impor Excel</span>
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Printer className="h-4 w-4 text-blue-600" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div 
          onClick={() => onNavigate('students')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Siswa Aktif</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {activeStudents.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Total terdaftar: {students.length}
          </div>
        </div>

        <div 
          onClick={() => onNavigate('incoming_mutations')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-400 hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Mutasi Masuk</span>
            <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {incomingMutations.length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            {incomingMutations.filter(m => m.status === 'Diterima').length} diterima
          </div>
        </div>

        <div 
          onClick={() => onNavigate('outgoing_mutations')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Mutasi Keluar</span>
            <ArrowUpRight className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {outgoingMutations.length}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">
            {outgoingMutations.filter(m => m.status === 'Selesai').length} terselesaikan
          </div>
        </div>

        <div 
          onClick={() => onNavigate('achievements')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-purple-400 hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Siswa Berprestasi</span>
            <Trophy className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {achievements.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Akademik & Seni
          </div>
        </div>

        <div 
          onClick={() => onNavigate('scholarships')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Penerima Beasiswa</span>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {scholarships.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Total disetujui: {scholarships.filter(s => s.status === 'Disetujui').length}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Dana Bantuan</span>
            <span className="text-xs font-mono font-bold text-emerald-700">IDR</span>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums truncate">
            {formatRupiah(totalScholarshipFunds)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Tahun {schoolProfile.tahunAjaranAktif}
          </div>
        </div>
      </div>

      {/* Visual Analytics: Distribusi Status Siswa (Recharts Bar Chart) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Distribusi Status Siswa (Buku Induk Kesiswaan)
                </h3>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {students.length} Total Terdata
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Diagram batang sebaran status kesiswaan: Aktif, Pindah Masuk, Pindah Keluar, Lulus, dan Keluar Sekolah
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>Buka Data Siswa</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Chart + Stat Summary breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Recharts Bar Chart Container */}
          <div className="lg:col-span-7 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<StatusCustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown cards */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {statusChartData.map((item) => (
              <div
                key={item.status}
                onClick={() => onNavigate('students')}
                className="cursor-pointer group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 hover:bg-slate-100/80 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {item.label}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Status: {item.status}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                    {item.count} <span className="text-[10px] font-normal text-slate-500">Siswa</span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 font-mono">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demografi Kesiswaan: Jumlah Jenis Kelamin & Agama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom 1: Distribusi Jenis Kelamin (5 Kolom) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Jumlah Jenis Kelamin
                  </h3>
                  <p className="text-xs text-slate-500">
                    Komposisi siswa laki-laki dan perempuan
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {totalStudents} Siswa
              </span>
            </div>

            {/* 2 Stat Cards for Gender */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Laki-laki */}
              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3.5">
                <div className="flex items-center justify-between text-blue-700 mb-1.5">
                  <span className="text-xs font-semibold">Laki-laki (L)</span>
                  <span className="text-xs font-bold font-mono">{malePercentage}%</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {maleCount}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Peserta didik putra
                </p>
              </div>

              {/* Perempuan */}
              <div className="rounded-lg border border-rose-100 bg-rose-50/50 p-3.5">
                <div className="flex items-center justify-between text-rose-700 mb-1.5">
                  <span className="text-xs font-semibold">Perempuan (P)</span>
                  <span className="text-xs font-bold font-mono">{femalePercentage}%</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {femaleCount}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Peserta didik putri
                </p>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Putra: {maleCount} ({malePercentage}%)</span>
                <span>Putri: {femaleCount} ({femalePercentage}%)</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${malePercentage}%` }}
                  title={`Laki-laki: ${malePercentage}%`}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${femalePercentage}%` }}
                  title={`Perempuan: ${femalePercentage}%`}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Rasio Gender (L : P)</span>
            <span className="font-mono font-bold text-slate-800">
              {maleCount} : {femaleCount} {femaleCount > 0 ? `(${(maleCount / femaleCount).toFixed(2)} : 1)` : ''}
            </span>
          </div>
        </div>

        {/* Kolom 2: Distribusi Agama (7 Kolom) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Jumlah & Sebaran Agama
                  </h3>
                  <p className="text-xs text-slate-500">
                    Data keagamaan siswa terdaftar di Dapodik / Buku Induk
                  </p>
                </div>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                6 Agama Resmi
              </span>
            </div>

            {/* Grid of 6 religions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {religionStats.map((item) => (
                <div
                  key={item.key}
                  className={`rounded-lg border ${item.border} ${item.bg} p-2.5 flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${item.text}`}>{item.label}</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    {item.count} <span className="text-[10px] font-normal text-slate-500">Siswa</span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden mt-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: item.color,
                        width: `${Math.max(item.percentage, item.count > 0 ? 5 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Kerukunan & Toleransi Siswa</span>
            <span className="font-medium text-slate-700">
              Mayoritas: <span className="font-bold text-slate-900">{majorityReligion.label}</span> ({majorityReligion.count} Siswa)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Mutasi Terbaru & Prestasi / Beasiswa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom 1: Rekap Mutasi Kesiswaan Terkini */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Aktivitas Mutasi Terkini
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan mutasi masuk dan keluar yang tercatat di sistem
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={onOpenAddIncoming}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded"
              >
                + Masuk
              </button>
              <button
                onClick={onOpenAddOutgoing}
                className="text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-1 rounded"
              >
                + Keluar
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* Incoming list sample */}
            {incomingMutations.slice(0, 2).map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-emerald-100 p-2 text-emerald-700 shrink-0">
                    <ArrowDownLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{m.namaLengkap}</span>
                      <span className="text-[11px] font-mono text-slate-500">NIS {m.nis}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dari: <span className="font-medium text-slate-700">{m.asalSekolah}</span> · Ke {m.kelasTujuan}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      No. Surat: {m.nomorSuratPindah} · Tgl Diterima: {formatTanggalIndo(m.tanggalDiterima)}
                    </p>
                  </div>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  m.status === 'Diterima' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}

            {/* Outgoing list sample */}
            {outgoingMutations.slice(0, 2).map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-amber-100 p-2 text-amber-700 shrink-0">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{m.namaLengkap}</span>
                      <span className="text-[11px] font-mono text-slate-500">NIS {m.nis}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tujuan: <span className="font-medium text-slate-700">{m.tujuanSekolah}</span> · Dari {m.kelasSaatIni}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tgl Keluar: {formatTanggalIndo(m.tanggalKeluar)} · {m.administrasiPembayaran}
                    </p>
                  </div>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  m.status === 'Selesai' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('incoming_mutations')}
            className="mt-4 flex w-full items-center justify-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 py-1"
          >
            <span>Lihat Seluruh Riwayat Mutasi</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Kolom 2: Prestasi & Beasiswa Terkini */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Prestasi & Bantuan Beasiswa
              </h3>
              <p className="text-xs text-slate-500">
                Pencapaian siswa dan penyaluran bantuan pendidikan
              </p>
            </div>
            <button
              onClick={() => onNavigate('achievements')}
              className="text-xs font-medium text-blue-700 hover:text-blue-800"
            >
              Kelola
            </button>
          </div>

          <div className="space-y-3">
            {achievements.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-purple-100 p-2 text-purple-700 shrink-0">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{a.namaKejuaraan}</span>
                      <span className="text-[11px] text-purple-700 font-medium">({a.tingkat})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {a.namaSiswa} · {a.kelas} · <span className="font-semibold text-slate-800">{a.peringkat}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Penyelenggara: {a.penyelenggara}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stat sebaran tingkat kelas */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Distribusi Rombel Kelas
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded bg-slate-50 p-2 border border-slate-100">
                <span className="text-slate-500 text-[10px]">Tingkat X</span>
                <p className="text-base font-bold text-slate-900 font-mono mt-0.5">{gradeX} Siswa</p>
              </div>
              <div className="rounded bg-slate-50 p-2 border border-slate-100">
                <span className="text-slate-500 text-[10px]">Tingkat XI</span>
                <p className="text-base font-bold text-slate-900 font-mono mt-0.5">{gradeXI} Siswa</p>
              </div>
              <div className="rounded bg-slate-50 p-2 border border-slate-100">
                <span className="text-slate-500 text-[10px]">Tingkat XII</span>
                <p className="text-base font-bold text-slate-900 font-mono mt-0.5">{gradeXII} Siswa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracer Study Alumni Quick Widget */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-700">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Tracer Study Alumni (Formula BMW Kemdikbudristek)
                </h3>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                  {tracerStudies.length} Terdata
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemantauan serapan lulusan: Bekerja, Melanjutkan Kuliah, dan Wirausaha
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('tracer_study')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100/70 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <span>Buka Tracer Study</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2 text-blue-700">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500">Bekerja (B)</span>
              <p className="text-lg font-bold text-slate-900 font-mono">{tracerBekerja} Alumni</p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 flex items-center gap-3">
            <div className="rounded-md bg-purple-100 p-2 text-purple-700">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500">Melanjutkan Kuliah (M)</span>
              <p className="text-lg font-bold text-slate-900 font-mono">{tracerKuliah} Alumni</p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 flex items-center gap-3">
            <div className="rounded-md bg-amber-100 p-2 text-amber-700">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500">Wirausaha (W)</span>
              <p className="text-lg font-bold text-slate-900 font-mono">{tracerWirausaha} Alumni</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
