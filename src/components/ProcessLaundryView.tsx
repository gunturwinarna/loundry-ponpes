import React, { useState, useMemo } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryTransaction, LaundryStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { STATUS_CONFIG, PIPELINE_STEPS, getNextStatus } from '../utils/statusHelper';
import { 
  RotateCw, 
  ArrowRight, 
  AlertTriangle, 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ProcessLaundryViewProps {
  onSelectTransaction: (tx: LaundryTransaction) => void;
  onOpenReportIssue: (tx: LaundryTransaction) => void;
  onOpenPickupModal: (tx: LaundryTransaction) => void;
}

export const ProcessLaundryView: React.FC<ProcessLaundryViewProps> = ({
  onSelectTransaction,
  onOpenReportIssue,
  onOpenPickupModal
}) => {
  const { transactions, currentStaffName, updateTransactionStatus } = useLaundry();

  const [activeStepTab, setActiveStepTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active in-process statuses
  const processSteps: LaundryStatus[] = [
    'diterima',
    'proses_sortir',
    'dicuci',
    'dikeringkan',
    'disetrika'
  ];

  const inProcessTransactions = useMemo(() => {
    return transactions.filter(t => processSteps.includes(t.status));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return inProcessTransactions.filter(t => {
      const matchTab = activeStepTab === 'all' || t.status === activeStepTab;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        t.nomorTransaksi.toLowerCase().includes(query) ||
        t.studentName.toLowerCase().includes(query) ||
        t.kamar.toLowerCase().includes(query);
      return matchTab && matchQuery;
    });
  }, [inProcessTransactions, activeStepTab, searchQuery]);

  const handleAdvance = async (tx: LaundryTransaction) => {
    const next = getNextStatus(tx.status);
    if (!next) return;
    await updateTransactionStatus(
      tx.id,
      next,
      currentStaffName,
      `Ditingkatkan ke ${STATUS_CONFIG[next].label}`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <RotateCw className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Monitoring Proses Pencucian
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau dan perbarui tahap pengerjaan laundry dari diterima hingga siap diambil.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari no. transaksi / santri / kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
          />
        </div>
      </div>

      {/* Step Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveStepTab('all')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeStepTab === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Semua Proses ({inProcessTransactions.length})
        </button>

        {processSteps.map((step) => {
          const count = inProcessTransactions.filter(t => t.status === step).length;
          const isSelected = activeStepTab === step;
          return (
            <button
              key={step}
              onClick={() => setActiveStepTab(step)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{STATUS_CONFIG[step].label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Laundry di Tahap Ini</h3>
          <p className="text-xs text-slate-500 mt-1">Semua cucian telah dialihkan ke tahap berikutnya atau siap diambil.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransactions.map((tx) => {
            const next = getNextStatus(tx.status);
            const itemsSummary = (Object.entries(tx.items) as [string, number][])
              .filter(([, c]) => c > 0)
              .map(([k, c]) => `${c} ${k}`)
              .join(', ');

            return (
              <div
                key={tx.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition p-4 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top line: No tx & Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {tx.nomorTransaksi}
                    </span>
                    <StatusBadge status={tx.status} size="sm" />
                  </div>

                  {/* Santri name & Room */}
                  <div className="mt-3">
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {tx.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {tx.kamar} • {tx.asrama}
                    </p>
                  </div>

                  {/* Details Pill */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Layanan:</span>
                      <strong className="text-emerald-700">{tx.jenisLayanan}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Pakaian:</span>
                      <strong className="text-slate-900">{tx.totalPakaian} pcs</strong>
                    </div>
                    {itemsSummary && (
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {itemsSummary}
                      </div>
                    )}
                    {tx.catatan && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded italic">
                        Catatan: &ldquo;{tx.catatan}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onSelectTransaction(tx)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs flex items-center space-x-1"
                      title="Lihat Detail & Riwayat"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Detail</span>
                    </button>
                    
                    <button
                      onClick={() => onOpenReportIssue(tx)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                      title="Laporkan Masalah"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary advance button */}
                  {next && (
                    <button
                      onClick={() => handleAdvance(tx)}
                      className="flex-1 max-w-[170px] flex items-center justify-center space-x-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition"
                    >
                      <span className="truncate">Lanjut: {STATUS_CONFIG[next].label}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
