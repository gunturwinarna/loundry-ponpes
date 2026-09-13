import React, { useState, useMemo } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryTransaction } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  Search, 
  Shirt, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Sparkles,
  User,
  Eye,
  ArrowRight
} from 'lucide-react';

interface SantriPortalViewProps {
  onSelectTransaction: (tx: LaundryTransaction) => void;
}

export const SantriPortalView: React.FC<SantriPortalViewProps> = ({ onSelectTransaction }) => {
  const { transactions, students } = useLaundry();

  // Search by transaction number
  const [searchTxNumber, setSearchTxNumber] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'SAN-001');

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Specific transaction searched
  const searchedTx = useMemo(() => {
    if (!searchTxNumber.trim()) return null;
    const q = searchTxNumber.trim().toLowerCase();
    return transactions.find(t => t.nomorTransaksi.toLowerCase() === q);
  }, [transactions, searchTxNumber]);

  // Santri's laundry
  const santriTxs = useMemo(() => {
    if (!currentStudent) return [];
    return transactions.filter(t => 
      t.studentId === currentStudent.id || 
      t.studentName === currentStudent.namaLengkap
    );
  }, [transactions, currentStudent]);

  // Status groupings for current student
  const readyToPickup = santriTxs.filter(t => t.status === 'siap_diambil');
  const inProcess = santriTxs.filter(t => 
    ['diterima', 'proses_sortir', 'dicuci', 'dikeringkan', 'disetrika'].includes(t.status)
  );
  const completed = santriTxs.filter(t => t.status === 'sudah_diambil');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100">
              Portal Santri Mandiri
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-1">
              Assalamu&apos;alaikum, {currentStudent?.namaLengkap || 'Santri'}
            </h1>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Kamar: <strong>{currentStudent?.kamar}</strong> • {currentStudent?.asrama} (NIS: {currentStudent?.nis})
            </p>
          </div>

          {/* Quick Switch Santri for Demo */}
          <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block mb-1">
              Ganti Akun Santri (Demo):
            </span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full text-xs py-1 px-2 rounded-lg bg-emerald-950 text-white border border-emerald-700 focus:outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.namaLengkap} - {s.kamar}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Search Transaction Input */}
        <div className="bg-white rounded-xl p-2.5 flex items-center shadow-lg">
          <Search className="w-4 h-4 text-emerald-700 ml-1.5 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Ketik nomor transaksi (Contoh: LP-20260913-001)..."
            value={searchTxNumber}
            onChange={(e) => setSearchTxNumber(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-mono font-medium"
          />
          {searchTxNumber && (
            <button
              onClick={() => setSearchTxNumber('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Searched Transaction Result Box */}
      {searchTxNumber.trim() && (
        <div className="space-y-2 animate-in fade-in">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Hasil Pencarian Nomor Transaksi &ldquo;{searchTxNumber}&rdquo;:
          </h2>
          {searchedTx ? (
            <div 
              onClick={() => onSelectTransaction(searchedTx)}
              className="p-4 rounded-2xl bg-white border-2 border-emerald-500 shadow-md cursor-pointer hover:bg-emerald-50/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sm text-slate-900">{searchedTx.nomorTransaksi}</span>
                  <StatusBadge status={searchedTx.status} size="sm" />
                </div>
                <p className="text-xs text-slate-700 font-semibold mt-1">
                  Santri: {searchedTx.studentName} ({searchedTx.kamar})
                </p>
                <p className="text-xs text-slate-500">
                  Total: {searchedTx.totalPakaian} pcs • Estimasi Selesai: {searchedTx.estimasiSelesai}
                </p>
              </div>

              <button
                onClick={() => onSelectTransaction(searchedTx)}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                <span>Lihat Detail Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              Nomor transaksi tidak ditemukan. Pastikan format nomor transaksi benar (contoh: <code>LP-20260913-001</code>).
            </div>
          )}
        </div>
      )}

      {/* NOTIFIKASI: Laundry Siap Diambil Banner */}
      {readyToPickup.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold">
              Kabar Baik! {readyToPickup.length} Laundry Anda Sudah Siap Diambil di Loket
            </h2>
          </div>
          <p className="text-xs text-emerald-800">
            Silakan tunjukkan nomor transaksi berikut ke petugas loket laundry saat pengambilan:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {readyToPickup.map(t => (
              <div 
                key={t.id}
                onClick={() => onSelectTransaction(t)}
                className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-emerald-400 transition"
              >
                <div>
                  <span className="font-mono font-bold text-xs text-emerald-900">{t.nomorTransaksi}</span>
                  <span className="text-xs text-slate-600 ml-2">({t.totalPakaian} pcs)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Layanan: {t.jenisLayanan}
                  </span>
                </div>
                <StatusBadge status="siap_diambil" size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sedang Diproses */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Laundry Sedang Diproses ({inProcess.length})</span>
        </h2>

        {inProcess.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            Tidak ada cucian yang sedang diproses saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inProcess.map(t => (
              <div 
                key={t.id}
                onClick={() => onSelectTransaction(t)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {t.nomorTransaksi}
                  </span>
                  <StatusBadge status={t.status} size="sm" />
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Jumlah Pakaian:</span>
                    <strong className="text-slate-900">{t.totalPakaian} pcs</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tanggal Masuk:</span>
                    <span>{t.tanggalMasuk}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimasi Selesai:</span>
                    <span className="font-bold text-emerald-700">{t.estimasiSelesai}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-400">Penerima: {t.petugasPenerima}</span>
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <span>Lacak Proses</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Riwayat Laundry Selesai */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Shirt className="w-4 h-4 text-slate-600" />
          <span>Riwayat Cucian Sebelumnya ({completed.length})</span>
        </h2>

        {completed.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            Belum ada riwayat cucian yang selesai diambil.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">No. Transaksi</th>
                  <th className="py-3 px-3">Tanggal Masuk</th>
                  <th className="py-3 px-3">Tanggal Diambil</th>
                  <th className="py-3 px-3 text-center">Jumlah Pcs</th>
                  <th className="py-3 px-3">Pengambil</th>
                  <th className="py-3 px-3 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completed.map(t => (
                  <tr 
                    key={t.id}
                    onClick={() => onSelectTransaction(t)}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.nomorTransaksi}</td>
                    <td className="py-3 px-3 text-slate-600">{t.tanggalMasuk}</td>
                    <td className="py-3 px-3 text-slate-600">{t.tanggalDiambil || '-'}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">{t.totalPakaian} pcs</td>
                    <td className="py-3 px-3 text-slate-700">{t.namaPengambil || '-'}</td>
                    <td className="py-3 px-3 text-right">
                      <button className="p-1 rounded text-slate-500 hover:text-slate-900">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
