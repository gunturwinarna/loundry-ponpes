import React, { useState, useMemo } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryTransaction, LaundryStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { STATUS_CONFIG, getNextStatus } from '../utils/statusHelper';
import { 
  Shirt, 
  RotateCw, 
  CheckCircle2, 
  PackageCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowRight, 
  Eye, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';

interface DashboardViewProps {
  onSelectTransaction: (tx: LaundryTransaction) => void;
  onOpenNewTx: () => void;
  onOpenPickupModal: (tx: LaundryTransaction) => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTransaction,
  onOpenNewTx,
  onOpenPickupModal,
  setActiveTab
}) => {
  const { transactions, userRole, currentStaffName, updateTransactionStatus } = useLaundry();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [asramaFilter, setAsramaFilter] = useState<string>('all');

  // KPI Calculations
  const todayStr = new Date().toISOString().slice(0, 10);
  
  const masukHariIni = transactions.filter(t => t.tanggalMasuk.startsWith(todayStr)).length;
  
  const sedangDiproses = transactions.filter(t => 
    ['diterima', 'proses_sortir', 'dicuci', 'dikeringkan', 'disetrika'].includes(t.status)
  ).length;

  const siapDiambil = transactions.filter(t => t.status === 'siap_diambil').length;
  const sudahDiambil = transactions.filter(t => t.status === 'sudah_diambil').length;
  const laundryBermasalah = transactions.filter(t => t.status === 'bermasalah').length;

  // Chart Data: Last 7 days transactions & clothing count
  const chartData = useMemo(() => {
    const days: { dateLabel: string; count: number; pakaian: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
      
      const dayTxs = transactions.filter(t => t.tanggalMasuk.startsWith(dateKey));
      const totalPcs = dayTxs.reduce((sum, t) => sum + (t.totalPakaian || 0), 0);

      days.push({
        dateLabel: `${dayName} ${d.getDate()}/${d.getMonth() + 1}`,
        count: dayTxs.length,
        pakaian: totalPcs
      });
    }
    return days;
  }, [transactions]);

  // Unique Asramas for filter
  const uniqueAsramas = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => {
      if (t.asrama) set.add(t.asrama);
    });
    return Array.from(set);
  }, [transactions]);

  // Filtered transactions for table
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search text: Nomor Transaksi, Nama Santri, ID Santri, Kamar
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        t.nomorTransaksi.toLowerCase().includes(query) ||
        t.studentName.toLowerCase().includes(query) ||
        t.studentId.toLowerCase().includes(query) ||
        t.kamar.toLowerCase().includes(query);

      // Filter status
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;

      // Filter asrama
      const matchAsrama = asramaFilter === 'all' || t.asrama === asramaFilter;

      return matchQuery && matchStatus && matchAsrama;
    });
  }, [transactions, searchQuery, statusFilter, asramaFilter]);

  const handleQuickAdvance = async (e: React.MouseEvent, tx: LaundryTransaction) => {
    e.stopPropagation();
    const next = getNextStatus(tx.status);
    if (!next) return;
    await updateTransactionStatus(
      tx.id,
      next,
      currentStaffName,
      `Diperbarui otomatis ke ${STATUS_CONFIG[next].label}`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Greetings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-5 text-white shadow-sm">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-emerald-100">
            Operasional Laundry Aktif
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
            Dashboard Laundry Santri
          </h1>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Kelola penerimaan, antrian pencucian, dan pengambilan pakaian santri dengan cepat.
          </p>
        </div>

        {userRole !== 'santri' && (
          <button
            onClick={onOpenNewTx}
            className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 active:scale-95 transition shadow-sm"
          >
            <Shirt className="w-4 h-4 text-emerald-700" />
            <span>Catat Laundry Masuk</span>
          </button>
        )}
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 1. Masuk Hari Ini */}
        <div 
          onClick={() => { setStatusFilter('diterima'); }}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Masuk Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Shirt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{masukHariIni}</span>
            <span className="text-xs text-slate-400">transaksi</span>
          </div>
        </div>

        {/* 2. Sedang Diproses */}
        <div 
          onClick={() => setActiveTab('proses')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sedang Diproses</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <RotateCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-indigo-700">{sedangDiproses}</span>
            <span className="text-xs text-slate-400">antrian</span>
          </div>
        </div>

        {/* 3. Siap Diambil */}
        <div 
          onClick={() => setActiveTab('siap_diambil')}
          className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 hover:bg-emerald-50 hover:shadow-xs transition cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Siap Diambil</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-800">{siapDiambil}</span>
            <span className="text-xs text-emerald-600 font-semibold">siap</span>
          </div>
        </div>

        {/* 4. Sudah Diambil */}
        <div 
          onClick={() => setStatusFilter('sudah_diambil')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sudah Diambil</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-800">{sudahDiambil}</span>
            <span className="text-xs text-slate-400">selesai</span>
          </div>
        </div>

        {/* 5. Laundry Bermasalah */}
        <div 
          onClick={() => setActiveTab('masalah')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-xs transition cursor-pointer col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bermasalah</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-600">{laundryBermasalah}</span>
            <span className="text-xs text-slate-400">kasus</span>
          </div>
        </div>

      </div>

      {/* 2 Recharts: Laundry per hari & Pakaian yang diproses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Chart 1: Jumlah Laundry per Hari */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Grafik Jumlah Laundry Masuk (7 Hari Terakhir)
              </h3>
              <p className="text-[11px] text-slate-500">Tren frekuensi penerimaan cucian santri</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Harian
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stop-color="#10b981" stop-opacity="0.6"/>
                    <stop offset="95%" stop-color="#10b981" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: any) => [`${value} Transaksi`, 'Laundry']} 
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="count" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Jumlah Pakaian yang Diproses */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Grafik Jumlah Pakaian yang Diproses (Pcs)
              </h3>
              <p className="text-[11px] text-slate-500">Volume total helai pakaian santri</p>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Volume Pcs
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: any) => [`${value} Pcs Pakaian`, 'Total Pakaian']} 
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="pakaian" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tabel Laundry Terbaru & Filter */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        
        {/* Table Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Tabel Laundry Terbaru
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredTransactions.length} dari {transactions.length} total transaksi
            </p>
          </div>

          {/* Search bar & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari No. Transaksi, Santri, Kamar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="diterima">Diterima</option>
              <option value="proses_sortir">Proses Sortir</option>
              <option value="dicuci">Dicuci</option>
              <option value="dikeringkan">Dikeringkan</option>
              <option value="disetrika">Disetrika</option>
              <option value="siap_diambil">Siap Diambil</option>
              <option value="sudah_diambil">Sudah Diambil</option>
              <option value="bermasalah">Bermasalah</option>
            </select>

            {/* Asrama Filter */}
            <select
              value={asramaFilter}
              onChange={(e) => setAsramaFilter(e.target.value)}
              className="text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
            >
              <option value="all">Semua Asrama</option>
              {uniqueAsramas.map(a => (
                <option key={a} value={a}>{a.replace('Asrama ', '')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">No. Transaksi</th>
                <th className="py-3 px-3">Nama Santri</th>
                <th className="py-3 px-3">Kamar</th>
                <th className="py-3 px-3 text-center">Jumlah Pakaian</th>
                <th className="py-3 px-3">Tanggal Masuk</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data transaksi laundry yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 10).map((tx) => {
                  const next = getNextStatus(tx.status);
                  return (
                    <tr 
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className="hover:bg-slate-50 cursor-pointer transition"
                    >
                      {/* No Transaksi */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {tx.nomorTransaksi}
                      </td>

                      {/* Nama Santri */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{tx.studentName}</div>
                        <span className="text-[10px] text-slate-400">NIS: {tx.studentId}</span>
                      </td>

                      {/* Kamar & Asrama */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800">{tx.kamar}</span>
                        <span className="text-[10px] text-slate-500 block">{tx.asrama.replace('Asrama ', '')}</span>
                      </td>

                      {/* Jumlah Pakaian */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {tx.totalPakaian} pcs
                        </span>
                      </td>

                      {/* Tanggal Masuk */}
                      <td className="py-3 px-3 text-slate-600">
                        {tx.tanggalMasuk}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <StatusBadge status={tx.status} size="sm" />
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* Quick action button based on state */}
                          {userRole !== 'santri' && tx.status === 'siap_diambil' && (
                            <button
                              onClick={() => onOpenPickupModal(tx)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center space-x-1"
                              title="Tandai Sudah Diambil"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Ambil</span>
                            </button>
                          )}

                          {userRole !== 'santri' && next && tx.status !== 'sudah_diambil' && tx.status !== 'bermasalah' && tx.status !== 'siap_diambil' && (
                            <button
                              onClick={(e) => handleQuickAdvance(e, tx)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 text-[11px] font-medium flex items-center space-x-0.5"
                              title={`Lanjut ke ${STATUS_CONFIG[next].label}`}
                            >
                              <span>{STATUS_CONFIG[next].label.split(' ')[0]}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={() => onSelectTransaction(tx)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
                            title="Lihat Detail Transaksi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* View all link */}
        {filteredTransactions.length > 10 && (
          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('proses')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center space-x-1"
            >
              <span>Lihat seluruh daftar cucian yang diproses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
