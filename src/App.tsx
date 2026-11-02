/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  SchoolProfile, 
  Student, 
  Achievement, 
  Scholarship, 
  IncomingMutation, 
  OutgoingMutation, 
  TracerStudy,
  ActiveTab, 
  UserRole 
} from './types/kesiswaan';
import { 
  initialSchoolProfile, 
  initialStudents, 
  initialAchievements, 
  initialScholarships, 
  initialIncomingMutations, 
  initialOutgoingMutations,
  initialTracerStudies 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { AchievementsView } from './components/AchievementsView';
import { ScholarshipsView } from './components/ScholarshipsView';
import { IncomingMutationsView } from './components/IncomingMutationsView';
import { OutgoingMutationsView } from './components/OutgoingMutationsView';
import { TracerStudyView } from './components/TracerStudyView';
import { ImportView } from './components/ImportView';
import { ExportView } from './components/ExportView';
import { ReportsPrintView } from './components/ReportsPrintView';
import { SettingsView } from './components/SettingsView';
import { HelpView } from './components/HelpView';

export default function App() {
  // Persistence Keys
  const STORAGE_KEYS = {
    PROFILE: 'sim_kesiswaan_profile',
    STUDENTS: 'sim_kesiswaan_students',
    ACHIEVEMENTS: 'sim_kesiswaan_achievements',
    SCHOLARSHIPS: 'sim_kesiswaan_scholarships',
    INCOMING: 'sim_kesiswaan_incoming',
    OUTGOING: 'sim_kesiswaan_outgoing',
    TRACER: 'sim_kesiswaan_tracer',
  };

  // State initialization with localStorage fallback
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : initialSchoolProfile;
    } catch {
      return initialSchoolProfile;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : initialAchievements;
    } catch {
      return initialAchievements;
    }
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS);
      return saved ? JSON.parse(saved) : initialScholarships;
    } catch {
      return initialScholarships;
    }
  });

  const [incomingMutations, setIncomingMutations] = useState<IncomingMutation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCOMING);
      return saved ? JSON.parse(saved) : initialIncomingMutations;
    } catch {
      return initialIncomingMutations;
    }
  });

  const [outgoingMutations, setOutgoingMutations] = useState<OutgoingMutation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OUTGOING);
      return saved ? JSON.parse(saved) : initialOutgoingMutations;
    } catch {
      return initialOutgoingMutations;
    }
  });

  const [tracerStudies, setTracerStudies] = useState<TracerStudy[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRACER);
      return saved ? JSON.parse(saved) : initialTracerStudies;
    } catch {
      return initialTracerStudies;
    }
  });

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('Petugas TU Kesiswaan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCOMING, JSON.stringify(incomingMutations));
  }, [incomingMutations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OUTGOING, JSON.stringify(outgoingMutations));
  }, [outgoingMutations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRACER, JSON.stringify(tracerStudies));
  }, [tracerStudies]);

  // Student Handlers
  const handleSaveStudent = (studentToSave: Student) => {
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === studentToSave.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = studentToSave;
        return updated;
      }
      return [studentToSave, ...prev];
    });
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Achievement Handlers
  const handleSaveAchievement = (ach: Achievement) => {
    setAchievements(prev => {
      const idx = prev.findIndex(a => a.id === ach.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = ach;
        return updated;
      }
      return [ach, ...prev];
    });
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  // Scholarship Handlers
  const handleSaveScholarship = (sch: Scholarship) => {
    setScholarships(prev => {
      const idx = prev.findIndex(s => s.id === sch.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = sch;
        return updated;
      }
      return [sch, ...prev];
    });
  };

  const handleDeleteScholarship = (id: string) => {
    setScholarships(prev => prev.filter(s => s.id !== id));
  };

  // Incoming Mutation Handlers & Auto-Sync
  const handleSaveIncomingMutation = (mut: IncomingMutation, syncToStudentMaster = true) => {
    setIncomingMutations(prev => {
      const idx = prev.findIndex(m => m.id === mut.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = mut;
        return updated;
      }
      return [mut, ...prev];
    });

    if (syncToStudentMaster && mut.status === 'Diterima') {
      handleSyncIncomingToStudent(mut);
    }
  };

  const handleSyncIncomingToStudent = (mut: IncomingMutation) => {
    setStudents(prev => {
      const existingIdx = prev.findIndex(s => s.nis.trim() === mut.nis.trim());
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          status: 'Pindah Masuk',
          kelas: mut.kelasTujuan,
          jurusan: mut.jurusanTujuan || updated[existingIdx].jurusan,
          keterangan: `Pindahan dari ${mut.asalSekolah} (No. Surat: ${mut.nomorSuratPindah})`,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      } else {
        const newStudent: Student = {
          id: `std-${Date.now()}`,
          nis: mut.nis,
          nisn: mut.nisn || `00${Date.now().toString().slice(-8)}`,
          namaLengkap: mut.namaLengkap,
          tempatLahir: 'Kota Asal',
          tanggalLahir: '2008-01-01',
          jenisKelamin: 'Laki-laki',
          kelas: mut.kelasTujuan,
          jurusan: mut.jurusanTujuan || 'MIPA',
          tahunAjaran: schoolProfile.tahunAjaranAktif,
          alamat: mut.alamatSekolahAsal || '-',
          namaOrangTua: '-',
          noHp: '-',
          status: 'Pindah Masuk',
          keterangan: `Pindahan masuk dari ${mut.asalSekolah}. No Surat: ${mut.nomorSuratPindah}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [newStudent, ...prev];
      }
    });
  };

  const handleDeleteIncomingMutation = (id: string) => {
    setIncomingMutations(prev => prev.filter(m => m.id !== id));
  };

  // Outgoing Mutation Handlers & Auto-Transition
  const handleSaveOutgoingMutation = (mut: OutgoingMutation, autoTransitionStudent = true) => {
    setOutgoingMutations(prev => {
      const idx = prev.findIndex(m => m.id === mut.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = mut;
        return updated;
      }
      return [mut, ...prev];
    });

    if (autoTransitionStudent && (mut.status === 'Disetujui' || mut.status === 'Selesai')) {
      handleApplyOutgoingTransition(mut);
    }
  };

  const handleApplyOutgoingTransition = (mut: OutgoingMutation) => {
    setStudents(prev => {
      return prev.map(s => {
        if (s.nis.trim() === mut.nis.trim()) {
          return {
            ...s,
            status: 'Pindah Keluar',
            keterangan: `Mutasi keluar ke ${mut.tujuanSekolah} (No. Surat: ${mut.nomorSuratKeluar})`,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      });
    });
  };

  const handleDeleteOutgoingMutation = (id: string) => {
    setOutgoingMutations(prev => prev.filter(m => m.id !== id));
  };

  // Commit Import Batches
  const handleCommitImportStudents = (newStudents: Student[]) => {
    setStudents(prev => [...newStudents, ...prev]);
  };

  const handleCommitImportAchievements = (newAchievements: Achievement[]) => {
    setAchievements(prev => [...newAchievements, ...prev]);
  };

  const handleCommitImportScholarships = (newScholarships: Scholarship[]) => {
    setScholarships(prev => [...newScholarships, ...prev]);
  };

  const handleCommitImportIncoming = (newMutations: IncomingMutation[]) => {
    setIncomingMutations(prev => [...newMutations, ...prev]);
    // Also auto-sync accepted ones
    newMutations.forEach(m => {
      if (m.status === 'Diterima') {
        handleSyncIncomingToStudent(m);
      }
    });
  };

  const handleCommitImportOutgoing = (newMutations: OutgoingMutation[]) => {
    setOutgoingMutations(prev => [...newMutations, ...prev]);
    // Also auto-transition
    newMutations.forEach(m => {
      if (m.status === 'Disetujui' || m.status === 'Selesai') {
        handleApplyOutgoingTransition(m);
      }
    });
  };

  // Tracer Study Handlers
  const handleSaveTracerStudy = (item: TracerStudy) => {
    setTracerStudies(prev => {
      const idx = prev.findIndex(t => t.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = item;
        return updated;
      }
      return [item, ...prev];
    });
  };

  const handleDeleteTracerStudy = (id: string) => {
    setTracerStudies(prev => prev.filter(t => t.id !== id));
  };

  const handleCommitImportTracer = (newTracer: TracerStudy[]) => {
    setTracerStudies(prev => [...newTracer, ...prev]);
  };

  // Reset & Backup Data Handlers
  const handleResetData = () => {
    setSchoolProfile(initialSchoolProfile);
    setStudents(initialStudents);
    setAchievements(initialAchievements);
    setScholarships(initialScholarships);
    setIncomingMutations(initialIncomingMutations);
    setOutgoingMutations(initialOutgoingMutations);
    setTracerStudies(initialTracerStudies);
    alert('Data sistem berhasil dikembalikan ke data simulasi awal sekolah Indonesia.');
  };

  const handleExportBackupJSON = () => {
    const backupData = {
      version: '2.5',
      exportDate: new Date().toISOString(),
      schoolProfile,
      students,
      achievements,
      scholarships,
      incomingMutations,
      outgoingMutations,
      tracerStudies,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_kesiswaan_${schoolProfile.npsn}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackupJSON = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.schoolProfile) setSchoolProfile(data.schoolProfile);
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.achievements)) setAchievements(data.achievements);
      if (Array.isArray(data.scholarships)) setScholarships(data.scholarships);
      if (Array.isArray(data.incomingMutations)) setIncomingMutations(data.incomingMutations);
      if (Array.isArray(data.outgoingMutations)) setOutgoingMutations(data.outgoingMutations);
      if (Array.isArray(data.tracerStudies)) setTracerStudies(data.tracerStudies);
      alert('Data sistem kesiswaan berhasil dipulihkan dari berkas backup!');
    } catch (err: any) {
      alert(`Gagal memulihkan data: ${err?.message || 'Berkas tidak valid'}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        schoolProfile={schoolProfile}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenGuide={() => setActiveTab('guide')}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            students: students.length,
            achievements: achievements.length,
            scholarships: scholarships.length,
            incomingMutations: incomingMutations.length,
            outgoingMutations: outgoingMutations.length,
            tracerStudies: tracerStudies.length,
          }}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                schoolProfile={schoolProfile}
                students={students}
                achievements={achievements}
                scholarships={scholarships}
                incomingMutations={incomingMutations}
                outgoingMutations={outgoingMutations}
                tracerStudies={tracerStudies}
                onNavigate={setActiveTab}
                onOpenAddStudent={() => setActiveTab('students')}
                onOpenAddIncoming={() => setActiveTab('incoming_mutations')}
                onOpenAddOutgoing={() => setActiveTab('outgoing_mutations')}
              />
            )}

            {activeTab === 'students' && (
              <StudentsView
                students={students}
                achievements={achievements}
                scholarships={scholarships}
                incomingMutations={incomingMutations}
                outgoingMutations={outgoingMutations}
                onSaveStudent={handleSaveStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsView
                achievements={achievements}
                students={students}
                onSaveAchievement={handleSaveAchievement}
                onDeleteAchievement={handleDeleteAchievement}
              />
            )}

            {activeTab === 'scholarships' && (
              <ScholarshipsView
                scholarships={scholarships}
                students={students}
                onSaveScholarship={handleSaveScholarship}
                onDeleteScholarship={handleDeleteScholarship}
              />
            )}

            {activeTab === 'incoming_mutations' && (
              <IncomingMutationsView
                incomingMutations={incomingMutations}
                students={students}
                onSaveMutation={handleSaveIncomingMutation}
                onDeleteMutation={handleDeleteIncomingMutation}
                onSyncToStudent={handleSyncIncomingToStudent}
              />
            )}

            {activeTab === 'outgoing_mutations' && (
              <OutgoingMutationsView
                outgoingMutations={outgoingMutations}
                students={students}
                onSaveMutation={handleSaveOutgoingMutation}
                onDeleteMutation={handleDeleteOutgoingMutation}
                onApplyStatusTransition={handleApplyOutgoingTransition}
              />
            )}

            {activeTab === 'tracer_study' && (
              <TracerStudyView
                tracerStudies={tracerStudies}
                students={students}
                onSaveTracerStudy={handleSaveTracerStudy}
                onDeleteTracerStudy={handleDeleteTracerStudy}
              />
            )}

            {activeTab === 'import' && (
              <ImportView
                students={students}
                onCommitImportStudents={handleCommitImportStudents}
                onCommitImportAchievements={handleCommitImportAchievements}
                onCommitImportScholarships={handleCommitImportScholarships}
                onCommitImportIncoming={handleCommitImportIncoming}
                onCommitImportOutgoing={handleCommitImportOutgoing}
                onCommitImportTracer={handleCommitImportTracer}
              />
            )}

            {activeTab === 'export' && (
              <ExportView
                students={students}
                achievements={achievements}
                scholarships={scholarships}
                incomingMutations={incomingMutations}
                outgoingMutations={outgoingMutations}
                tracerStudies={tracerStudies}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPrintView
                schoolProfile={schoolProfile}
                students={students}
                achievements={achievements}
                scholarships={scholarships}
                incomingMutations={incomingMutations}
                outgoingMutations={outgoingMutations}
                tracerStudies={tracerStudies}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                schoolProfile={schoolProfile}
                onSaveProfile={setSchoolProfile}
                onResetData={handleResetData}
                onExportBackupJSON={handleExportBackupJSON}
                onRestoreBackupJSON={handleRestoreBackupJSON}
              />
            )}

            {activeTab === 'guide' && <HelpView />}
          </div>
        </main>
      </div>

      {/* Footer Aplikasi */}
      <footer className="border-t border-slate-200 bg-white py-3 px-4 md:px-8 text-xs text-slate-500 no-print shrink-0">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SIM-Kesiswaan</span>
            <span>·</span>
            <span>Sistem Informasi Manajemen Administrasi Kesiswaan</span>
          </div>
          <div className="text-slate-600">
            Created by <span className="font-bold text-slate-900">Moch. Angga Kurniawan, AMd Kom</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
