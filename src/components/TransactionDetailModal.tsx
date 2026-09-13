import React, { useState } from 'react';
import { LaundryTransaction, LaundryStatus } from '../types';
import { useLaundry } from '../context/LaundryContext';
import { StatusBadge } from './StatusBadge';
import { PIPELINE_STEPS, STATUS_CONFIG, getNextStatus } from '../utils/statusHelper';
import { 
  X, 
  Printer, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: LaundryTransaction | null;
  onClose: () => void;
  onOpenReportIssue?: (tx: LaundryTransaction) => void;
  onOpenPickupModal?: (tx: LaundryTransaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onOpenReportIssue,
  onOpenPickupModal
}) => {
  const { userRole, currentStaffName, updateTransactionStatus } = useLaundry();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState<LaundryStatus>('diterima');
  const [statusNote, setStatusNote] = useState('');

  if (!transaction) return null;

  const nextStatus = getNextStatus(transaction.status);

  const handleAdvanceNext = async () => {
    if (!nextStatus) return;
    setIsUpdating(true);
    try {
      await updateTransactionStatus(
        transaction.id, 
        nextStatus, 
        currentStaffName, 
        `Ditingkatkan ke ${STATUS_CONFIG[nextStatus].label}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCustomStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateTransactionStatus(
        transaction.id,
        selectedNewStatus,
        currentStaffName,
        statusNote || undefined
      );
      setShowStatusSelect(false);
      setStatusNote('');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const itemEntries = (Object.entries(transaction.items) as [string, number][]).filter(([, count]) => count > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Detail Transaksi
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                {transaction.nomorTransaksi}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Masuk: {transaction.tanggalMasuk} • Estimasi: {transaction.estimasiSelesai}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
              title="Cetak Tanda Terima"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Status & Quick Action Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Status Laundry Saat Ini:</span>
              <StatusBadge status={transaction.status} size="lg" />
              {transaction.status === 'sudah_diambil' && transaction.namaPengambil && (
                <p className="text-xs text-emerald-700 mt-1.5 font-medium">
                  ✓ Diambil oleh: {transaction.namaPengambil} ({transaction.tanggalDiambil})
                </p>
              )}
            </div>

            {/* Petugas / Admin quick controls */}
            {userRole !== 'santri' && (
              <div className="flex flex-wrap items-center gap-2">
                {transaction.status === 'siap_diambil' ? (
                  <button
                    onClick={() => {
                      if (onOpenPickupModal) onOpenPickupModal(transaction);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tandai Sudah Diambil</span>
                  </button>
                ) : nextStatus && transaction.status !== 'sudah_diambil' && transaction.status !== 'bermasalah' ? (
                  <button
                    onClick={handleAdvanceNext}
                    disabled={isUpdating}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>Lanjut ke {STATUS_CONFIG[nextStatus].label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}

                {transaction.status !== 'sudah_diambil' && (
                  <button
                    onClick={() => setShowStatusSelect(!showStatusSelect)}
                    className="px-2.5 py-2 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-medium"
                  >
                    Ubah Manual
                  </button>
                )}

                {transaction.status !== 'bermasalah' && onOpenReportIssue && (
                  <button
                    onClick={() => onOpenReportIssue(transaction)}
                    className="px-2.5 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium flex items-center space-x-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Laporkan Masalah</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Manual Status Select Drawer */}
          {showStatusSelect && (
            <form onSubmit={handleCustomStatusSubmit} className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <p className="text-xs font-bold text-emerald-900">Ubah Status Operasional Laundry:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(STATUS_CONFIG).map((st) => (
                  <label 
                    key={st} 
                    className={`flex items-center space-x-2 text-xs p-2 rounded-lg border cursor-pointer transition ${
                      selectedNewStatus === st 
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={st}
                      checked={selectedNewStatus === st}
                      onChange={() => setSelectedNewStatus(st as LaundryStatus)}
                      className="hidden"
                    />
                    <span>{STATUS_CONFIG[st as LaundryStatus].label}</span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                placeholder="Catatan perubahan (opsional, misal: 'Mesin dryer 02')"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowStatusSelect(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Santri Info */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-xs border-b border-slate-100 pb-2">
                <User className="w-4 h-4" />
                <span>Identitas Santri</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Santri:</span>
                  <span className="font-semibold text-slate-900">{transaction.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ID Santri:</span>
                  <span className="font-mono text-slate-700">{transaction.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kamar:</span>
                  <span className="text-slate-800 font-medium">{transaction.kamar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Asrama:</span>
                  <span className="text-slate-800">{transaction.asrama}</span>
                </div>
              </div>
            </div>

            {/* Layanan Info */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-xs border-b border-slate-100 pb-2">
                <Clock className="w-4 h-4" />
                <span>Informasi Layanan</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Layanan:</span>
                  <span className="font-semibold text-emerald-700">{transaction.jenisLayanan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Petugas Penerima:</span>
                  <span className="text-slate-800">{transaction.petugasPenerima}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Pakaian:</span>
                  <span className="font-bold text-slate-900">{transaction.totalPakaian} pcs</span>
                </div>
                {transaction.catatan && (
                  <div className="pt-1 text-slate-600 italic">
                    Catatan: &ldquo;{transaction.catatan}&rdquo;
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Rincian Pakaian */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-xs text-slate-900">Rincian Jenis Pakaian:</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Total: {transaction.totalPakaian} Pcs
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {itemEntries.map(([key, count]) => (
                <div key={key} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs capitalize text-slate-600 font-medium">{key}</span>
                  <span className="text-xs font-bold text-slate-900 px-2 py-0.5 bg-white rounded border border-slate-200">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Riwayat Transaksi */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h3 className="font-semibold text-xs text-slate-900">
              Riwayat Proses Laundry (Timeline)
            </h3>

            {/* Pipeline progress bar indicator */}
            <div className="flex items-center justify-between overflow-x-auto py-2 px-1 text-[10px]">
              {PIPELINE_STEPS.map((step, idx) => {
                const isPassed = transaction.history.some(h => h.status === step);
                const isCurrent = transaction.status === step;
                return (
                  <div key={step} className="flex items-center flex-1 min-w-[65px] last:flex-none">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`mt-1 line-clamp-1 ${isCurrent ? 'font-bold text-emerald-800' : 'text-slate-500'}`}>
                        {STATUS_CONFIG[step].label.split(' ')[0]}
                      </span>
                    </div>
                    {idx < PIPELINE_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${isPassed ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detailed History log */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {transaction.history.map((h, i) => (
                <div key={h.id || i} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={h.status} size="sm" />
                      <span className="text-[11px] text-slate-400">
                        {h.tanggal} pukul {h.jam}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 mt-1">
                      <span className="font-medium text-slate-900">Petugas:</span> {h.petugas}
                      {h.catatan && (
                        <p className="text-slate-500 text-[11px] mt-0.5 italic">
                          &ldquo;{h.catatan}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            {transaction.nomorTransaksi}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
