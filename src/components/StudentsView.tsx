import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  FileSpreadsheet, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  GraduationCap 
} from 'lucide-react';
import { 
  Student, 
  StudentStatus, 
  Gender, 
  Agama,
  Achievement, 
  Scholarship, 
  IncomingMutation, 
  OutgoingMutation 
} from '../types/kesiswaan';
import { formatTanggalIndo } from '../utils/formatters';
import { exportStudents } from '../utils/excelExporter';

interface StudentsViewProps {
  students: Student[];
  achievements: Achievement[];
  scholarships: Scholarship[];
  incomingMutations: IncomingMutation[];
  outgoingMutations: OutgoingMutation[];
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  achievements,
  scholarships,
  incomingMutations,
  outgoingMutations,
  onSaveStudent,
  onDeleteStudent,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [selectedJurusan, setSelectedJurusan] = useState<string>('Semua');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);

  // Form Data State
  const initialFormState: Omit<Student, 'id'> = {
    nis: '',
    nisn: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    kelas: 'X-MIPA-1',
    jurusan: 'MIPA',
    tahunAjaran: '2026/2027',
    alamat: '',
    namaOrangTua: '',
    noHp: '',
    status: 'Aktif',
    keterangan: '',
  };
  const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Unique lists for filter dropdowns
  const classList = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.kelas))).filter(Boolean);
    return list.sort();
  }, [students]);

  const jurusanList = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.jurusan))).filter(Boolean);
    return list.sort();
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kelas.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'Semua' || s.status === selectedStatus;
      const matchKelas = selectedKelas === 'Semua' || s.kelas === selectedKelas;
      const matchJurusan = selectedJurusan === 'Semua' || s.jurusan === selectedJurusan;

      return matchSearch && matchStatus && matchKelas && matchJurusan;
    });
  }, [students, searchQuery, selectedStatus, selectedKelas, selectedJurusan]);

  // Handle open add modal
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nis: student.nis,
      nisn: student.nisn,
      namaLengkap: student.namaLengkap,
      tempatLahir: student.tempatLahir,
      tanggalLahir: student.tanggalLahir,
      jenisKelamin: student.jenisKelamin,
      agama: student.agama || 'Islam',
      kelas: student.kelas,
      jurusan: student.jurusan,
      tahunAjaran: student.tahunAjaran,
      alamat: student.alamat,
      namaOrangTua: student.namaOrangTua,
      noHp: student.noHp,
      status: student.status,
      keterangan: student.keterangan || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.nis.trim()) {
      errors.nis = 'NIS wajib diisi.';
    } else {
      const isDuplicate = students.some(
        s => s.nis.trim() === formData.nis.trim() && s.id !== editingStudent?.id
      );
      if (isDuplicate) {
        errors.nis = 'NIS sudah digunakan oleh siswa lain.';
      }
    }

    if (!formData.nisn.trim()) {
      errors.nisn = 'NISN wajib diisi.';
    } else {
      const isDuplicateNisn = students.some(
        s => s.nisn.trim() === formData.nisn.trim() && s.id !== editingStudent?.id
      );
      if (isDuplicateNisn) {
        errors.nisn = 'NISN sudah digunakan oleh siswa lain.';
      }
    }

    if (!formData.namaLengkap.trim()) errors.namaLengkap = 'Nama Lengkap wajib diisi.';
    if (!formData.tempatLahir.trim()) errors.tempatLahir = 'Tempat lahir wajib diisi.';
    if (!formData.tanggalLahir.trim()) errors.tanggalLahir = 'Tanggal lahir wajib diisi.';
    if (!formData.kelas.trim()) errors.kelas = 'Kelas wajib dipilih.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const studentToSave: Student = {
      id: editingStudent ? editingStudent.id : `std-${Date.now()}`,
      ...formData,
      createdAt: editingStudent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveStudent(studentToSave);
    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search/Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Data Utama Pokok Peserta Didik
            </h2>
            <p className="text-xs text-slate-500">
              Kelola buku induk kesiswaan, NIS/NISN unik, biodata, dan status siswa
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors shadow-xs"
            >
              <UserPlus className="h-4 w-4" />
              <span>Tambah Siswa</span>
            </button>
            <button
              onClick={() => exportStudents(filteredStudents, 'xlsx')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              title="Ekspor ke format Excel .xlsx"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={() => exportStudents(filteredStudents, 'csv')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              title="Ekspor ke format CSV UTF-8"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari NIS, NISN, Nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status Siswa</option>
              <option value="Aktif">Aktif</option>
              <option value="Pindah Masuk">Pindah Masuk</option>
              <option value="Pindah Keluar">Pindah Keluar</option>
              <option value="Lulus">Lulus</option>
              <option value="Keluar Sekolah">Keluar Sekolah</option>
            </select>
          </div>

          <div>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Kelas</option>
              {classList.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Jurusan</option>
              {jurusanList.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* High Density Students Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                <th className="px-3.5 py-3 text-center w-12">No</th>
                <th className="px-3.5 py-3">NIS / NISN</th>
                <th className="px-3.5 py-3">Nama Lengkap Siswa</th>
                <th className="px-3.5 py-3">JK</th>
                <th className="px-3.5 py-3">Kelas / Jurusan</th>
                <th className="px-3.5 py-3">Tempat, Tgl Lahir</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Tidak ditemukan data siswa yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr 
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-3.5 py-2.5 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono">
                      <div className="font-semibold text-slate-900">{student.nis}</div>
                      <div className="text-[11px] text-slate-500">{student.nisn}</div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-slate-900">{student.namaLengkap}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{student.alamat}</div>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-700">
                      {student.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="font-medium text-slate-800">{student.kelas}</span>
                      <span className="text-slate-400 ml-1">({student.jurusan})</span>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600">
                      <div>{student.tempatLahir}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{formatTanggalIndo(student.tanggalLahir)}</div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        student.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : student.status === 'Pindah Masuk'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : student.status === 'Pindah Keluar'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : student.status === 'Lulus'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailStudent(student)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-700 transition-colors"
                          title="Lihat Detail Siswa"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-amber-700 transition-colors"
                          title="Edit Biodata Siswa"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Yakin ingin menghapus data siswa ${student.namaLengkap} (NIS: ${student.nis})?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-rose-700 transition-colors"
                          title="Hapus Data Siswa"
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

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-500">
          <span>Menampilkan <strong className="text-slate-700 font-mono">{filteredStudents.length}</strong> dari <strong className="text-slate-700 font-mono">{students.length}</strong> siswa</span>
          <span className="text-[11px] text-slate-400">Database Kesiswaan Terpadu</span>
        </div>
      </div>

      {/* MODAL: Tambah / Edit Siswa */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingStudent ? 'Perbarui Data Siswa' : 'Tambah Siswa Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Isi seluruh kolom bertanda bintang (*) dengan akurat sesuai dokumen resmi
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Row 1: NIS & NISN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIS (Nomor Induk Siswa) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Contoh: 240101"
                    className={`w-full rounded-lg border px-3 py-2 text-xs font-mono focus:outline-none ${
                      formErrors.nis ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.nis && (
                    <p className="text-[11px] text-rose-600 mt-0.5">{formErrors.nis}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN (Nomor Induk Siswa Nasional) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0081234561 (10 digit)"
                    className={`w-full rounded-lg border px-3 py-2 text-xs font-mono focus:outline-none ${
                      formErrors.nisn ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.nisn && (
                    <p className="text-[11px] text-rose-600 mt-0.5">{formErrors.nisn}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Nama Lengkap, Jenis Kelamin & Agama */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    placeholder="Contoh: Ahmad Fauzi Rahman"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as Gender })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Laki-laki">Laki-laki (L)</option>
                    <option value="Perempuan">Perempuan (P)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agama
                  </label>
                  <select
                    value={formData.agama || 'Islam'}
                    onChange={(e) => setFormData({ ...formData, agama: e.target.value as Agama })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Row 3: TTL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    placeholder="Contoh: Jakarta"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Kelas, Jurusan, Tahun Ajaran */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas / Rombel *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    placeholder="Contoh: X-MIPA-1"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jurusan / Peminatan
                  </label>
                  <input
                    type="text"
                    value={formData.jurusan}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                    placeholder="Contoh: MIPA, IPS, TKJ, RPL"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={formData.tahunAjaran}
                    onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                    placeholder="Contoh: 2026/2027"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Alamat Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Tempat Tinggal
                </label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Row 6: Orang Tua & No HP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={formData.namaOrangTua}
                    onChange={(e) => setFormData({ ...formData, namaOrangTua: e.target.value })}
                    placeholder="Nama ayah / ibu / wali murid"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Telepon / HP
                  </label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    placeholder="Contoh: 081298761234"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 7: Status Siswa & Keterangan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Siswa *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Pindah Masuk">Pindah Masuk</option>
                    <option value="Pindah Keluar">Pindah Keluar</option>
                    <option value="Lulus">Lulus</option>
                    <option value="Keluar Sekolah">Keluar Sekolah (DO/Berhenti)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keterangan Lain
                  </label>
                  <input
                    type="text"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    placeholder="Catatan khusus, nomor SK, dsb."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingStudent ? 'Simpan Perubahan' : 'Tambahkan Siswa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Detail Lengkap Siswa */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <span className="text-xs font-mono text-blue-700 font-semibold">
                  NIS: {detailStudent.nis} · NISN: {detailStudent.nisn}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {detailStudent.namaLengkap}
                </h3>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Bio summary grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Kelas & Jurusan</span>
                  <span className="font-semibold text-slate-800">{detailStudent.kelas} ({detailStudent.jurusan})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Tahun Ajaran</span>
                  <span className="font-semibold text-slate-800 font-mono">{detailStudent.tahunAjaran}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Status Siswa</span>
                  <span className="font-semibold text-blue-700">{detailStudent.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Tempat, Tanggal Lahir</span>
                  <span className="text-slate-700">{detailStudent.tempatLahir}, {formatTanggalIndo(detailStudent.tanggalLahir)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Jenis Kelamin & Agama</span>
                  <span className="text-slate-700 font-medium">
                    {detailStudent.jenisKelamin} ({detailStudent.agama || 'Islam'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">No. Telepon / HP</span>
                  <span className="text-slate-700 font-mono">{detailStudent.noHp || '-'}</span>
                </div>
              </div>

              {/* Parents & Address */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-700">Alamat Tempat Tinggal:</span>
                    <p className="text-slate-600">{detailStudent.alamat || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-700">Orang Tua / Wali:</span>
                    <p className="text-slate-600">{detailStudent.namaOrangTua || '-'}</p>
                  </div>
                </div>
                {detailStudent.keterangan && (
                  <div className="rounded bg-blue-50/50 p-2.5 text-slate-700 border border-blue-100">
                    <strong className="text-blue-900">Catatan Khusus:</strong> {detailStudent.keterangan}
                  </div>
                )}
              </div>

              {/* Related Achievements */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span>Riwayat Prestasi Siswa ({achievements.filter(a => a.nis === detailStudent.nis).length})</span>
                </h4>
                {achievements.filter(a => a.nis === detailStudent.nis).length === 0 ? (
                  <p className="text-slate-400 italic">Belum ada catatan kejuaraan / prestasi.</p>
                ) : (
                  <div className="space-y-2">
                    {achievements.filter(a => a.nis === detailStudent.nis).map(a => (
                      <div key={a.id} className="rounded border border-slate-100 bg-slate-50 p-2.5">
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span>{a.namaKejuaraan}</span>
                          <span className="text-purple-700">{a.peringkat}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Tingkat {a.tingkat} · {formatTanggalIndo(a.tanggalPerolehan)} · {a.penyelenggara}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Scholarships */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span>Riwayat Beasiswa Siswa ({scholarships.filter(s => s.nis === detailStudent.nis).length})</span>
                </h4>
                {scholarships.filter(s => s.nis === detailStudent.nis).length === 0 ? (
                  <p className="text-slate-400 italic">Belum ada catatan penerimaan beasiswa.</p>
                ) : (
                  <div className="space-y-2">
                    {scholarships.filter(s => s.nis === detailStudent.nis).map(s => (
                      <div key={s.id} className="rounded border border-slate-100 bg-slate-50 p-2.5">
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span>{s.namaBeasiswa}</span>
                          <span className="text-emerald-700 font-mono">Rp {s.besaranNilai.toLocaleString('id-ID')}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Sumber: {s.sumber} ({s.jenis}) · Periode: {s.periode} · Status: {s.status}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 flex justify-end">
              <button
                onClick={() => setDetailStudent(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
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
