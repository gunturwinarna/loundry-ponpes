import React, { useState, useMemo } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryTransaction } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  CheckCircle2, 
  Search, 
  Calendar, 
  Eye, 
  PackageCheck, 
  Sparkles,
  Shirt,
  UserCheck
} from 'lucide-react';

interface ReadyPickupViewProps {
  onSelectTransaction: (tx: LaundryTransaction) => void;
  onOpenPickupModal: (tx: LaundryTransaction) => void;
}

export const ReadyPickupView: React.FC<ReadyPickupViewProps> = ({
  onSelectTransaction,
  onOpenPickupModal
}) => {
  const { transactions } = useLaundry();
  const [searchQuery, setSearchQuery] = useState('');

  // Laundry with status "siap_diambil"
  const readyList = useMemo(() => {
    return transactions.filter(t => t.status === 'siap_diambil');
  }, [transactions]);

  const filteredReady = useMemo(() => {
    return readyList.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      return !q ||
        t.nomorTransaksi.toLowerCase().includes(q) ||
        t.studentName.toLowerCase().includes(q) ||
        t.kamar.toLowerCase().includes(q) ||
        t.asrama.toLowerCase().includes(q);
    });
  }, [readyList, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-700 to-teal-700 p-5 rounded-2xl text-white shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-white/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              Halaman Khusus Laundry Siap Diambil
            </h1>
          </div>
          <p className="text-xs text-emerald-100/90 mt-1">
            Daftar pakaian santri yang telah selesai dicuci, dikeringkan, disetrika, dan siap diserahkan ke santri.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-xs px-4 py-2 rounded-xl text-center self-start sm:self-auto border border-white/20">
          <span className="text-2xl font-black block">{readyList.length}</span>
          <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Siap Diserahkan</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari no. transaksi / nama santri / kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-emerald-600"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Menampilkan {filteredReady.length} cucian siap
        </span>
      </div>

      {/* Content: List or Table */}
      {filteredReady.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Laundry Siap Diambil</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? 'Tidak ada hasil yang sesuai dengan kata kunci pencarian.' : 'Semua cucian yang siap sudah diambil oleh santri.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReady.map((tx) => {
            // Find completion date from history
            const readyHistory = tx.history.find(h => h.status === 'siap_diambil');
            const tanggalSelesai = readyHistory ? `${readyHistory.tanggal} ${readyHistory.jam}` : tx.estimasiSelesai;

            return (
              <div
                key={tx.id}
                className="bg-white rounded-2xl border border-emerald-300/80 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Top green accent strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

                <div>
                  {/* Header: No Transaksi & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      {tx.nomorTransaksi}
                    </span>
                    <StatusBadge status="siap_diambil" size="sm" />
                  </div>

                  {/* Student & Room Info */}
                  <div className="mt-3">
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {tx.studentName}
                    </h3>
                    <p className="text-xs text-emerald-800 font-medium mt-0.5">
                      {tx.kamar} • {tx.asrama}
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Jumlah Pakaian:</span>
                      <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {tx.totalPakaian} pcs
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span>Tanggal Selesai:</span>
                      <span className="font-medium text-slate-800 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{tanggalSelesai}</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span>Layanan:</span>
                      <span className="text-slate-700">{tx.jenisLayanan}</span>
                    </div>

                    {tx.catatan && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                        &ldquo;{tx.catatan}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Big Action Buttons */}
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => onSelectTransaction(tx)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                    title="Lihat Detail Transaksi"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    id={`btn-pickup-${tx.id}`}
                    onClick={() => onOpenPickupModal(tx)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-sm transition"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Tandai Sudah Diambil</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
