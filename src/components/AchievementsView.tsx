import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  Award, 
  FileText 
} from 'lucide-react';
import { Achievement, AchievementType, AchievementLevel, Student } from '../types/kesiswaan';
import { formatTanggalIndo } from '../utils/formatters';
import { exportAchievements } from '../utils/excelExporter';

interface AchievementsViewProps {
  achievements: Achievement[];
  students: Student[];
  onSaveAchievement: (achievement: Achievement) => void;
  onDeleteAchievement: (id: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  students,
  onSaveAchievement,
  onDeleteAchievement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [selectedLevel, setSelectedLevel] = useState<string>('Semua');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  const initialForm: Omit<Achievement, 'id'> = {
    nis: '',
    namaSiswa: '',
    kelas: '',
    jenisPrestasi: 'Akademik',
    namaKejuaraan: '',
    tingkat: 'Kabupaten',
    peringkat: '',
    tanggalPerolehan: new Date().toISOString().split('T')[0],
    penyelenggara: '',
    keteranganDokumen: '',
  };
  const [formData, setFormData] = useState<Omit<Achievement, 'id'>>(initialForm);

  // Filtered
  const filteredAchievements = useMemo(() => {
    return achievements.filter(a => {
      const matchSearch =
        searchQuery === '' ||
        a.namaKejuaraan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.penyelenggara.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = selectedType === 'Semua' || a.jenisPrestasi === selectedType;
      const matchLevel = selectedLevel === 'Semua' || a.tingkat === selectedLevel;

      return matchSearch && matchType && matchLevel;
    });
  }, [achievements, searchQuery, selectedType, selectedLevel]);

  // Handle select student in form
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

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      nis: item.nis,
      namaSiswa: item.namaSiswa,
      kelas: item.kelas,
      jenisPrestasi: item.jenisPrestasi,
      namaKejuaraan: item.namaKejuaraan,
      tingkat: item.tingkat,
      peringkat: item.peringkat,
      tanggalPerolehan: item.tanggalPerolehan,
      penyelenggara: item.penyelenggara,
      keteranganDokumen: item.keteranganDokumen || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.namaKejuaraan || !formData.peringkat) {
      alert('Mohon lengkapi NIS siswa, Nama Kejuaraan, dan Peringkat juara.');
      return;
    }

    const itemToSave: Achievement = {
      id: editingItem ? editingItem.id : `ach-${Date.now()}`,
      ...formData,
    };
    onSaveAchievement(itemToSave);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Data Siswa Berprestasi (Akademik & Non-Akademik)
            </h2>
            <p className="text-xs text-slate-500">
              Pencatatan rekam jejak juara lomba, kejuaraan, festival seni, dan olimpiade siswa
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Prestasi</span>
            </button>
            <button
              onClick={() => exportAchievements(filteredAchievements, 'xlsx')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => exportAchievements(filteredAchievements, 'csv')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kejuaraan, nama siswa, penyelenggara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Jenis Prestasi</option>
              <option value="Akademik">Akademik</option>
              <option value="Non-Akademik">Non-Akademik</option>
            </select>
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Tingkat Kejuaraan</option>
              <option value="Sekolah">Sekolah</option>
              <option value="Kecamatan">Kecamatan</option>
              <option value="Kabupaten">Kabupaten / Kota</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
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
                <th className="px-3.5 py-3">Kejuaraan / Kegiatan</th>
                <th className="px-3.5 py-3">Jenis & Tingkat</th>
                <th className="px-3.5 py-3">Peringkat</th>
                <th className="px-3.5 py-3">Tgl & Penyelenggara</th>
                <th className="px-3.5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAchievements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Belum ada data prestasi yang terdaftar.
                  </td>
                </tr>
              ) : (
                filteredAchievements.map((item, idx) => (
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
                      <div className="font-semibold text-slate-900">{item.namaKejuaraan}</div>
                      {item.keteranganDokumen && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <FileText className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-xs">{item.keteranganDokumen}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="font-medium text-slate-800">{item.jenisPrestasi}</span>
                      <span className="text-slate-400 block text-[11px]">Tingkat {item.tingkat}</span>
                    </td>
                    <td className="px-3.5 py-2.5 font-semibold text-purple-800 font-mono">
                      {item.peringkat}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600">
                      <div>{item.penyelenggara}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{formatTanggalIndo(item.tanggalPerolehan)}</div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-amber-700 transition-colors"
                          title="Edit Prestasi"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus data prestasi ${item.namaKejuaraan} atas nama ${item.namaSiswa}?`)) {
                              onDeleteAchievement(item.id);
                            }
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-rose-700 transition-colors"
                          title="Hapus Prestasi"
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
                {editingItem ? 'Edit Data Siswa Berprestasi' : 'Tambah Prestasi Siswa'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              {/* Student Picker */}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Prestasi *</label>
                  <select
                    value={formData.jenisPrestasi}
                    onChange={(e) => setFormData({ ...formData, jenisPrestasi: e.target.value as AchievementType })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Non-Akademik">Non-Akademik</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Kejuaraan *</label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => setFormData({ ...formData, tingkat: e.target.value as AchievementLevel })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  >
                    <option value="Sekolah">Sekolah</option>
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Kabupaten">Kabupaten / Kota</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kejuaraan / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Olimpiade Sains Nasional (OSN) Matematika"
                  value={formData.namaKejuaraan}
                  onChange={(e) => setFormData({ ...formData, namaKejuaraan: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peringkat / Juara *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Juara 1, Medali Perak, Best Speaker"
                    value={formData.peringkat}
                    onChange={(e) => setFormData({ ...formData, peringkat: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Perolehan *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalPerolehan}
                    onChange={(e) => setFormData({ ...formData, tanggalPerolehan: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Penyelenggara *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Puspresnas Kemdikbudristek / Dispora DKI"
                  value={formData.penyelenggara}
                  onChange={(e) => setFormData({ ...formData, penyelenggara: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan / Dokumen Pendukung
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Nomor Sertifikat 1290/BPTI/2026, Piagam Resmi"
                  value={formData.keteranganDokumen}
                  onChange={(e) => setFormData({ ...formData, keteranganDokumen: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
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
                  <span>Simpan Prestasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
