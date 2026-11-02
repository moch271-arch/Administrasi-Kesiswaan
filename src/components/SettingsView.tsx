import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  UserCheck, 
  Shield 
} from 'lucide-react';
import { SchoolProfile } from '../types/kesiswaan';

interface SettingsViewProps {
  schoolProfile: SchoolProfile;
  onSaveProfile: (profile: SchoolProfile) => void;
  onResetData: () => void;
  onExportBackupJSON: () => void;
  onRestoreBackupJSON: (file: File) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  schoolProfile,
  onSaveProfile,
  onResetData,
  onExportBackupJSON,
  onRestoreBackupJSON,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>({ ...schoolProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (window.confirm('Pulihkan data dari berkas backup JSON? Data saat ini akan digantikan.')) {
        onRestoreBackupJSON(file);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">
          Pengaturan Identitas Sekolah & Sistem Kesiswaan
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola profil resmi sekolah, format KOP surat dinas, tahun ajaran aktif, dan pejabat penandatangan dokumen
        </p>
      </div>

      {saveSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Pengaturan profil sekolah berhasil disimpan! Seluruh KOP surat dan laporan telah dimutakhirkan.</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Profil Lembaga */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-700" />
            <span>Identitas Satuan Pendidikan & Dinas</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Instansi Pembina / Dinas Pendidikan (Baris 1 & 2 KOP) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.dinasPendidikan}
                onChange={(e) => setFormData({ ...formData, dinasPendidikan: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Cabang Dinas / Suku Dinas Pendidikan (Baris 3 KOP)
              </label>
              <input
                type="text"
                value={formData.cabangDinas}
                onChange={(e) => setFormData({ ...formData, cabangDinas: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Resmi Satuan Pendidikan (Sekolah) *
              </label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NPSN (Nomor Pokok Sekolah Nasional) *
              </label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NSS (Nomor Statistik Sekolah)
              </label>
              <input
                type="text"
                value={formData.nss}
                onChange={(e) => setFormData({ ...formData, nss: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Lengkap Sekolah *
              </label>
              <input
                type="text"
                required
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kota / Kabupaten *
              </label>
              <input
                type="text"
                required
                value={formData.kabupatenKota}
                onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Provinsi *
              </label>
              <input
                type="text"
                required
                value={formData.provinsi}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Telepon Kantor
              </label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Email Resmi Sekolah
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kalender Akademik & Pejabat */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-blue-700" />
            <span>Tahun Ajaran & Pejabat Penandatangan Laporan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tahun Ajaran Aktif *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 2026/2027"
                value={formData.tahunAjaranAktif}
                onChange={(e) => setFormData({ ...formData, tahunAjaranAktif: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Semester Aktif *
              </label>
              <select
                value={formData.semesterAktif}
                onChange={(e) => setFormData({ ...formData, semesterAktif: e.target.value as 'Ganjil' | 'Genap' })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Kepala Sekolah (Lengkap dengan Gelar) *
              </label>
              <input
                type="text"
                required
                value={formData.namaKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, namaKepalaSekolah: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Kepala Sekolah *
              </label>
              <input
                type="text"
                required
                value={formData.nipKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Petugas Urusan Kesiswaan *
              </label>
              <input
                type="text"
                required
                value={formData.namaPetugasKesiswaan}
                onChange={(e) => setFormData({ ...formData, namaPetugasKesiswaan: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Petugas Kesiswaan
              </label>
              <input
                type="text"
                value={formData.nipPetugasKesiswaan}
                onChange={(e) => setFormData({ ...formData, nipPetugasKesiswaan: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-800 transition-colors shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Section 3: Cadangan & Pemulihan Database */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-700" />
          <span>Cadangan (Backup) & Pemulihan Data Sistem</span>
        </h3>
        <p className="text-xs text-slate-500">
          Amankan seluruh data siswa, prestasi, beasiswa, dan mutasi ke dalam berkas cadangan JSON terenkripsi, atau kembalikan ke kondisi data simulasi awal.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={onExportBackupJSON}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 text-xs font-semibold transition-colors"
          >
            <Download className="h-4 w-4 text-blue-600" />
            <span>Unduh Backup JSON Lengkap</span>
          </button>

          <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer">
            <Upload className="h-4 w-4 text-emerald-600" />
            <span>Pulihkan dari File Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileRestore}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Reset semua data ke data simulasi awal sekolah Indonesia? Data yang baru diinput akan terhapus.')) {
                onResetData();
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="h-4 w-4 text-rose-600" />
            <span>Reset ke Data Sampel Bawaan</span>
          </button>
        </div>
      </div>

      {/* Informasi Pengembang */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Informasi Aplikasi & Pengembang
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 border-t border-slate-100 gap-1">
          <span className="text-slate-500">Sistem Aplikasi:</span>
          <span className="font-semibold text-slate-800">SIM-Kesiswaan Sekolah Indonesia (v2.5)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 border-t border-slate-100 gap-1">
          <span className="text-slate-500">Pengembang Sistem:</span>
          <span className="font-bold text-blue-700">CREATED BY MOCH. ANGGA KURNIAWAN, AMd Kom</span>
        </div>
      </div>
    </div>
  );
};
