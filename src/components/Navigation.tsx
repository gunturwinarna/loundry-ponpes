import React from 'react';
import { useLaundry } from '../context/LaundryContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Home, 
  BarChart3, 
  Shirt,
  Search,
  PackageCheck
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewTx: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenNewTx 
}) => {
  const { userRole, transactions, issues } = useLaundry();

  const readyPickupCount = transactions.filter(t => t.status === 'siap_diambil').length;
  const inProcessCount = transactions.filter(t => 
    ['proses_sortir', 'dicuci', 'dikeringkan', 'disetrika'].includes(t.status)
  ).length;
  const activeIssuesCount = issues.filter(i => i.statusPenyelesaian !== 'Selesai / Diganti').length;

  // Navigation Items per Role
  const getNavItems = () => {
    if (userRole === 'santri') {
      return [
        { id: 'santri_portal', label: 'Laundry Saya', icon: Shirt, badge: null },
        { id: 'riwayat_santri', label: 'Riwayat Laundry', icon: PackageCheck, badge: null },
        { id: 'cari_laundry', label: 'Cari Laundry', icon: Search, badge: null },
      ];
    }

    if (userRole === 'petugas') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'proses', label: 'Proses Cuci', icon: RotateCw, badge: inProcessCount || null },
        { id: 'siap_diambil', label: 'Siap Diambil', icon: CheckCircle2, badge: readyPickupCount || null },
        { id: 'masalah', label: 'Bermasalah', icon: AlertTriangle, badge: activeIssuesCount || null },
        { id: 'santri', label: 'Data Santri', icon: Users, badge: null },
      ];
    }

    // Admin
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
      { id: 'proses', label: 'Proses Cuci', icon: RotateCw, badge: inProcessCount || null },
      { id: 'siap_diambil', label: 'Siap Diambil', icon: CheckCircle2, badge: readyPickupCount || null },
      { id: 'masalah', label: 'Bermasalah', icon: AlertTriangle, badge: activeIssuesCount || null },
      { id: 'santri', label: 'Data Santri', icon: Users, badge: null },
      { id: 'kamar_staff', label: 'Kamar & Petugas', icon: Home, badge: null },
      { id: 'laporan', label: 'Laporan', icon: BarChart3, badge: null },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 shrink-0">
        
        {/* Role Banner */}
        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Akses Sebagai:</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              userRole === 'admin' 
                ? 'bg-purple-100 text-purple-700' 
                : userRole === 'petugas'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {userRole.toUpperCase()}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
            {userRole === 'admin' ? 'Ustadz Fauzan (Admin)' : userRole === 'petugas' ? 'Petugas Operasional' : 'Portal Santri'}
          </p>
        </div>

        {/* Action Button for Staff / Admin */}
        {userRole !== 'santri' && (
          <button
            id="sidebar-btn-new-tx"
            onClick={onOpenNewTx}
            className="w-full mb-6 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-xs active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Laundry Baru</span>
          </button>
        )}

        {/* Navigation List */}
        <nav className="space-y-1 flex-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    item.id === 'masalah'
                      ? 'bg-rose-100 text-rose-700'
                      : item.id === 'siap_diambil'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom system footer */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          <p>Sistem Laundry Pesantren v1.0</p>
          <p className="mt-0.5">Offline-Ready PWA</p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg safe-area-pb">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition min-w-[56px] ${
                  isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 stroke-[2.2]' : 'text-slate-400'}`} />
                  {item.badge !== null && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 whitespace-nowrap leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
