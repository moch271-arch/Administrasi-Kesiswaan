import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  Coins, 
  FileText 
} from 'lucide-react';
import { 
  Scholarship, 
  ScholarshipSource, 
  ScholarshipType, 
  ScholarshipStatus, 
  Student 
} from '../types/kesiswaan';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import { exportScholarships } from '../utils/excelExporter';

interface ScholarshipsViewProps {
  scholarships: Scholarship[];
  students: Student[];
  onSaveScholarship: (scholarship: Scholarship) => void;
  onDeleteScholarship: (id: string) => void;
}

export const ScholarshipsView: React.FC<ScholarshipsViewProps> = ({
  scholarships,
  students,
  onSaveScholarship,
  onDeleteScholarship,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Scholarship | null>(null);

  const initialForm: Omit<Scholarship, 'id'> = {
    nis: '',
    namaSiswa: '',
    kelas: '',
    namaBeasiswa: '',
    sumber: 'Pemerintah',
    jenis: 'Bantuan Biaya',
    periode: 'Semester Ganjil 2026/2027',
    besaranNilai: 1800000,
    status: 'Disetujui',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalBerakhir: '2027-06-30',
    keteranganDokumen: '',
  };
  const [formData, setFormData] = useState<Omit<Scholarship, 'id'>>(initialForm);

  // Filtered
  const filteredScholarships = useMemo(() => {
    return scholarships.filter(s => {
      const matchSearch =
        searchQuery === '' ||
        s.namaBeasiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.periode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSource = selectedSource === 'Semua' || s.sumber === selectedSource;
      const matchStatus = selectedStatus === 'Semua' || s.status === selectedStatus;

      return matchSearch && matchSource && matchStatus;
    });
  }, [scholarships, searchQuery, selectedSource, selectedStatus]);

  // Aggregate fund
  const totalApprovedFunds = useMemo(() => {
    return filteredScholarships
      .filter(s => s.status === 'Disetujui' || s.status === 'Selesai')
      .reduce((acc, curr) => acc + curr.besaranNilai, 0);
  }, [filteredScholarships]);

  const handleSelectStudent = (nis: string) => {
    const s = students.find(item => item.nis === nis);
    if (s) {
      setFormData(prev => ({
        ...prev,
        nis: s.nis,
        namaSiswa: s.namaLengkap,
        kelas: s.kelas,
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

  const handleOpenEdit = (item: Scholarship) => {
    setEditingItem(item);
    setFormData({
      nis: item.nis,
      namaSiswa: item.namaSiswa,
      kelas: item.kelas,
      namaBeasiswa: item.namaBeasiswa,
      sumber: item.sumber,
      jenis: item.jenis,
      periode: item.periode,
      besaranNilai: item.besaranNilai,
      status: item.status,
      tanggalMulai: item.tanggalMulai,
      tanggalBerakhir: item.tanggalBerakhir,
      keteranganDokumen: item.keteranganDokumen || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.namaBeasiswa) {
      alert('Mohon pilih siswa dan isi nama beasiswa.');
      return;
    }

    const itemToSave: Scholarship = {
      id: editingItem ? editingItem.id : `sch-${Date.now()}`,
      ...formData,
    };
    onSaveScholarship(itemToSave);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Data Siswa Penerima Beasiswa & Bantuan Biaya
            </h2>
            <p className="text-xs text-slate-500">
              Pencatatan PIP, KIP, beasiswa berprestasi, yayasan, dan bantuan pendidikan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Beasiswa</span>
            </button>
            <button
              onClick={() => exportScholarships(filteredScholarships, 'xlsx')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => exportScholarships(filteredScholarships, 'csv')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Filters & Total Metric Banner */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari beasiswa, nama siswa, periode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Sumber Bantuan</option>
              <option value="Pemerintah">Pemerintah</option>
              <option value="Swasta">Swasta</option>
              <option value="Yayasan">Yayasan</option>
              <option value="Sekolah">Sekolah</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status Beasiswa</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Diajukan">Diajukan</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-800">Total Bantuan Disetujui:</span>
            <span className="text-xs font-bold font-mono text-emerald-900">{formatRupiah(totalApprovedFunds)}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                <th className="px-3.5 py-3 text-center w-12">No</th>
                <th className="px-3.5 py-3">Nama Siswa / NIS</th>
                <th className="px-3.5 py-3">Kelas</th>
                <th className="px-3.5 py-3">Nama Beasiswa</th>
                <th className="px-3.5 py-3">Sumber & Jenis</th>
                <th className="px-3.5 py-3">Nilai Bantuan (Rp)</th>
                <th className="px-3.5 py-3">Periode & Durasi</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScholarships.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    Belum ada data penerima beasiswa yang cocok.
                  </td>
                </tr>
              ) : (
                filteredScholarships.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-2.5 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-slate-900">{item.namaSiswa}</div>
                      <div className="text-[11px] text-slate-400 font-mono">NIS {item.nis}</div>
                    </td>
                    <td className="px-3.5 py-2.5 font-medium text-slate-700">
                      {item.kelas}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-slate-900">{item.namaBeasiswa}</div>
                      {item.keteranganDokumen && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {item.keteranganDokumen}
                        </div>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="font-medium text-slate-800">{item.sumber}</span>
                      <span className="text-slate-400 block text-[11px]">{item.jenis}</span>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-semibold text-emerald-700">
                      {formatRupiah(item.besaranNilai)}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600">
                      <div>{item.periode}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {formatTanggalIndo(item.tanggalMulai)} s.d {formatTanggalIndo(item.tanggalBerakhir)}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.status === 'Disetujui'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'Diajukan'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : item.status === 'Selesai'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-amber-700 transition-colors"
                          title="Edit Beasiswa"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus beasiswa ${item.namaBeasiswa} atas nama ${item.namaSiswa}?`)) {
                              onDeleteScholarship(item.id);
                            }
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-rose-700 transition-colors"
                          title="Hapus Beasiswa"
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Data Beasiswa' : 'Tambah Penerima Beasiswa'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Siswa Terdaftar *
                </label>
                <select
                  value={formData.nis}
                  onChange={(e) => handleSelectStudent(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">-- Pilih Siswa dari Data Induk --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.nis}>
                      {s.nis} - {s.namaLengkap} ({s.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Beasiswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Program Indonesia Pintar (PIP), Beasiswa BAZNAS"
                  value={formData.namaBeasiswa}
                  onChange={(e) => setFormData({ ...formData, namaBeasiswa: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sumber Bantuan *</label>
                  <select
                    value={formData.sumber}
                    onChange={(e) => setFormData({ ...formData, sumber: e.target.value as ScholarshipSource })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  >
                    <option value="Pemerintah">Pemerintah</option>
                    <option value="Swasta">Swasta</option>
                    <option value="Yayasan">Yayasan</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Beasiswa *</label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value as ScholarshipType })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  >
                    <option value="Bantuan Biaya">Bantuan Biaya</option>
                    <option value="Penuh">Penuh</option>
                    <option value="Sebagian">Sebagian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Periode Penerimaan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tahun Anggaran 2026"
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Besaran Nilai (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    required
                    value={formData.besaranNilai}
                    onChange={(e) => setFormData({ ...formData, besaranNilai: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono font-semibold text-emerald-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Terbaca: {formatRupiah(formData.besaranNilai)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Beasiswa *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ScholarshipStatus })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  >
                    <option value="Disetujui">Disetujui</option>
                    <option value="Diajukan">Diajukan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tgl Mulai</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalMulai}
                    onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tgl Berakhir</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalBerakhir}
                    onChange={(e) => setFormData({ ...formData, tanggalBerakhir: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan / Dokumen Pendukung
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SK Penetapan Puslapdik Kemdikbud No. 0482/C/2026"
                  value={formData.keteranganDokumen}
                  onChange={(e) => setFormData({ ...formData, keteranganDokumen: e.target.value })}
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
                  <span>Simpan Beasiswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
