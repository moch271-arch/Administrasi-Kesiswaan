import * as XLSX from 'xlsx';

export interface TemplateDefinition {
  id: string;
  title: string;
  filename: string;
  description: string;
  columns: string[];
  sampleRows: (string | number)[][];
  guideNotes: string[];
}

export const TEMPLATES_CONFIG: Record<string, TemplateDefinition> = {
  students: {
    id: 'students',
    title: 'Template 1: Data Utama Siswa',
    filename: 'template_data_utama_siswa',
    description: 'Format data induk pokok peserta didik sesuai standar Dapodik Kemdikbudristek.',
    columns: [
      'NIS',
      'NISN',
      'Nama Lengkap',
      'Tempat Lahir',
      'Tgl Lahir',
      'Jenis Kelamin',
      'Kelas',
      'Jurusan',
      'Tahun Ajaran',
      'Alamat',
      'Nama Orang Tua',
      'No. HP',
      'Status',
      'Keterangan',
    ],
    sampleRows: [
      [
        '240105',
        '0081234565',
        'Rizky Pratama Yudha',
        'Jakarta',
        '2008-04-12',
        'Laki-laki',
        'X-MIPA-1',
        'MIPA',
        '2026/2027',
        'Jl. Cempaka Putih Tengah No. 10',
        'Yudha Prawira',
        '081234567890',
        'Aktif',
        'Siswa Reguler Baru',
      ],
      [
        '240106',
        '0081234566',
        'Safira Nur Azizah',
        'Bandung',
        '2008-08-25',
        'Perempuan',
        'X-IPS-1',
        'IPS',
        '2026/2027',
        'Jl. Rawasari Selatan No. 5',
        'Ahmad Aziz',
        '081987654321',
        'Aktif',
        'Anggota Paskibra',
      ],
    ],
    guideNotes: [
      'NIS & NISN wajib diisi angka unik dan tidak boleh ganda.',
      'Format Tanggal Lahir: YYYY-MM-DD (Contoh: 2008-05-14).',
      'Jenis Kelamin: "Laki-laki" atau "Perempuan".',
      'Status: Aktif, Pindah Masuk, Pindah Keluar, Lulus, atau Keluar Sekolah.',
    ],
  },
  achievements: {
    id: 'achievements',
    title: 'Template 2: Siswa Berprestasi',
    filename: 'template_siswa_berprestasi',
    description: 'Format rekap perolehan juara lomba dan kejuaraan akademik maupun non-akademik.',
    columns: [
      'NIS',
      'Nama',
      'Kelas',
      'Jenis Prestasi',
      'Nama Kegiatan',
      'Tingkat',
      'Peringkat',
      'Tgl Perolehan',
      'Penyelenggara',
      'Keterangan',
    ],
    sampleRows: [
      [
        '230045',
        'Cantika Dewi Lestari',
        'XI-MIPA-2',
        'Akademik',
        'Olimpiade Sains Nasional Matematika',
        'Nasional',
        'Medali Emas (Juara 1)',
        '2026-08-15',
        'BPTI Kemendikbudristek',
        'Piagam & Sertifikat No. 451/OSN/2026',
      ],
      [
        '240103',
        'Budi Santoso Wibowo',
        'X-IPS-1',
        'Non-Akademik',
        'Kejuaraan Bulutangkis Pelajar DKI',
        'Provinsi',
        'Juara 1 Tunggal Putra',
        '2026-06-20',
        'Dispora DKI Jakarta',
        'Piala Tetap dan Beasiswa Pembinaan',
      ],
    ],
    guideNotes: [
      'NIS harus merujuk pada siswa yang sudah terdaftar di Data Utama.',
      'Jenis Prestasi: "Akademik" atau "Non-Akademik".',
      'Tingkat: Sekolah, Kecamatan, Kabupaten, Provinsi, Nasional, atau Internasional.',
      'Format Tgl Perolehan: YYYY-MM-DD.',
    ],
  },
  scholarships: {
    id: 'scholarships',
    title: 'Template 3: Siswa Penerima Beasiswa',
    filename: 'template_siswa_penerima_beasiswa',
    description: 'Format pencatatan bantuan dana pendidikan/beasiswa siswa.',
    columns: [
      'NIS',
      'Nama',
      'Kelas',
      'Nama Beasiswa',
      'Sumber',
      'Jenis',
      'Periode',
      'Besaran (Rp)',
      'Status',
      'Tgl Mulai',
      'Tgl Selesai',
      'Keterangan',
    ],
    sampleRows: [
      [
        '220013',
        'Hendra Wijaya Saputra',
        'XII-IPS-1',
        'Program Indonesia Pintar (PIP)',
        'Pemerintah',
        'Bantuan Biaya',
        'Tahun 2026',
        1800000,
        'Disetujui',
        '2026-01-01',
        '2026-12-31',
        'SK Kemdikbud Tahap 1',
      ],
      [
        '230046',
        'Eka Nurhaliza Salsabila',
        'XI-IPS-2',
        'KJP Plus Tahap 1',
        'Pemerintah',
        'Bantuan Biaya',
        'Semester Ganjil 2026/2027',
        2520000,
        'Disetujui',
        '2026-07-01',
        '2026-12-31',
        'Bantuan Kartu Jakarta Pintar Pemprov DKI',
      ],
    ],
    guideNotes: [
      'NIS harus sesuai dengan data siswa di Data Utama.',
      'Sumber: Pemerintah, Swasta, Yayasan, Sekolah, atau Lainnya.',
      'Jenis: Penuh, Sebagian, atau Bantuan Biaya.',
      'Besaran (Rp): Hanya masukkan angka bulat tanpa titik/koma (Contoh: 1800000).',
      'Status: Diajukan, Disetujui, Ditolak, atau Selesai.',
    ],
  },
  incoming: {
    id: 'incoming',
    title: 'Template 4: Mutasi Masuk',
    filename: 'template_mutasi_masuk',
    description: 'Format pencatatan permohonan siswa yang pindah masuk ke sekolah ini.',
    columns: [
      'NIS',
      'NISN',
      'Nama Lengkap',
      'Asal Sekolah',
      'No. Surat Masuk',
      'Tgl Surat',
      'Tgl Diterima',
      'Kelas Tujuan',
      'Alasan',
      'Petugas',
      'Status',
      'Keterangan',
    ],
    sampleRows: [
      [
        '240107',
        '0081234567',
        'Naufal Azka Prasetyo',
        'SMA Negeri 2 Yogyakarta',
        '421.3/288/SMAN2/2026',
        '2026-07-05',
        '2026-07-16',
        'X-MIPA-2',
        'Ikut mutasi dinas orang tua',
        'Siti Rahmawati, S.AP.',
        'Diterima',
        'Berkas Rapor Lengkap & SK Domisili',
      ],
      [
        '240109',
        '0081234570',
        'Tiara Putri Maharani',
        'SMA Swasta Al-Azhar 1',
        '105/SMAA/P/2026',
        '2026-08-01',
        '2026-08-10',
        'X-IPS-1',
        'Dekat dengan rumah keluarga baru',
        'Siti Rahmawati, S.AP.',
        'Dalam Proses',
        'Menunggu rekomendasi Suku Dinas Pendidikan',
      ],
    ],
    guideNotes: [
      'NIS: Isikan nomor induk yang dialokasikan sekolah ini.',
      'Format Tanggal: YYYY-MM-DD.',
      'Status: Diterima, Dalam Proses, atau Ditolak.',
      'Catatan Sistem: Mutasi dengan status "Diterima" otomatis terhubung ke Data Utama Siswa (status: Pindah Masuk).',
    ],
  },
  outgoing: {
    id: 'outgoing',
    title: 'Template 5: Mutasi Keluar',
    filename: 'template_mutasi_keluar',
    description: 'Format pencatatan permohonan siswa yang pindah keluar dari sekolah ini.',
    columns: [
      'NIS',
      'NISN',
      'Nama Lengkap',
      'Kelas Asal',
      'Tujuan Sekolah',
      'No. Surat Keluar',
      'Tgl Ajuan',
      'Tgl Keluar',
      'Alasan',
      'Administrasi',
      'Petugas',
      'Status',
      'Keterangan',
    ],
    sampleRows: [
      [
        '220011',
        '0063456787',
        'Fajar Siddiq Al-Banjari',
        'XII-MIPA-1',
        'SMA Negeri 3 Banjarmasin',
        '421.3/SKP-044/SMAN1/2026',
        '2026-08-10',
        '2026-08-18',
        'Mengikuti orang tua pindah tugas',
        'Lunas & Bebas Perpustakaan',
        'Drs. H. Bambang Sudarsono, M.Pd.',
        'Selesai',
        'Surat pindah resmi telah diserahkan',
      ],
      [
        '230055',
        '0072345688',
        'Reza Pahlevi Tanjung',
        'XI-IPS-1',
        'SMA Negeri 1 Medan',
        '421.3/SKP-058/SMAN1/2026',
        '2026-10-02',
        '2026-10-15',
        'Keluarga pindah domisili',
        'Lunas',
        'Drs. H. Bambang Sudarsono, M.Pd.',
        'Disetujui',
        'Tanda tangan kepala sekolah terbit',
      ],
    ],
    guideNotes: [
      'NIS harus merupakan siswa terdaftar di sekolah ini.',
      'Format Tanggal: YYYY-MM-DD.',
      'Administrasi: Keterangan pelunasan SPP, seragam, dan buku perpustakaan.',
      'Status: Diajukan, Disetujui, atau Selesai.',
      'Catatan Sistem: Saat status mutasi disimpan sebagai "Disetujui" atau "Selesai", status siswa di Data Utama otomatis berubah menjadi "Pindah Keluar".',
    ],
  },
  tracer: {
    id: 'tracer',
    title: 'Template 6: Tracer Study Alumni',
    filename: 'template_tracer_study_alumni',
    description: 'Format penelusuran tamatan alumni (Bekerja, Kuliah/Melanjutkan, Wirausaha - BMW).',
    columns: [
      'NIS',
      'NISN',
      'Nama Lengkap',
      'Tahun Lulus',
      'Jurusan Asal',
      'Status Tracer',
      'Nama Kampus / Perusahaan / Usaha',
      'Prodi / Posisi Jabatan',
      'Keselarasan Jurusan',
      'Rentang Penghasilan',
      'No. WhatsApp',
      'Email',
      'Keterangan',
    ],
    sampleRows: [
      [
        '210088',
        '0054567890',
        'Kevin Sanjaya Pratama',
        '2026',
        'MIPA',
        'Kuliah',
        'Institut Teknologi Bandung (ITB)',
        'S1 Teknik Informatika',
        'Linear',
        '-',
        '081255667788',
        'kevin@alumni.itb.ac.id',
        'Jalur SNBP 2026',
      ],
      [
        '200034',
        '0041238910',
        'Rian Hidayat Santoso',
        '2025',
        'RPL / Kejuruan',
        'Bekerja',
        'PT Bank Central Asia Tbk',
        'Junior Software Developer',
        'Linear',
        '5 - 8 Juta',
        '085711223399',
        'rian@bca.co.id',
        'Masa tunggu kerja 2 bulan',
      ],
    ],
    guideNotes: [
      'Tahun Lulus: Tahun kelulusan 4 digit (Contoh: 2025, 2026).',
      'Status Tracer: "Bekerja", "Kuliah", "Wirausaha", "Bekerja & Kuliah", atau "Mencari Kerja".',
      'Keselarasan Jurusan: "Linear", "Tidak Linear", atau "Belum Relevan".',
      'Nomor WhatsApp & Email aktif untuk komunikasi ikatan alumni.',
    ],
  },
};

