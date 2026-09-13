import React, { useState } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { 
  Shirt, 
  Bell, 
  Wifi, 
  WifiOff, 
  Download, 
  UserCheck, 
  ChevronDown, 
  Check, 
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenNewTx: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTx, setActiveTab }) => {
  const { 
    userRole, 
    setUserRole, 
    currentStaffName, 
    setCurrentStaffName,
    activeStudentId,
    setActiveStudentId,
    students,
    staff,
    isOnline, 
    isInstallable, 
    promptInstallApp,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData
  } = useLaundry();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.dibaca).length;
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'santri') {
      setActiveTab('santri_portal');
    } else if (role === 'petugas') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(userRole === 'santri' ? 'santri_portal' : 'dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">Laundry Pesantren</span>
                <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">PWA</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Sistem Operasional Laundry Santri Internal</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Online / Offline status */}
            <div 
              className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
              }`}
              title={isOnline ? 'Terhubung ke server online' : 'Mode Offline aktif'}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span className="hidden md:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  <span>Offline</span>
                </>
              )}
            </div>

            {/* PWA Install Button if available */}
            {isInstallable && (
              <button
                id="btn-install-pwa"
                onClick={promptInstallApp}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            )}

            {/* Quick new transaction for Petugas or Admin */}
            {userRole !== 'santri' && (
              <button
                id="btn-nav-new-tx"
                onClick={onOpenNewTx}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-semibold transition shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden xs:inline">Catat Masuk</span>
                <span className="xs:hidden">+ Masuk</span>
              </button>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="btn-notifications-toggle"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifDropdown && (
                <div 
                  id="notifications-dropdown"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-900">Notifikasi Internal</span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] bg-rose-100 text-rose-800 font-medium px-1.5 py-0.5 rounded-full">
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Belum ada notifikasi
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.tipe === 'bermasalah') setActiveTab('masalah');
                            else if (notif.tipe === 'selesai') setActiveTab('siap_diambil');
                            setShowNotifDropdown(false);
                          }}
                          className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition flex items-start space-x-3 ${
                            !notif.dibaca ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="mt-0.5">
                            {notif.tipe === 'bermasalah' && (
                              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4" />
                              </div>
                            )}
                            {notif.tipe === 'selesai' && (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                            {notif.tipe === 'diterima' && (
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Shirt className="w-4 h-4" />
                              </div>
                            )}
                            {notif.tipe === 'belum_diambil' && (
                              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900">{notif.judul}</p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.pesan}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                          {!notif.dibaca && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleModal(!showRoleModal)}
                className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-800 text-xs font-medium"
              >
                <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {userRole === 'admin' ? 'AD' : userRole === 'petugas' ? 'PT' : 'ST'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold leading-none">
                    {userRole === 'admin' ? 'Admin' : userRole === 'petugas' ? 'Petugas' : 'Santri'}
                  </div>
                  <div className="text-xs font-medium text-slate-900 truncate max-w-[110px]">
                    {userRole === 'admin' ? 'Ustadz Fauzan' : userRole === 'petugas' ? currentStaffName.split(' ')[0] + ' ' + (currentStaffName.split(' ')[1] || '') : currentStudent?.namaLengkap.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleModal && (
                <div 
                  id="role-switch-dropdown"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">Ganti Role Pengguna (Demo)</p>
                    <p className="text-[11px] text-slate-500">Pilih peran untuk menguji hak akses sistem</p>
                  </div>

                  <div className="space-y-1 mt-1">
                    {/* Role Admin */}
                    <button
                      onClick={() => {
                        handleSelectRole('admin');
                        setShowRoleModal(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition ${
                        userRole === 'admin' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                          AD
                        </div>
                        <div>
                          <p className="text-xs font-semibold">1. Admin Pondok</p>
                          <p className="text-[10px] text-slate-500">Ustadz Fauzan (Akses Semua Fitur)</p>
                        </div>
                      </div>
                      {userRole === 'admin' && <UserCheck className="w-4 h-4 text-emerald-600" />}
                    </button>

                    {/* Role Petugas */}
                    <button
                      onClick={() => {
                        handleSelectRole('petugas');
                        setShowRoleModal(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition ${
                        userRole === 'petugas' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          PT
                        </div>
                        <div>
                          <p className="text-xs font-semibold">2. Petugas Laundry</p>
                          <p className="text-[10px] text-slate-500">{currentStaffName} (Input & Update)</p>
                        </div>
                      </div>
                      {userRole === 'petugas' && <UserCheck className="w-4 h-4 text-emerald-600" />}
                    </button>

                    {/* Role Santri */}
                    <button
                      onClick={() => {
                        handleSelectRole('santri');
                        setShowRoleModal(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition ${
                        userRole === 'santri' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          ST
                        </div>
                        <div>
                          <p className="text-xs font-semibold">3. Santri</p>
                          <p className="text-[10px] text-slate-500">{currentStudent?.namaLengkap} (Lihat Status)</p>
                        </div>
                      </div>
                      {userRole === 'santri' && <UserCheck className="w-4 h-4 text-emerald-600" />}
                    </button>
                  </div>

                  {/* Sub-selector for staff identity if Petugas */}
                  {userRole === 'petugas' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                        Pilih Petugas Bertugas:
                      </label>
                      <select
                        value={currentStaffName}
                        onChange={(e) => setCurrentStaffName(e.target.value)}
                        className="w-full text-xs py-1 px-2 border border-slate-200 rounded-md bg-slate-50 text-slate-800"
                      >
                        {staff.map((s) => (
                          <option key={s.id} value={s.nama}>{s.nama} ({s.shift})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sub-selector for active student if Santri */}
                  {userRole === 'santri' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                        Login Sebagai Santri:
                      </label>
                      <select
                        value={activeStudentId}
                        onChange={(e) => setActiveStudentId(e.target.value)}
                        className="w-full text-xs py-1 px-2 border border-slate-200 rounded-md bg-slate-50 text-slate-800"
                      >
                        {students.slice(0, 8).map((s) => (
                          <option key={s.id} value={s.id}>{s.namaLengkap} - {s.kamar}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex justify-between">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setShowRoleModal(false);
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Data Demo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
