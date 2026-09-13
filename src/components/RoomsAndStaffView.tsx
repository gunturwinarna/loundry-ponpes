import React, { useState } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { Home, Users, Plus, X, Check } from 'lucide-react';

export const RoomsAndStaffView: React.FC = () => {
  const { rooms, staff, addRoom, addStaff } = useLaundry();

  const [activeTab, setActiveTab] = useState<'rooms' | 'staff'>('rooms');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  // Room Form
  const [namaKamar, setNamaKamar] = useState('');
  const [namaAsrama, setNamaAsrama] = useState('Asrama Al-Ghazali');
  const [kapasitas, setKapasitas] = useState(8);
  const [keterangan, setKeterangan] = useState('');

  // Staff Form
  const [namaStaff, setNamaStaff] = useState('');
  const [noHpStaff, setNoHpStaff] = useState('');
  const [shiftStaff, setShiftStaff] = useState<'Pagi' | 'Sore' | 'Full Time'>('Pagi');

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKamar) return;
    await addRoom({
      namaKamar,
      namaAsrama,
      kapasitas,
      keterangan
    });
    setShowRoomModal(false);
    setNamaKamar('');
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaStaff) return;
    await addStaff({
      nama: namaStaff,
      noHp: noHpStaff,
      shift: shiftStaff,
      status: 'Aktif'
    });
    setShowStaffModal(false);
    setNamaStaff('');
    setNoHpStaff('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Pengelolaan Kamar, Asrama & Petugas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data master lokasi asrama santri dan daftar petugas operasional laundry.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'rooms' ? (
            <button
              onClick={() => setShowRoomModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kamar</span>
            </button>
          ) : (
            <button
              onClick={() => setShowStaffModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Petugas</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'rooms'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Data Kamar & Asrama ({rooms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'staff'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Petugas Laundry ({staff.length})</span>
        </button>
      </div>

      {/* Content: Rooms Tab */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                  {room.id}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Kapasitas: {room.kapasitas} santri
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{room.namaKamar}</h3>
              <p className="text-xs text-slate-600 font-medium">{room.namaAsrama}</p>
              {room.keterangan && (
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  {room.keterangan}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content: Staff Tab */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                  {s.id}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Shift {s.shift}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">{s.nama}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{s.noHp}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Status Petugas:</span>
                <span className="font-bold text-emerald-700">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Room */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-emerald-700 text-white">
              <h2 className="text-base font-bold">Tambah Kamar / Asrama</h2>
              <button onClick={() => setShowRoomModal(false)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoom} className="p-5 space-y-3.5 text-xs text-slate-800">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Kamar:</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kamar Ali 02"
                  value={namaKamar}
                  onChange={(e) => setNamaKamar(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Asrama:</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Asrama Al-Ghazali"
                  value={namaAsrama}
                  onChange={(e) => setNamaAsrama(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Kapasitas (Santri):</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={kapasitas}
                  onChange={(e) => setKapasitas(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Keterangan (Opsional):</label>
                <input
                  type="text"
                  placeholder="Misal: Lantai 2 Sayap Timur"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Simpan Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Staff */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-emerald-700 text-white">
              <h2 className="text-base font-bold">Tambah Petugas Laundry</h2>
              <button onClick={() => setShowStaffModal(false)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-5 space-y-3.5 text-xs text-slate-800">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Petugas:</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kang Wahyu Pratama"
                  value={namaStaff}
                  onChange={(e) => setNamaStaff(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nomor Kontak / WhatsApp:</label>
                <input
                  type="text"
                  required
                  placeholder="0821xxxxxxxx"
                  value={noHpStaff}
                  onChange={(e) => setNoHpStaff(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Shift Kerja:</label>
                <select
                  value={shiftStaff}
                  onChange={(e) => setShiftStaff(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Pagi">Pagi (07:00 - 15:00)</option>
                  <option value="Sore">Sore (13:00 - 21:00)</option>
                  <option value="Full Time">Full Time</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
