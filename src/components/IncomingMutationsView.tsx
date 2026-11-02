import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  CheckCircle, 
  UserCheck, 
  FileText, 
  Building2 
} from 'lucide-react';
import { IncomingMutation, IncomingMutationStatus, Student } from '../types/kesiswaan';
import { formatTanggalIndo } from '../utils/formatters';
import { exportIncomingMutations } from '../utils/excelExporter';

interface IncomingMutationsViewProps {
  incomingMutations: IncomingMutation[];
  students: Student[];
  onSaveMutation: (mutation: IncomingMutation, syncToStudentMaster?: boolean) => void;
  onDeleteMutation: (id: string) => void;
  onSyncToStudent: (mutation: IncomingMutation) => void;
}

export const IncomingMutationsView: React.FC<IncomingMutationsViewProps> = ({
  incomingMutations,
  students,
  onSaveMutation,
  onDeleteMutation,
  onSyncToStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IncomingMutation | null>(null);

  const initialForm: Omit<IncomingMutation, 'id'> = {
    nis: '',
    nisn: '',
    namaLengkap: '',
    asalSekolah: '',
    alamatSekolahAsal: '',
    nomorSuratPindah: '',
    tanggalSurat: new Date().toISOString().split('T')[0],
    tanggalDiterima: new Date().toISOString().split('T')[0],
    kelasTujuan: 'X-MIPA-1',
    jurusanTujuan: 'MIPA',
    alasanPindah: 'Mengikuti kepindahan tugas kedinasan orang tua',
    petugasPenerima: 'Siti Rahmawati, S.AP.',
    berkasPendukung: 'Surat Keterangan Pindah Asli, Rapor Lengkap, SKTM/Domisili',
    status: 'Diterima',
    keterangan: '',
  };
  const [formData, setFormData] = useState<Omit<IncomingMutation, 'id'>>(initialForm);
  const [autoSyncChecked, setAutoSyncChecked] = useState(true);

  // Filtered
  const filteredMutations = useMemo(() => {
    return incomingMutations.filter(m => {
      const matchSearch =
        searchQuery === '' ||
        m.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.asalSekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nomorSuratPindah.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'Semua' || m.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [incomingMutations, searchQuery, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setAutoSyncChecked(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: IncomingMutation) => {
    setEditingItem(item);
    setFormData({
      nis: item.nis,
      nisn: item.nisn,
      namaLengkap: item.namaLengkap,
      asalSekolah: item.asalSekolah,
      alamatSekolahAsal: item.alamatSekolahAsal,
      nomorSuratPindah: item.nomorSuratPindah,
      tanggalSurat: item.tanggalSurat,
      tanggalDiterima: item.tanggalDiterima,
      kelasTujuan: item.kelasTujuan,
      jurusanTujuan: item.jurusanTujuan || 'MIPA',
      alasanPindah: item.alasanPindah,
      petugasPenerima: item.petugasPenerima,
      berkasPendukung: item.berkasPendukung,
      status: item.status,
      keterangan: item.keterangan || '',
    });
    setAutoSyncChecked(item.status === 'Diterima');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nis || !formData.namaLengkap || !formData.asalSekolah) {
      alert('Mohon lengkapi NIS, Nama Lengkap, dan Asal Sekolah.');
      return;
    }

    const itemToSave: IncomingMutation = {
      id: editingItem ? editingItem.id : `mut-in-${Date.now()}`,
      ...formData,
    };
    onSaveMutation(itemToSave, autoSyncChecked && itemToSave.status === 'Diterima');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                <ArrowDownLeft className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Modul Mutasi Masuk Siswa
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan permohonan siswa pindahan masuk dari sekolah asal & sinkronisasi otomatis status kesiswaan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Catat Mutasi Masuk</span>
            </button>
            <button
              onClick={() => exportIncomingMutations(filteredMutations, 'xlsx')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => exportIncomingMutations(filteredMutations, 'csv')}
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
              placeholder="Cari nama siswa, NIS, asal sekolah, no. surat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status Mutasi</option>
              <option value="Diterima">Diterima</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Ditolak">Ditolak</option>
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
                <th className="px-3.5 py-3">Asal Sekolah</th>
                <th className="px-3.5 py-3">No. Surat & Tgl</th>
                <th className="px-3.5 py-3">Kelas Masuk</th>
                <th className="px-3.5 py-3">Alasan Pindah</th>
                <th className="px-3.5 py-3">Status Mutasi</th>
                <th className="px-3.5 py-3 text-right">Aksi & Sinkron</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMutations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Belum ada data mutasi masuk yang terdaftar.
                  </td>
                </tr>
              ) : (
                filteredMutations.map((item, idx) => {
                  const studentExists = students.some(s => s.nis.trim() === item.nis.trim());
                  const studentStatus = students.find(s => s.nis.trim() === item.nis.trim())?.status;
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
                      <td className="px-3.5 py-2.5">
                        <div className="font-medium text-slate-800">{item.asalSekolah}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.alamatSekolahAsal}</div>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600">
                        <div className="font-mono text-[11px] text-slate-800">{item.nomorSuratPindah}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{formatTanggalIndo(item.tanggalSurat)}</div>
                      </td>
                      <td className="px-3.5 py-2.5 font-medium text-emerald-800">
                        {item.kelasTujuan}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600 max-w-xs truncate">
                        {item.alasanPindah}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          item.status === 'Diterima'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.status === 'Dalam Proses'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {item.status}
                        </span>
                        {item.status === 'Diterima' && (
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            {studentExists ? `Status di Data Pokok: ${studentStatus}` : 'Belum di Data Pokok'}
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {item.status === 'Diterima' && (!studentExists || studentStatus !== 'Pindah Masuk') && (
                            <button
                              onClick={() => onSyncToStudent(item)}
                              className="flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="Sinkronkan status siswa ke Data Utama (Pindah Masuk)"
                            >
                              <UserCheck className="h-3 w-3" />
                              <span>Sinkron</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-amber-700 transition-colors"
                            title="Edit Mutasi Masuk"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus catatan mutasi masuk atas nama ${item.namaLengkap}? Riwayat mutasi penting untuk diarsipkan.`)) {
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
                {editingItem ? 'Edit Formulir Mutasi Masuk' : 'Formulir Catat Mutasi Masuk'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS Baru (Sekolah Ini) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 240107"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0081234567"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Naufal Azka Prasetyo"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Asal Sekolah *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMA Negeri 2 Yogyakarta"
                    value={formData.asalSekolah}
                    onChange={(e) => setFormData({ ...formData, asalSekolah: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Asal Sekolah</label>
                  <input
                    type="text"
                    placeholder="Kota / Kabupaten asal sekolah"
                    value={formData.alamatSekolahAsal}
                    onChange={(e) => setFormData({ ...formData, alamatSekolahAsal: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Surat Pindah</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 421.3/288/SMAN2/2026"
                    value={formData.nomorSuratPindah}
                    onChange={(e) => setFormData({ ...formData, nomorSuratPindah: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Surat</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalSurat}
                    onChange={(e) => setFormData({ ...formData, tanggalSurat: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Diterima</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalDiterima}
                    onChange={(e) => setFormData({ ...formData, tanggalDiterima: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas yang Dimasuki *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: X-MIPA-2"
                    value={formData.kelasTujuan}
                    onChange={(e) => setFormData({ ...formData, kelasTujuan: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Petugas Penerima *</label>
                  <input
                    type="text"
                    required
                    value={formData.petugasPenerima}
                    onChange={(e) => setFormData({ ...formData, petugasPenerima: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alasan Pindah *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jelaskan alasan kepindahan siswa ke sekolah ini"
                  value={formData.alasanPindah}
                  onChange={(e) => setFormData({ ...formData, alasanPindah: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Berkas Pendukung</label>
                <input
                  type="text"
                  placeholder="Contoh: Surat Pindah Asli, Rapor Lengkap, SKTM/Domisili"
                  value={formData.berkasPendukung}
                  onChange={(e) => setFormData({ ...formData, berkasPendukung: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Permohonan *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as IncomingMutationStatus })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Diterima">Diterima (Resmi Masuk)</option>
                    <option value="Dalam Proses">Dalam Proses Verifikasi</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
                  <input
                    type="text"
                    placeholder="Catatan pendaftaran dapodik"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Automatic Sync Checkbox */}
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncChecked}
                    onChange={(e) => setAutoSyncChecked(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-semibold text-emerald-900 block">
                      Sinkronisasi Otomatis ke Data Utama Siswa
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Bila status "Diterima", data siswa akan otomatis disimpan/diperbarui di Buku Induk Siswa dengan status <strong>"Pindah Masuk"</strong>.
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
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Mutasi Masuk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
