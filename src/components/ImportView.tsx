import React, { useState } from 'react';
import { 
  UploadCloud, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Check, 
  RefreshCw, 
  Info,
  HelpCircle
} from 'lucide-react';
import { 
  TEMPLATES_CONFIG, 
  downloadTemplateXLSX, 
  downloadTemplateCSV 
} from '../utils/excelTemplates';
import { 
  parseSpreadsheetFile, 
  validateStudentsImport, 
  validateAchievementsImport, 
  validateScholarshipsImport, 
  validateIncomingImport, 
  validateOutgoingImport,
  validateTracerImport
} from '../utils/excelImporter';
import { 
  Student, 
  Achievement, 
  Scholarship, 
  IncomingMutation, 
  OutgoingMutation,
  TracerStudy, 
  ImportSummary 
} from '../types/kesiswaan';

interface ImportViewProps {
  students: Student[];
  onCommitImportStudents: (newStudents: Student[]) => void;
  onCommitImportAchievements: (newAchievements: Achievement[]) => void;
  onCommitImportScholarships: (newScholarships: Scholarship[]) => void;
  onCommitImportIncoming: (newMutations: IncomingMutation[]) => void;
  onCommitImportOutgoing: (newMutations: OutgoingMutation[]) => void;
  onCommitImportTracer?: (newTracer: TracerStudy[]) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({
  students,
  onCommitImportStudents,
  onCommitImportAchievements,
  onCommitImportScholarships,
  onCommitImportIncoming,
  onCommitImportOutgoing,
  onCommitImportTracer,
}) => {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('students');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<ImportSummary<any> | null>(null);
  const [commitSuccessMessage, setCommitSuccessMessage] = useState<string | null>(null);

  const currentTemplate = TEMPLATES_CONFIG[selectedTemplateKey];

  // Handle file select
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setValidationResult(null);
    setCommitSuccessMessage(null);
    setIsProcessing(true);

    try {
      const rawRows = await parseSpreadsheetFile(file);
      if (rawRows.length === 0) {
        alert('Berkas kosong atau format baris tidak terbaca.');
        setIsProcessing(false);
        return;
      }

      let summary: ImportSummary<any>;
      if (selectedTemplateKey === 'students') {
        summary = validateStudentsImport(rawRows, students);
      } else if (selectedTemplateKey === 'achievements') {
        summary = validateAchievementsImport(rawRows, students);
      } else if (selectedTemplateKey === 'scholarships') {
        summary = validateScholarshipsImport(rawRows, students);
      } else if (selectedTemplateKey === 'incoming') {
        summary = validateIncomingImport(rawRows);
      } else if (selectedTemplateKey === 'outgoing') {
        summary = validateOutgoingImport(rawRows, students);
      } else {
        summary = validateTracerImport(rawRows);
      }

      setValidationResult(summary);
    } catch (err: any) {
      console.error(err);
      alert(`Gagal membaca berkas: ${err?.message || 'Format tidak didukung'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Commit valid rows
  const handleCommitValid = () => {
    if (!validationResult) return;

    const validItems = validationResult.rows
      .filter(r => r.isValid)
      .map(r => r.data);

    if (validItems.length === 0) {
      alert('Tidak ada baris data valid yang dapat disimpan.');
      return;
    }

    if (selectedTemplateKey === 'students') {
      onCommitImportStudents(validItems as Student[]);
    } else if (selectedTemplateKey === 'achievements') {
      onCommitImportAchievements(validItems as Achievement[]);
    } else if (selectedTemplateKey === 'scholarships') {
      onCommitImportScholarships(validItems as Scholarship[]);
    } else if (selectedTemplateKey === 'incoming') {
      onCommitImportIncoming(validItems as IncomingMutation[]);
    } else if (selectedTemplateKey === 'outgoing') {
      onCommitImportOutgoing(validItems as OutgoingMutation[]);
    } else if (selectedTemplateKey === 'tracer' && onCommitImportTracer) {
      onCommitImportTracer(validItems as TracerStudy[]);
    }

    setCommitSuccessMessage(
      `Berhasil menyimpan ${validItems.length} baris data ke dalam sistem!`
    );
    setValidationResult(null);
    setUploadedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">
          Pusat Impor Data Berbasis Template Excel & CSV
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Unduh templat resmi berstandar sekolah, lengkapi data, lalu unggah untuk divalidasi baris demi baris sebelum disimpan permanen ke database
        </p>

        {/* Step indicator */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-white font-mono text-[10px] font-bold">1</span>
            <span className="font-semibold text-slate-800">Pilih & Unduh Templat</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-white font-mono text-[10px] font-bold">2</span>
            <span className="font-semibold text-slate-800">Isi Data Sesuai Format</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-white font-mono text-[10px] font-bold">3</span>
            <span className="font-semibold text-slate-800">Unggah & Validasi Baris</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white font-mono text-[10px] font-bold">4</span>
            <span className="font-semibold text-slate-800">Simpan ke Database</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {commitSuccessMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between text-xs text-emerald-800 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{commitSuccessMessage}</span>
          </div>
          <button
            onClick={() => setCommitSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-medium"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 5 Downloadable Template Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-600 tracking-wider uppercase">
          Langkah 1: Sediakan & Unduh Templat Excel (5 Pilihan Kategori)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.values(TEMPLATES_CONFIG).map((tpl) => {
            const isSelected = selectedTemplateKey === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  setSelectedTemplateKey(tpl.id);
                  setValidationResult(null);
                  setUploadedFile(null);
                }}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{tpl.title}</h4>
                  </div>
                  {isSelected && (
                    <span className="rounded bg-blue-700 text-white px-1.5 py-0.5 text-[10px] font-semibold">
                      Aktif
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                  {tpl.description}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 font-mono">{tpl.columns.length} Kolom</span>
                  <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => downloadTemplateXLSX(tpl.id)}
                      className="flex items-center gap-1 rounded bg-white border border-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-50 font-medium"
                      title="Unduh format Microsoft Excel .xlsx"
                    >
                      <Download className="h-3 w-3 text-emerald-600" />
                      <span>.XLSX</span>
                    </button>
                    <button
                      onClick={() => downloadTemplateCSV(tpl.id)}
                      className="flex items-center gap-1 rounded bg-white border border-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-50 font-medium"
                      title="Unduh format CSV"
                    >
                      <Download className="h-3 w-3 text-blue-600" />
                      <span>.CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Zone */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Langkah 2: Unggah Berkas untuk {currentTemplate.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Format yang didukung: <span className="font-mono font-semibold text-slate-700">.XLSX, .XLS, .CSV</span> (Maksimal 10 MB)
            </p>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50/20 transition-colors cursor-pointer text-center">
          <UploadCloud className="h-10 w-10 text-blue-600 mb-2" />
          <span className="text-xs font-semibold text-slate-800">
            {uploadedFile ? uploadedFile.name : 'Pilih atau Tarik Berkas Excel / CSV ke sini'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Sistem akan membaca dan memeriksa kesesuaian kolom secara otomatis
          </span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {isProcessing && (
          <div className="flex items-center justify-center gap-2 py-4 text-xs text-blue-700">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Sedang membaca dan memvalidasi baris demi baris...</span>
          </div>
        )}
      </div>

      {/* Validation Result Table */}
      {validationResult && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Hasil Validasi Berkas Impor</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tinjau baris yang berhasil divalidasi dan pesan kesalahan pada baris yang gagal
              </p>
            </div>

            {/* Validation Metrics Summary */}
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded bg-slate-100 px-2.5 py-1 font-mono text-slate-700">
                Total: <strong>{validationResult.totalRows}</strong>
              </span>
              <span className="rounded bg-emerald-100 px-2.5 py-1 font-mono text-emerald-800">
                Valid: <strong>{validationResult.validRows}</strong>
              </span>
              <span className="rounded bg-rose-100 px-2.5 py-1 font-mono text-rose-800">
                Galat: <strong>{validationResult.invalidRows}</strong>
              </span>
            </div>
          </div>

          {/* Validation Rows Table */}
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-100 z-10 border-b border-slate-200">
                  <tr className="text-[11px] font-semibold text-slate-600">
                    <th className="px-3 py-2 w-16 text-center">Baris</th>
                    <th className="px-3 py-2">Identitas Baris</th>
                    <th className="px-3 py-2 w-28 text-center">Status</th>
                    <th className="px-3 py-2">Keterangan / Pesan Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {validationResult.rows.map((row) => (
                    <tr
                      key={row.rowNumber}
                      className={row.isValid ? 'bg-emerald-50/20' : 'bg-rose-50/40'}
                    >
                      <td className="px-3 py-2 text-center font-mono text-slate-500">
                        #{row.rowNumber}
                      </td>
                      <td className="px-3 py-2 font-mono">
                        <span className="font-semibold text-slate-800">
                          {row.data.nis || (row.data as any).namaLengkap || (row.data as any).namaKejuaraan || '-'}
                        </span>
                        {(row.data as any).namaLengkap && (
                          <span className="text-slate-500 block text-[11px]">{(row.data as any).namaLengkap}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {row.isValid ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-semibold">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Valid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-100 text-rose-800 px-2 py-0.5 text-[11px] font-semibold">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Galat</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {row.isValid ? (
                          <span className="text-emerald-700 text-[11px]">
                            Data lengkap dan siap diimpor.
                          </span>
                        ) : (
                          <ul className="text-rose-700 text-[11px] list-disc list-inside space-y-0.5">
                            {row.errors.map((err, errIdx) => (
                              <li key={errIdx}>{err}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-500">
              {validationResult.invalidRows > 0 ? (
                <span>Hanya baris valid (<strong className="text-emerald-700 font-mono">{validationResult.validRows} baris</strong>) yang akan dimasukkan ke sistem.</span>
              ) : (
                <span className="text-emerald-700 font-medium">Seluruh baris valid dan siap disimpan sekaligus!</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setValidationResult(null);
                  setUploadedFile(null);
                }}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleCommitValid}
                disabled={validationResult.validRows === 0}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                <span>Simpan {validationResult.validRows} Data Valid</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
