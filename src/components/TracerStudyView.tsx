import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Building, 
  Store, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Edit3, 
  Eye, 
  X, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { 
  TracerStudy, 
  TracerStudyStatus, 
  TracerLinearity, 
  Student 
} from '../types/kesiswaan';
import { exportTracerStudy } from '../utils/excelExporter';
import { formatTanggalIndo } from '../utils/formatters';

interface TracerStudyViewProps {
  tracerStudies: TracerStudy[];
  students: Student[];
  onSaveTracerStudy: (item: TracerStudy) => void;
  onDeleteTracerStudy: (id: string) => void;
}

export const TracerStudyView: React.FC<TracerStudyViewProps> = ({
  tracerStudies,
  students,
  onSaveTracerStudy,
  onDeleteTracerStudy,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [selectedLinearity, setSelectedLinearity] = useState<string>('Semua');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TracerStudy | null>(null);
  const [detailItem, setDetailItem] = useState<TracerStudy | null>(null);

  // Form State
  const initialForm: Omit<TracerStudy, 'id'> = {
    nis: '',
    nisn: '',
    namaLengkap: '',
    tahunLulus: '2026',
    jurusanAsal: 'MIPA',
    statusTracer: 'Kuliah',
    namaInstansiKampus: '',
    bidangPekerjaanStudi: '',
    keselarasanJurusan: 'Linear',
    rentangPendapatan: '-',
    noHpWa: '',
    email: '',
    alamatDomisili: '',
    tanggalUpdate: new Date().toISOString().split('T')[0],
    keterangan: '',
  };
  const [formData, setFormData] = useState<Omit<TracerStudy, 'id'>>(initialForm);

  // Unique Years for dropdown
  const yearList = useMemo(() => {
    const list = Array.from(new Set(tracerStudies.map(t => t.tahunLulus))).filter(Boolean);
    return list.sort().reverse();
  }, [tracerStudies]);

  // Analytics BMW Calculations
  const stats = useMemo(() => {
    const total = tracerStudies.length;
    if (total === 0) return { total: 0, bekerja: 0, kuliah: 0, wirausaha: 0, ganda: 0, mencari: 0, linearPct: 0 };

    const bekerja = tracerStudies.filter(t => t.statusTracer === 'Bekerja').length;
    const kuliah = tracerStudies.filter(t => t.statusTracer === 'Kuliah').length;
    const wirausaha = tracerStudies.filter(t => t.statusTracer === 'Wirausaha').length;
    const ganda = tracerStudies.filter(t => t.statusTracer === 'Bekerja & Kuliah').length;
    const mencari = tracerStudies.filter(t => t.statusTracer === 'Mencari Kerja').length;
    const linearCount = tracerStudies.filter(t => t.keselarasanJurusan === 'Linear').length;

    return {
      total,
      bekerja,
      kuliah,
      wirausaha,
      ganda,
      mencari,
      linearPct: Math.round((linearCount / total) * 100),
    };
  }, [tracerStudies]);

  // Filtered List
  const filteredList = useMemo(() => {
    return tracerStudies.filter((t) => {
      const matchSearch =
        searchQuery === '' ||
        t.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.namaInstansiKampus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.bidangPekerjaanStudi.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'Semua' || t.statusTracer === selectedStatus;
      const matchYear = selectedYear === 'Semua' || t.tahunLulus === selectedYear;
      const matchLinear = selectedLinearity === 'Semua' || t.keselarasanJurusan === selectedLinearity;

      return matchSearch && matchStatus && matchYear && matchLinear;
    });
  }, [tracerStudies, searchQuery, selectedStatus, selectedYear, selectedLinearity]);

  // Handle student pick from registered graduates
  const handleSelectStudent = (nis: string) => {
    const s = students.find(item => item.nis === nis);
    if (s) {
      setFormData(prev => ({
        ...prev,
        nis: s.nis,
        nisn: s.nisn,
        namaLengkap: s.namaLengkap,
        jurusanAsal: s.jurusan || 'MIPA',
        alamatDomisili: s.alamat || '',
        noHpWa: s.noHp || '',
      }));
    } else {
      setFormData(prev => ({ ...prev, nis }));
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TracerStudy) => {
    setEditingItem(item);
    setFormData({
      nis: item.nis,
      nisn: item.nisn,
      namaLengkap: item.namaLengkap,
      tahunLulus: item.tahunLulus,
      jurusanAsal: item.jurusanAsal,
      statusTracer: item.statusTracer,
      namaInstansiKampus: item.namaInstansiKampus,
      bidangPekerjaanStudi: item.bidangPekerjaanStudi,
      keselarasanJurusan: item.keselarasanJurusan,
      rentangPendapatan: item.rentangPendapatan || '-',
      noHpWa: item.noHpWa,
      email: item.email,
      alamatDomisili: item.alamatDomisili,
      tanggalUpdate: item.tanggalUpdate,
      keterangan: item.keterangan || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.namaLengkap || !formData.namaInstansiKampus) {
      alert('Mohon lengkapi NIS, Nama Lengkap Alumni, dan Nama Kampus/Perusahaan/Usaha.');
      return;
    }

    const itemToSave: TracerStudy = {
      id: editingItem ? editingItem.id : `trc-${Date.now()}`,
      ...formData,
    };
    onSaveTracerStudy(itemToSave);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 text-white shadow-xs">
                <GraduationCap className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Menu Tracer Study (Penelusuran Tamatan & Alumni)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pantau rekam jejak kelulusan peserta didik berdasarkan formula BMW Kemdikbudristek (Bekerja, Melanjutkan Kuliah, Wirausaha) dan tingkat keselarasan kompetensi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Data Tracer</span>
            </button>
            <button
              onClick={() => exportTracerStudy(filteredList, 'xlsx')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => exportTracerStudy(filteredList, 'csv')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* BMW Analytics Stat Cards */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <span className="text-[10px] text-slate-500 font-medium block">Total Alumni Terdata</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{stats.total}</div>
            <span className="text-[10px] text-slate-400">100% Kuesioner</span>
          </div>

          <div className="rounded-lg bg-blue-50/70 border border-blue-200 p-3">
            <span className="text-[10px] text-blue-700 font-semibold block flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              <span>M (Kuliah / Studi)</span>
            </span>
            <div className="text-xl font-bold text-blue-900 font-mono mt-0.5">{stats.kuliah}</div>
            <span className="text-[10px] text-blue-600 font-mono">
              {stats.total > 0 ? Math.round((stats.kuliah / stats.total) * 100) : 0}% dari total
            </span>
          </div>

          <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3">
            <span className="text-[10px] text-emerald-700 font-semibold block flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              <span>B (Bekerja)</span>
            </span>
            <div className="text-xl font-bold text-emerald-900 font-mono mt-0.5">{stats.bekerja}</div>
            <span className="text-[10px] text-emerald-600 font-mono">
              {stats.total > 0 ? Math.round((stats.bekerja / stats.total) * 100) : 0}% dari total
            </span>
          </div>

          <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-3">
            <span className="text-[10px] text-amber-700 font-semibold block flex items-center gap-1">
              <Store className="h-3 w-3" />
              <span>W (Wirausaha)</span>
            </span>
            <div className="text-xl font-bold text-amber-900 font-mono mt-0.5">{stats.wirausaha}</div>
            <span className="text-[10px] text-amber-600 font-mono">
              {stats.total > 0 ? Math.round((stats.wirausaha / stats.total) * 100) : 0}% dari total
            </span>
          </div>

          <div className="rounded-lg bg-purple-50/70 border border-purple-200 p-3">
            <span className="text-[10px] text-purple-700 font-semibold block flex items-center gap-1">
              <Building className="h-3 w-3" />
              <span>Bekerja & Kuliah</span>
            </span>
            <div className="text-xl font-bold text-purple-900 font-mono mt-0.5">{stats.ganda}</div>
            <span className="text-[10px] text-purple-600 font-mono">
              {stats.total > 0 ? Math.round((stats.ganda / stats.total) * 100) : 0}% dari total
            </span>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <span className="text-[10px] text-slate-600 font-semibold block flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span>Linearitas Jurusan</span>
            </span>
            <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">{stats.linearPct}%</div>
            <span className="text-[10px] text-slate-500">Kesesuaian Kompetensi</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari alumni, kampus, perusahaan, posisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status BMW</option>
              <option value="Kuliah">Kuliah / Studi Lanjut</option>
              <option value="Bekerja">Bekerja</option>
              <option value="Wirausaha">Wirausaha</option>
              <option value="Bekerja & Kuliah">Bekerja & Kuliah</option>
              <option value="Mencari Kerja">Mencari Kerja / Menunggu</option>
            </select>
          </div>

          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Tahun Kelulusan</option>
              {yearList.map(y => (
                <option key={y} value={y}>Tahun Lulus {y}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLinearity}
              onChange={(e) => setSelectedLinearity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Keselarasan</option>
              <option value="Linear">Linear (Sesuai Jurusan)</option>
              <option value="Tidak Linear">Tidak Linear</option>
              <option value="Belum Relevan">Belum Relevan</option>
            </select>
          </div>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                <th className="px-3.5 py-3 text-center w-12">No</th>
                <th className="px-3.5 py-3">Nama Alumni / NIS</th>
                <th className="px-3.5 py-3">Tahun & Jurusan</th>
                <th className="px-3.5 py-3">Status BMW</th>
                <th className="px-3.5 py-3">Perguruan Tinggi / Perusahaan / Usaha</th>
                <th className="px-3.5 py-3">Program Studi / Posisi Jabatan</th>
                <th className="px-3.5 py-3">Keselarasan</th>
                <th className="px-3.5 py-3">Kontak & Update</th>
                <th className="px-3.5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    Belum ada data penelusuran tamatan (Tracer Study) yang cocok.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-2.5 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-slate-900">{item.namaLengkap}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        NIS {item.nis} · NISN {item.nisn}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 font-medium text-slate-700">
                      <div>Lulus <span className="font-mono font-bold text-slate-900">{item.tahunLulus}</span></div>
                      <span className="text-[11px] text-slate-400">Jurusan: {item.jurusanAsal}</span>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.statusTracer === 'Kuliah'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : item.statusTracer === 'Bekerja'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.statusTracer === 'Wirausaha'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : item.statusTracer === 'Bekerja & Kuliah'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {item.statusTracer}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-slate-900">{item.namaInstansiKampus}</div>
                      {item.rentangPendapatan && item.rentangPendapatan !== '-' && (
                        <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                          Pendapatan: {item.rentangPendapatan}
                        </div>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-700">
                      <div>{item.bidangPekerjaanStudi}</div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`text-[11px] font-medium ${
                        item.keselarasanJurusan === 'Linear'
                          ? 'text-emerald-700 font-semibold'
                          : item.keselarasanJurusan === 'Tidak Linear'
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}>
                        {item.keselarasanJurusan}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600">
                      <div className="font-mono text-[11px] text-slate-700">{item.noHpWa}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{formatTanggalIndo(item.tanggalUpdate)}</div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-700 transition-colors"
                          title="Lihat Detail Alumni"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-amber-700 transition-colors"
                          title="Edit Data Tracer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus data tracer study atas nama alumni ${item.namaLengkap}?`)) {
                              onDeleteTracerStudy(item.id);
                            }
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-rose-700 transition-colors"
                          title="Hapus Data Tracer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl my-6">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Data Tracer Study' : 'Formulir Kuesioner Tracer Study Alumni'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Optional pick from registered graduates */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih dari Siswa Terdaftar (Opsional untuk Auto-Fill)
                </label>
                <select
                  value={formData.nis}
                  onChange={(e) => handleSelectStudent(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                >
                  <option value="">-- Input Bebas atau Pilih dari Data Siswa --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.nis}>
                      {s.nis} - {s.namaLengkap} ({s.kelas} - {s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS Alumni *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 210088"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN Alumni</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0054567890"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Alumni *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kevin Sanjaya Pratama"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Lulus *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2026"
                    value={formData.tahunLulus}
                    onChange={(e) => setFormData({ ...formData, tahunLulus: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jurusan Asal Sekolah *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: MIPA, IPS, RPL"
                    value={formData.jurusanAsal}
                    onChange={(e) => setFormData({ ...formData, jurusanAsal: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Pasca Lulus (BMW) *</label>
                  <select
                    value={formData.statusTracer}
                    onChange={(e) => setFormData({ ...formData, statusTracer: e.target.value as TracerStudyStatus })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Kuliah">Kuliah (Melanjutkan Studi)</option>
                    <option value="Bekerja">Bekerja</option>
                    <option value="Wirausaha">Wirausaha (Membuka Usaha)</option>
                    <option value="Bekerja & Kuliah">Bekerja & Kuliah</option>
                    <option value="Mencari Kerja">Mencari Kerja / Menunggu</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keselarasan Kompetensi *</label>
                  <select
                    value={formData.keselarasanJurusan}
                    onChange={(e) => setFormData({ ...formData, keselarasanJurusan: e.target.value as TracerLinearity })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  >
                    <option value="Linear">Linear (Sesuai dengan Jurusan Asal)</option>
                    <option value="Tidak Linear">Tidak Linear</option>
                    <option value="Belum Relevan">Belum Relevan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Perguruan Tinggi / Perusahaan / Usaha Mandiri *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Institut Teknologi Bandung (ITB) atau PT Astra International"
                  value={formData.namaInstansiKampus}
                  onChange={(e) => setFormData({ ...formData, namaInstansiKampus: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Program Studi / Posisi Jabatan Pekerjaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: S1 Teknik Informatika atau Junior Web Developer"
                    value={formData.bidangPekerjaanStudi}
                    onChange={(e) => setFormData({ ...formData, bidangPekerjaanStudi: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rentang Penghasilan / Gaji (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 5 - 8 Juta / bulan, atau -"
                    value={formData.rentangPendapatan}
                    onChange={(e) => setFormData({ ...formData, rentangPendapatan: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP Aktif</label>
                  <input
                    type="text"
                    placeholder="Contoh: 081255667788"
                    value={formData.noHpWa}
                    onChange={(e) => setFormData({ ...formData, noHpWa: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Alumni</label>
                  <input
                    type="email"
                    placeholder="Contoh: alumni@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili Saat Ini</label>
                <input
                  type="text"
                  placeholder="Kota tempat tinggal saat ini"
                  value={formData.alamatDomisili}
                  onChange={(e) => setFormData({ ...formData, alamatDomisili: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  placeholder="Jalur masuk SNBP, beasiswa, masa tunggu kerja, dsb."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Data Tracer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Alumni */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <span className="text-xs font-mono text-blue-700 font-semibold">
                  Tahun Lulus {detailItem.tahunLulus} · NIS {detailItem.nis}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {detailItem.namaLengkap}
                </h3>
              </div>
              <button onClick={() => setDetailItem(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Status Pasca Lulus</span>
                  <span className="font-semibold text-blue-800">{detailItem.statusTracer}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Keselarasan Jurusan</span>
                  <span className="font-semibold text-emerald-800">{detailItem.keselarasanJurusan}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Jurusan Asal</span>
                  <span className="text-slate-800">{detailItem.jurusanAsal}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Rentang Pendapatan</span>
                  <span className="text-slate-800 font-mono">{detailItem.rentangPendapatan || '-'}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-slate-500 font-medium block">Nama Kampus / Kantor / Usaha:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{detailItem.namaInstansiKampus}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Program Studi / Posisi Jabatan:</span>
                  <p className="text-slate-800">{detailItem.bidangPekerjaanStudi}</p>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3 text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono">{detailItem.noHpWa || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{detailItem.email || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{detailItem.alamatDomisili || '-'}</span>
                </div>
              </div>

              {detailItem.keterangan && (
                <div className="rounded bg-blue-50/50 p-2.5 text-slate-700 border border-blue-100">
                  <strong className="text-blue-900">Catatan:</strong> {detailItem.keterangan}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 flex justify-end">
              <button
                onClick={() => setDetailItem(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
