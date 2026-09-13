import React, { useState, useMemo } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Shirt, 
  TrendingUp,
  Building
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { transactions, issues } = useLaundry();

  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Filter transactions based on date
  const filteredTxs = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return transactions.filter(t => {
      const txDate = t.tanggalMasuk.slice(0, 10);

      if (period === 'today') {
        return txDate === today;
      }
      if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekStr = weekAgo.toISOString().slice(0, 10);
        return txDate >= weekStr && txDate <= today;
      }
      if (period === 'month') {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        const monthStr = monthAgo.toISOString().slice(0, 10);
        return txDate >= monthStr && txDate <= today;
      }
      if (period === 'custom') {
        return txDate >= startDate && txDate <= endDate;
      }
      return true;
    });
  }, [transactions, period, startDate, endDate]);

  // Metric aggregates
  const totalTransaksi = filteredTxs.length;
  const totalPcs = filteredTxs.reduce((sum, t) => sum + (t.totalPakaian || 0), 0);
  const sudahDiambil = filteredTxs.filter(t => t.status === 'sudah_diambil').length;
  const belumDiambil = filteredTxs.filter(t => t.status === 'siap_diambil').length;
  const sedangDiproses = filteredTxs.filter(t => 
    ['diterima', 'proses_sortir', 'dicuci', 'dikeringkan', 'disetrika'].includes(t.status)
  ).length;

  const bermasalahCount = filteredTxs.filter(t => t.status === 'bermasalah').length;

  // Breakdown by Asrama
  const asramaStats = useMemo(() => {
    const stats: Record<string, { txCount: number; pcsCount: number; kamars: Set<string> }> = {};

    filteredTxs.forEach(t => {
      const asr = t.asrama || 'Asrama Umum';
      if (!stats[asr]) {
        stats[asr] = { txCount: 0, pcsCount: 0, kamars: new Set() };
      }
      stats[asr].txCount += 1;
      stats[asr].pcsCount += (t.totalPakaian || 0);
      if (t.kamar) stats[asr].kamars.add(t.kamar);
    });

    return Object.entries(stats).map(([name, data]) => ({
      name,
      txCount: data.txCount,
      pcsCount: data.pcsCount,
      kamarCount: data.kamars.size
    }));
  }, [filteredTxs]);

  // Breakdown by clothing type
  const clothingBreakdown = useMemo(() => {
    const totals: Record<string, number> = {
      baju: 0,
      celana: 0,
      sarung: 0,
      koko: 0,
      jaket: 0,
      sprei: 0,
      handuk: 0,
      lainnya: 0
    };

    filteredTxs.forEach(t => {
      (Object.entries(t.items) as [string, number][]).forEach(([key, count]) => {
        if (totals[key] !== undefined) {
          totals[key] += (count || 0);
        }
      });
    });

    return totals;
  }, [filteredTxs]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Laporan Operasional Laundry Pesantren
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi transaksi, beban pencucian, kepatuhan pengambilan, dan performa asrama.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Laporan</span>
        </button>
      </div>

      {/* Period Filter Selector */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-700">Filter Periode:</span>
        
        <div className="flex items-center space-x-1.5">
          {(['today', 'week', 'month', 'custom'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                period === p
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p === 'today' ? 'Hari Ini' : p === 'week' ? '7 Hari Terakhir' : p === 'month' ? '30 Hari Terakhir' : 'Kustom'}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className="flex items-center space-x-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded bg-white text-xs"
            />
            <span>s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded bg-white text-xs"
            />
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Transaksi</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalTransaksi}</span>
          <span className="text-[10px] text-slate-400">Penerimaan</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Pakaian</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{totalPcs}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Pcs pakaian</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Sedang Diproses</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{sedangDiproses}</span>
          <span className="text-[10px] text-indigo-500 font-medium">Antrian cuci</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Siap Diambil</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{belumDiambil}</span>
          <span className="text-[10px] text-amber-500 font-medium">Belum diambil</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Sudah Diambil</span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">{sudahDiambil}</span>
          <span className="text-[10px] text-slate-400">Tuntas diserahkan</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Bermasalah</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">{bermasalahCount}</span>
          <span className="text-[10px] text-rose-500 font-medium">Tercatat</span>
        </div>
      </div>

      {/* Grid: Asrama Breakdown & Clothing Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Asrama Stats */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Statistik Berdasarkan Asrama</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Distribusi beban</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Asrama</th>
                  <th className="py-2.5 px-3 text-center">Jml Kamar</th>
                  <th className="py-2.5 px-3 text-center">Transaksi</th>
                  <th className="py-2.5 px-3 text-right">Total Pcs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {asramaStats.map(stat => (
                  <tr key={stat.name} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{stat.name}</td>
                    <td className="py-2.5 px-3 text-center">{stat.kamarCount} Kamar</td>
                    <td className="py-2.5 px-3 text-center font-medium">{stat.txCount} tx</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{stat.pcsCount} pcs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clothing Items Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Shirt className="w-4 h-4 text-indigo-600" />
              <span>Rekapitulasi Kategori Pakaian Dicuci</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Total: {totalPcs} pcs</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {Object.entries(clothingBreakdown).map(([k, count]) => (
              <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-500">{k}</span>
                <span className="text-lg font-black text-slate-900 mt-1">{count} <span className="text-[10px] font-normal text-slate-400">pcs</span></span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
