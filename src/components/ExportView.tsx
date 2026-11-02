import React, { useState } from 'react';
import { 
  DownloadCloud, 
  FileSpreadsheet, 
  Users, 
  Trophy, 
  GraduationCap, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Check, 
  FileDown 
} from 'lucide-react';
import { 
  Student, 
  Achievement, 
  Scholarship, 
  IncomingMutation, 
  OutgoingMutation,
  TracerStudy 
} from '../types/kesiswaan';
import { 
  exportStudents, 
  exportAchievements, 
  exportScholarships, 
  exportIncomingMutations, 
  exportOutgoingMutations,
  exportTracerStudy 
} from '../utils/excelExporter';

interface ExportViewProps {
  students: Student[];
  achievements: Achievement[];
  scholarships: Scholarship[];
  incomingMutations: IncomingMutation[];
  outgoingMutations: OutgoingMutation[];
  tracerStudies?: TracerStudy[];
}

export const ExportView: React.FC<ExportViewProps> = ({
  students,
  achievements,
  scholarships,
  incomingMutations,
  outgoingMutations,
  tracerStudies = [],
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'xlsx' | 'csv'>('xlsx');

  const exportCards = [
    {
      id: 'students',
      title: 'Semua Data Utama Siswa',
      description: 'Seluruh buku induk siswa aktif, pindahan, lulus, dan keluar lengkap dengan NIS/NISN.',
      count: students.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onExport: () => exportStudents(students, selectedFormat),
    },
    {
      id: 'achievements',
      title: 'Data Siswa Berprestasi',
      description: 'Rekap kejuaraan akademik & non-akademik dari tingkat sekolah hingga internasional.',
      count: achievements.length,
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onExport: () => exportAchievements(achievements, selectedFormat),
    },
    {
      id: 'scholarships',
      title: 'Data Siswa Penerima Beasiswa',
      description: 'Daftar penerima PIP, KIP, beasiswa berprestasi, nilai bantuan (Rp), dan periode.',
      count: scholarships.length,
      icon: GraduationCap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      onExport: () => exportScholarships(scholarships, selectedFormat),
    },
    {
      id: 'incoming',
      title: 'Daftar Mutasi Masuk',
      description: 'Catatan siswa pindah masuk, asal sekolah, nomor surat pindah, dan status verifikasi.',
      count: incomingMutations.length,
      icon: ArrowDownLeft,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      onExport: () => exportIncomingMutations(incomingMutations, selectedFormat),
    },
    {
      id: 'outgoing',
      title: 'Daftar Mutasi Keluar',
      description: 'Catatan siswa pindah keluar, sekolah tujuan, surat keterangan pindah, dan administrasi.',
      count: outgoingMutations.length,
      icon: ArrowUpRight,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      onExport: () => exportOutgoingMutations(outgoingMutations, selectedFormat),
    },
    {
      id: 'tracer',
      title: 'Data Tracer Study Alumni',
      description: 'Rekap jejak tamatan: Bekerja, Kuliah, Wirausaha (BMW), dan keselarasan kompetensi.',
      count: tracerStudies.length,
      icon: GraduationCap,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      onExport: () => exportTracerStudy(tracerStudies, selectedFormat),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pusat Ekspor Data Kesiswaan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unduh rekapitulasi data dalam format Microsoft Excel Workbook (.xlsx) atau Comma-Separated Values (.csv)
            </p>
          </div>

          {/* Format Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedFormat('xlsx')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedFormat === 'xlsx'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Excel (.XLSX)
            </button>
            <button
              onClick={() => setSelectedFormat('csv')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedFormat === 'csv'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CSV (.CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg ${card.bgColor} ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700">
                    {card.count} Data
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={card.onExport}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold transition-colors shadow-xs"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Unduh {selectedFormat.toUpperCase()}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
