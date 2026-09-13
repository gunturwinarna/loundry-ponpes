import React, { useState, useMemo } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { Student, LaundryTransaction } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Home, 
  BookOpen, 
  X, 
  Check, 
  Eye,
  Shirt,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface StudentsViewProps {
  onSelectTransaction: (tx: LaundryTransaction) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ onSelectTransaction }) => {
  const { students, rooms, transactions, addStudent, updateStudent, userRole } = useLaundry();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsrama, setSelectedAsrama] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Santri Form state
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nis, setNis] = useState('');
  const [kelas, setKelas] = useState('10 MA Keagamaan');
  const [kamar, setKamar] = useState(rooms[0]?.namaKamar || 'Kamar Abu Bakar 01');
  const [asrama, setAsrama] = useState(rooms[0]?.namaAsrama || 'Asrama Al-Ghazali');
  const [noWhatsapp, setNoWhatsapp] = useState('0812345678');

  // Unique asramas
  const asramas = useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => set.add(s.asrama));
    return Array.from(set);
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        s.namaLengkap.toLowerCase().includes(q) ||
        s.nis.includes(q) ||
        s.kamar.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q);
      const matchAsrama = selectedAsrama === 'all' || s.asrama === selectedAsrama;
      return matchQuery && matchAsrama;
    });
  }, [students, searchQuery, selectedAsrama]);

  // When a student is selected in detail modal, compute their stats
  const studentTxs = useMemo(() => {
    if (!selectedStudent) return [];
    return transactions.filter(t => t.studentId === selectedStudent.id || t.studentName === selectedStudent.namaLengkap);
  }, [selectedStudent, transactions]);

  const studentInProcess = studentTxs.filter(t => 
    ['diterima', 'proses_sortir', 'dicuci', 'dikeringkan', 'disetrika'].includes(t.status)
  );

  const studentReady = studentTxs.filter(t => t.status === 'siap_diambil');
  const studentCompleted = studentTxs.filter(t => t.status === 'sudah_diambil');
  const totalPakaianSantri = studentTxs.reduce((sum, t) => sum + (t.totalPakaian || 0), 0);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap || !nis) return;
    await addStudent({
      namaLengkap,
      nis,
      kelas,
      kamar,
      asrama,
      noWhatsapp,
      statusAktif: true
    });
    setShowAddModal(false);
    setNamaLengkap('');
    setNis('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Data Santri Pondok Pesantren
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data santri aktif, kamar, asrama, dan riwayat pemanfaatan fasilitas laundry.
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Santri Baru</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama santri, NIS, atau kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedAsrama}
            onChange={(e) => setSelectedAsrama(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white font-medium text-slate-700 w-full sm:w-auto"
          >
            <option value="all">Semua Asrama ({students.length})</option>
            {asramas.map(a => (
              <option key={a} value={a}>{a.replace('Asrama ', '')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table & Cards */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">ID & Nama Santri</th>
              <th className="py-3 px-3">NIS</th>
              <th className="py-3 px-3">Kelas</th>
              <th className="py-3 px-3">Kamar & Asrama</th>
              <th className="py-3 px-3">WhatsApp</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((santri) => (
              <tr 
                key={santri.id}
                onClick={() => setSelectedStudent(santri)}
                className="hover:bg-slate-50 cursor-pointer transition"
              >
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{santri.namaLengkap}</div>
                  <span className="font-mono text-[10px] text-slate-400">{santri.id}</span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-700">
                  {santri.nis}
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {santri.kelas}
                </td>
                <td className="py-3 px-3">
                  <span className="font-medium text-slate-800">{santri.kamar}</span>
                  <span className="text-[10px] text-slate-500 block">{santri.asrama}</span>
                </td>
                <td className="py-3 px-3 text-slate-600 font-mono">
                  {santri.noWhatsapp}
                </td>
                <td className="py-3 px-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    santri.statusAktif ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {santri.statusAktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedStudent(santri)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                    title="Lihat Detail Riwayat Laundry"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-emerald-700 text-white">
              <div>
                <span className="text-[11px] uppercase font-bold text-emerald-200 tracking-wider">Detail Santri</span>
                <h2 className="text-base sm:text-lg font-bold">{selectedStudent.namaLengkap}</h2>
                <p className="text-xs text-emerald-100">NIS: {selectedStudent.nis} • {selectedStudent.kamar}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
              
              {/* Santri Info Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Kelas:</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.kelas}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Asrama:</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.asrama}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Total Transaksi:</span>
                  <span className="font-bold text-emerald-700">{studentTxs.length} Kali</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Total Pakaian:</span>
                  <span className="font-bold text-slate-900">{totalPakaianSantri} pcs</span>
                </div>
              </div>

              {/* Laundry Siap Diambil Alert */}
              {studentReady.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Laundry Siap Diambil ({studentReady.length})</span>
                  </div>
                  {studentReady.map(t => (
                    <div key={t.id} className="p-2 rounded-lg bg-white border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{t.nomorTransaksi}</span>
                        <span className="text-slate-500 ml-2">({t.totalPakaian} pcs)</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedStudent(null);
                          onSelectTransaction(t);
                        }}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        Buka & Ambil →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Laundry yang Sedang Diproses */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Laundry yang Sedang Diproses ({studentInProcess.length})</span>
                </h3>

                {studentInProcess.length === 0 ? (
                  <p className="text-slate-400 italic py-2">Tidak ada cucian yang sedang diproses.</p>
                ) : (
                  <div className="space-y-2">
                    {studentInProcess.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => {
                          setSelectedStudent(null);
                          onSelectTransaction(t);
                        }}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between cursor-pointer transition"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-slate-900">{t.nomorTransaksi}</span>
                            <StatusBadge status={t.status} size="sm" />
                          </div>
                          <span className="text-slate-500 mt-0.5 block">
                            Masuk: {t.tanggalMasuk} • {t.totalPakaian} pcs • {t.jenisLayanan}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700">Detail →</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Riwayat Laundry Selesai */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <Shirt className="w-4 h-4 text-slate-600" />
                  <span>Riwayat Laundry Selesai ({studentCompleted.length})</span>
                </h3>

                {studentCompleted.length === 0 ? (
                  <p className="text-slate-400 italic py-2">Belum ada riwayat laundry yang sudah diambil.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {studentCompleted.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => {
                          setSelectedStudent(null);
                          onSelectTransaction(t);
                        }}
                        className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between cursor-pointer transition"
                      >
                        <div>
                          <span className="font-mono font-semibold text-slate-800">{t.nomorTransaksi}</span>
                          <span className="text-slate-500 ml-2">({t.totalPakaian} pcs)</span>
                          <span className="text-[10px] text-slate-400 block">
                            Diambil: {t.tanggalDiambil || '-'}
                          </span>
                        </div>
                        <StatusBadge status="sudah_diambil" size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Santri Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-emerald-700 text-white">
              <h2 className="text-base font-bold">Tambah Data Santri Baru</h2>
              <button onClick={() => setShowAddModal(false)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-5 space-y-3.5 text-xs text-slate-800">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Lengkap Santri:</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Abdullah Malik Ibrahim"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">NIS:</label>
                  <input
                    type="text"
                    required
                    placeholder="20241011"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Kelas:</label>
                  <input
                    type="text"
                    required
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Kamar:</label>
                  <input
                    type="text"
                    required
                    value={kamar}
                    onChange={(e) => setKamar(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Asrama:</label>
                  <input
                    type="text"
                    required
                    value={asrama}
                    onChange={(e) => setAsrama(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">No. WhatsApp:</label>
                <input
                  type="text"
                  value={noWhatsapp}
                  onChange={(e) => setNoWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Simpan Santri
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
