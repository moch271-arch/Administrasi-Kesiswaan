import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  GraduationCap, 
  ArrowDownLeft, 
  ArrowUpRight, 
  UploadCloud, 
  DownloadCloud, 
  Printer, 
  Settings, 
  HelpCircle,
  Compass
} from 'lucide-react';
import { ActiveTab } from '../types/kesiswaan';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  counts: {
    students: number;
    achievements: number;
    scholarships: number;
    incomingMutations: number;
    outgoingMutations: number;
    tracerStudies: number;
  };
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  hint?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  counts,
  mobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const navItems: NavGroup[] = [
    {
      group: 'UTAMA',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students' as ActiveTab, label: 'Data Utama Siswa', icon: Users, count: counts.students },
      ],
    },
    {
      group: 'MODUL KHUSUS & ALUMNI',
      items: [
        { id: 'achievements' as ActiveTab, label: 'Siswa Berprestasi', icon: Trophy, count: counts.achievements },
        { id: 'scholarships' as ActiveTab, label: 'Penerima Beasiswa', icon: GraduationCap, count: counts.scholarships },
        { id: 'incoming_mutations' as ActiveTab, label: 'Mutasi Masuk', icon: ArrowDownLeft, count: counts.incomingMutations },
        { id: 'outgoing_mutations' as ActiveTab, label: 'Mutasi Keluar', icon: ArrowUpRight, count: counts.outgoingMutations },
        { id: 'tracer_study' as ActiveTab, label: 'Tracer Study Alumni', icon: Compass, count: counts.tracerStudies, hint: 'BMW' },
      ],
    },
    {
      group: 'INTEGRASI & LAPORAN',
      items: [
        { id: 'import' as ActiveTab, label: 'Impor Data Excel', icon: UploadCloud, hint: '6 Template' },
        { id: 'export' as ActiveTab, label: 'Ekspor Data', icon: DownloadCloud },
        { id: 'reports' as ActiveTab, label: 'Laporan & Cetak', icon: Printer, hint: 'KOP Surat' },
      ],
    },
    {
      group: 'SISTEM',
      items: [
        { id: 'settings' as ActiveTab, label: 'Pengaturan Sekolah', icon: Settings },
        { id: 'guide' as ActiveTab, label: 'Panduan & Bantuan', icon: HelpCircle },
      ],
    },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={onCloseMobileMenu}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white pt-16 md:pt-0 transition-transform duration-200 ease-in-out md:static md:translate-x-0 no-print ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((group) => (
            <div key={group.group}>
              <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-800 font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.hint && (
                          <span className="text-[10px] text-slate-400 hidden lg:inline">
                            {item.hint}
                          </span>
                        )}
                        {item.count !== undefined && (
                          <span
                            className={`rounded px-1.5 py-0.2 text-[11px] font-mono tabular-nums ${
                              isActive
                                ? 'bg-blue-200/70 text-blue-900'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* School Footer Badge */}
        <div className="border-t border-slate-100 p-3 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>Kemdikbud Standar</span>
            <span className="font-mono">v2.5</span>
          </div>
        </div>
      </aside>
    </>
  );
};
