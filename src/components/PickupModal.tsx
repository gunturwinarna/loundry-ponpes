import React, { useState } from 'react';
import { LaundryTransaction } from '../types';
import { useLaundry } from '../context/LaundryContext';
import { X, CheckCircle2, UserCheck, Calendar } from 'lucide-react';

interface PickupModalProps {
  transaction: LaundryTransaction | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PickupModal: React.FC<PickupModalProps> = ({
  transaction,
  onClose,
  onSuccess
}) => {
  const { currentStaffName, markAsPickedUp } = useLaundry();
  const [pengambilType, setPengambilType] = useState<'sendiri' | 'diwakilkan'>('sendiri');
  const [namaWakil, setNamaWakil] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const namaFinal = pengambilType === 'sendiri' 
        ? `${transaction.studentName} (Sendiri)`
        : `${namaWakil} (Diwakilkan)`;
      
      await markAsPickedUp(transaction.id, namaFinal, currentStaffName);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal memproses pengambilan laundry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-emerald-600 text-white">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-sm sm:text-base font-bold">Konfirmasi Pengambilan Laundry</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-slate-800 text-xs">
          
          {/* Laundry summary card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Transaksi:</span>
              <span className="font-mono font-bold text-slate-900">{transaction.nomorTransaksi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Santri:</span>
              <span className="font-semibold text-slate-900">{transaction.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kamar / Asrama:</span>
              <span className="text-slate-800">{transaction.kamar} ({transaction.asrama})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Pakaian:</span>
              <span className="font-bold text-emerald-700">{transaction.totalPakaian} pcs</span>
            </div>
          </div>

          {/* Pengambil Options */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 uppercase block">
              Siapa yang mengambil pakaian?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPengambilType('sendiri')}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition ${
                  pengambilType === 'sendiri'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Santri Sendiri</span>
              </button>

              <button
                type="button"
                onClick={() => setPengambilType('diwakilkan')}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition ${
                  pengambilType === 'diwakilkan'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Diwakilkan Teman</span>
              </button>
            </div>
          </div>

          {pengambilType === 'diwakilkan' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Teman / Perwakilan:</label>
              <input
                type="text"
                required
                placeholder="Misal: Ahmad Fauzi (Kamar Abu Bakar 01)"
                value={namaWakil}
                onChange={(e) => setNamaWakil(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          )}

          {/* Petugas info */}
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <div className="flex justify-between">
              <span>Petugas Penyerahan:</span>
              <strong>{currentStaffName}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Waktu Pengambilan:</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-emerald-600" />
                <span>Hari ini ({new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})</span>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition"
            >
              Konfirmasi & Tandai Selesai
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