/**
 * Downloads template as XLSX file
 */
export function downloadTemplateXLSX(templateKey: string) {
  const tpl = TEMPLATES_CONFIG[templateKey];
  if (!tpl) return;

  const worksheetData = [tpl.columns, ...tpl.sampleRows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto column widths
  const colWidths = tpl.columns.map((col, index) => {
    let maxLen = col.length;
    tpl.sampleRows.forEach(row => {
      const val = row[index] != null ? String(row[index]) : '';
      if (val.length > maxLen) maxLen = val.length;
    });
    return { wch: Math.max(maxLen + 4, 12) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template_Data');

  // Add Guide sheet
  const guideData = [
    ['PANDUAN PENGISIAN ' + tpl.title.toUpperCase()],
    [''],
    ...tpl.guideNotes.map((note, i) => [`${i + 1}. ${note}`]),
  ];
  const guideSheet = XLSX.utils.aoa_to_sheet(guideData);
  XLSX.utils.book_append_sheet(workbook, guideSheet, 'Petunjuk_Pengisian');

  XLSX.writeFile(workbook, `${tpl.filename}.xlsx`);
}

/**
 * Downloads template as CSV file with UTF-8 BOM
 */
export function downloadTemplateCSV(templateKey: string) {
  const tpl = TEMPLATES_CONFIG[templateKey];
  if (!tpl) return;

  const escapeCell = (val: string | number) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headerLine = tpl.columns.map(escapeCell).join(',');
  const rowLines = tpl.sampleRows.map(row => row.map(escapeCell).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tpl.filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
