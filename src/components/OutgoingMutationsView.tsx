import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  UserMinus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { OutgoingMutation, OutgoingMutationStatus, Student } from '../types/kesiswaan';
import { formatTanggalIndo } from '../utils/formatters';
import { exportOutgoingMutations } from '../utils/excelExporter';

interface OutgoingMutationsViewProps {
  outgoingMutations: OutgoingMutation[];
  students: Student[];
  onSaveMutation: (mutation: OutgoingMutation, autoTransitionStudent?: boolean) => void;
  onDeleteMutation: (id: string) => void;
  onApplyStatusTransition: (mutation: OutgoingMutation) => void;
}

export const OutgoingMutationsView: React.FC<OutgoingMutationsViewProps> = ({
  outgoingMutations,
  students,
  onSaveMutation,
  onDeleteMutation,
  onApplyStatusTransition,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OutgoingMutation | null>(null);

  const initialForm: Omit<OutgoingMutation, 'id'> = {
    nis: '',
    nisn: '',
    namaLengkap: '',
    kelasSaatIni: '',
    jurusanSaatIni: 'MIPA',
    tujuanSekolah: '',
    alamatSekolahTujuan: '',
    nomorSuratKeluar: `421.3/SKP-${Math.floor(100 + Math.random() * 900)}/SMAN1/2026`,
    tanggalPengajuan: new Date().toISOString().split('T')[0],
    tanggalKeluar: new Date().toISOString().split('T')[0],
    alasanKeluar: 'Mengikuti kepindahan domisili orang tua',
    administrasiPembayaran: 'Lengkap & Bebas Tanggungan SPP / Perpustakaan',
    petugasPenandatangan: 'Drs. H. Bambang Sudarsono, M.Pd.',
    status: 'Disetujui',
    keterangan: '',
  };
  const [formData, setFormData] = useState<Omit<OutgoingMutation, 'id'>>(initialForm);
  const [autoUpdateStudentStatus, setAutoUpdateStudentStatus] = useState(true);

  // Filtered
  const filteredMutations = useMemo(() => {
    return outgoingMutations.filter(m => {
      const matchSearch =
        searchQuery === '' ||
        m.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tujuanSekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nomorSuratKeluar.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'Semua' || m.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [outgoingMutations, searchQuery, selectedStatus]);

  // When picking student from registered active list
  const handleSelectStudent = (nis: string) => {
    const s = students.find(item => item.nis === nis);
    if (s) {
      setFormData(prev => ({
        ...prev,
        nis: s.nis,
        nisn: s.nisn,
        namaLengkap: s.namaLengkap,
        kelasSaatIni: s.kelas,
        jurusanSaatIni: s.jurusan,
      }));
    } else {
      setFormData(prev => ({ ...prev, nis }));
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setAutoUpdateStudentStatus(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: OutgoingMutation) => {
    setEditingItem(item);
    setFormData({
      nis: item.nis,
      nisn: item.nisn,
      namaLengkap: item.namaLengkap,
      kelasSaatIni: item.kelasSaatIni,
      jurusanSaatIni: item.jurusanSaatIni || 'MIPA',
      tujuanSekolah: item.tujuanSekolah,
      alamatSekolahTujuan: item.alamatSekolahTujuan,
      nomorSuratKeluar: item.nomorSuratKeluar,
      tanggalPengajuan: item.tanggalPengajuan,
      tanggalKeluar: item.tanggalKeluar,
      alasanKeluar: item.alasanKeluar,
      administrasiPembayaran: item.administrasiPembayaran,
      petugasPenandatangan: item.petugasPenandatangan,
      status: item.status,
      keterangan: item.keterangan || '',
    });
    setAutoUpdateStudentStatus(item.status === 'Disetujui' || item.status === 'Selesai');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.tujuanSekolah || !formData.alasanKeluar) {
      alert('Mohon pilih siswa, isi tujuan sekolah baru, dan alasan pindah keluar.');
      return;
    }

    const itemToSave: OutgoingMutation = {
      id: editingItem ? editingItem.id : `mut-out-${Date.now()}`,
      ...formData,
    };
    onSaveMutation(
      itemToSave, 
      autoUpdateStudentStatus && (itemToSave.status === 'Disetujui' || itemToSave.status === 'Selesai')
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Modul Mutasi Keluar Siswa
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan siswa yang pindah keluar dari sekolah, verifikasi administrasi & pembaruan status permanen
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-800 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Catat Mutasi Keluar</span>
            </button>
            <button
              onClick={() => exportOutgoingMutations(filteredMutations, 'xlsx')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => exportOutgoingMutations(filteredMutations, 'csv')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa, NIS, tujuan sekolah, no. surat keluar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status Mutasi</option>
              <option value="Selesai">Selesai (Surat Terbit)</option>
              <option value="Disetujui">Disetujui Kepala Sekolah</option>
              <option value="Diajukan">Diajukan</option>
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
                <th className="px-3.5 py-3">Kelas Asal</th>
                <th className="px-3.5 py-3">Tujuan Sekolah Baru</th>
                <th className="px-3.5 py-3">No. Surat Keluar</th>
                <th className="px-3.5 py-3">Tgl Keluar</th>
                <th className="px-3.5 py-3">Status Administrasi</th>
                <th className="px-3.5 py-3">Status Mutasi</th>
                <th className="px-3.5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMutations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    Belum ada data mutasi keluar yang terdaftar.
                  </td>
                </tr>
              ) : (
                filteredMutations.map((item, idx) => {
                  const student = students.find(s => s.nis.trim() === item.nis.trim());
                  const isStudentMarked = student?.status === 'Pindah Keluar';

                  return (
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
                        {item.kelasSaatIni}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="font-semibold text-slate-900">{item.tujuanSekolah}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{item.alasanKeluar}</div>
                      </td>
                      <td className="px-3.5 py-2.5 font-mono text-[11px] text-slate-800">
                        {item.nomorSuratKeluar}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600 font-mono">
                        {formatTanggalIndo(item.tanggalKeluar)}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          <span className="truncate max-w-[130px]">{item.administrasiPembayaran}</span>
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          item.status === 'Selesai'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : item.status === 'Disetujui'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {isStudentMarked ? 'Status Pokok: Pindah Keluar' : 'Status Pokok: Aktif'}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {!isStudentMarked && (item.status === 'Disetujui' || item.status === 'Selesai') && (
                            <button
                              onClick={() => onApplyStatusTransition(item)}
                              className="flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                              title="Set status siswa di Data Pokok menjadi Pindah Keluar"
                            >
                              <UserMinus className="h-3 w-3" />
                              <span>Tandai Keluar</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-amber-700 transition-colors"
                            title="Edit Mutasi Keluar"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus arsip mutasi keluar atas nama ${item.namaLengkap}? Sesuai ketentuan, riwayat mutasi wajib diarsipkan permanen.`)) {
                                onDeleteMutation(item.id);
                              }
                            }}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-rose-700 transition-colors"
                            title="Hapus Catatan Mutasi"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl my-6">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Formulir Mutasi Keluar' : 'Formulir Catat Mutasi Keluar Siswa'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Select Registered Student */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Siswa yang Mengajukan Pindah Keluar *
                </label>
                <select
                  value={formData.nis}
                  onChange={(e) => handleSelectStudent(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                  required
                >
                  <option value="">-- Pilih Siswa Terdaftar --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.nis}>
                      {s.nis} - {s.namaLengkap} ({s.kelas} - {s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.namaLengkap}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas Saat Ini</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.kelasSaatIni}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tujuan Sekolah Baru *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMA Negeri 3 Banjarmasin"
                    value={formData.tujuanSekolah}
                    onChange={(e) => setFormData({ ...formData, tujuanSekolah: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Sekolah Tujuan</label>
                  <input
                    type="text"
                    placeholder="Kota / Kabupaten tujuan"
                    value={formData.alamatSekolahTujuan}
                    onChange={(e) => setFormData({ ...formData, alamatSekolahTujuan: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Surat Keluar *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomorSuratKeluar}
                    onChange={(e) => setFormData({ ...formData, nomorSuratKeluar: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Pengajuan</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalPengajuan}
                    onChange={(e) => setFormData({ ...formData, tanggalPengajuan: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Keluar *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalKeluar}
                    onChange={(e) => setFormData({ ...formData, tanggalKeluar: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alasan Pindah / Keluar *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Mengikuti orang tua pindah tugas kedinasan ke luar kota"
                  value={formData.alasanKeluar}
                  onChange={(e) => setFormData({ ...formData, alasanKeluar: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keterangan Administrasi / SPP *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lunas & Bebas Pinjaman Perpustakaan"
                    value={formData.administrasiPembayaran}
                    onChange={(e) => setFormData({ ...formData, administrasiPembayaran: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pejabat yang Menandatangani *</label>
                  <input
                    type="text"
                    required
                    value={formData.petugasPenandatangan}
                    onChange={(e) => setFormData({ ...formData, petugasPenandatangan: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Mutasi *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as OutgoingMutationStatus })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Disetujui">Disetujui Kepala Sekolah</option>
                    <option value="Selesai">Selesai (Surat & Dokumen Terbit)</option>
                    <option value="Diajukan">Diajukan (Menunggu Validasi)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keterangan Lain</label>
                  <input
                    type="text"
                    placeholder="Dokumen yang diserahkan, dsb."
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Automatic Status Transition */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoUpdateStudentStatus}
                    onChange={(e) => setAutoUpdateStudentStatus(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-semibold text-amber-900 block">
                      Perbarui Status Siswa Otomatis ke "Pindah Keluar"
                    </span>
                    <span className="text-[11px] text-amber-700">
                      Jika status mutasi Disetujui/Selesai, status siswa di Data Induk akan otomatis diubah menjadi <strong>Pindah Keluar</strong>, tanpa menghapus data riwayat permanen.
                    </span>
                  </div>
                </label>
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
                  className="flex items-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2 font-semibold text-white hover:bg-amber-800 shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Mutasi Keluar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
