import React from 'react';
import { School, UserCheck, BookOpen, Menu, X, ShieldAlert } from 'lucide-react';
import { SchoolProfile, UserRole } from '../types/kesiswaan';

interface NavbarProps {
  schoolProfile: SchoolProfile;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenGuide: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  schoolProfile,
  currentRole,
  onRoleChange,
  onOpenGuide,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md md:px-8 no-print">
      {/* Zone 1: Single text element wordmark / Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm">
            <School className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">
              SIM-Kesiswaan
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
              Administrasi Kesiswaan Sekolah Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* Zone 2: School Year & Identity contextual info */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600">
        <span className="font-semibold text-slate-800">{schoolProfile.namaSekolah}</span>
        <span aria-hidden="true">·</span>
        <span>NPSN: <span className="font-mono">{schoolProfile.npsn}</span></span>
        <span aria-hidden="true">·</span>
        <span className="rounded bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
          TA {schoolProfile.tahunAjaranAktif} ({schoolProfile.semesterAktif})
        </span>
      </div>

      {/* Zone 3: 1 Primary Action & User Role Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Simulator */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-1 text-xs">
          <UserCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="hidden sm:inline text-slate-500">Peran:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="Petugas TU Kesiswaan">Petugas TU Kesiswaan</option>
            <option value="Kepala Sekolah">Kepala Sekolah</option>
            <option value="Guru BK / Wali Kelas">Guru BK / Wali Kelas</option>
          </select>
        </div>

        {/* Panduan Button */}
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          <BookOpen className="h-3.5 w-3.5 text-blue-600" />
          <span className="hidden sm:inline">Panduan SOP</span>
        </button>
      </div>
    </header>
  );
};
