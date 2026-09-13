import React, { useState } from 'react';
import { LaundryTransaction, IssueType, IssueResolution } from '../types';
import { useLaundry } from '../context/LaundryContext';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface ReportIssueModalProps {
  transaction: LaundryTransaction | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const ISSUE_TYPES: IssueType[] = [
  'Pakaian rusak',
  'Pakaian hilang',
  'Pakaian tertukar',
  'Noda tidak hilang',
  'Jumlah tidak sesuai',
  'Masalah lainnya'
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  transaction,
  onClose,
  onSuccess
}) => {
  const { currentStaffName, reportIssue } = useLaundry();

  const [jenisMasalah, setJenisMasalah] = useState<IssueType>('Pakaian tertukar');
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlahBermasalah, setJumlahBermasalah] = useState(1);
  const [statusPenyelesaian, setStatusPenyelesaian] = useState<IssueResolution>('Menunggu Investigasi');
  const [solusi, setSolusi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskripsi.trim()) {
      alert('Harap isi deskripsi masalah');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const dateFormatted = now.toISOString().slice(0, 10);
      const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      await reportIssue({
        transactionId: transaction.id,
        nomorTransaksi: transaction.nomorTransaksi,
        studentId: transaction.studentId,
        studentName: transaction.studentName,
        kamar: transaction.kamar,
        jenisMasalah,
        deskripsi,
        jumlahBermasalah,
        tanggal: `${dateFormatted} ${timeFormatted}`,
        petugas: currentStaffName,
        statusPenyelesaian,
        solusi: solusi || undefined
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal mencatat masalah laundry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-rose-600 text-white">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-200" />
            <h2 className="text-sm sm:text-base font-bold">Laporkan Laundry Bermasalah</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-rose-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-slate-800 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="font-bold text-slate-900">{transaction.nomorTransaksi} - {transaction.studentName}</p>
            <p className="text-slate-500 mt-0.5">{transaction.kamar} • Total {transaction.totalPakaian} pcs</p>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase block">Jenis Masalah:</label>
            <div className="grid grid-cols-2 gap-2">
              {ISSUE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setJenisMasalah(type)}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    jenisMasalah === type
                      ? 'bg-rose-50 border-rose-500 text-rose-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase block">Jumlah Pakaian Bermasalah:</label>
              <input
                type="number"
                min="1"
                max={transaction.totalPakaian}
                value={jumlahBermasalah}
                onChange={(e) => setJumlahBermasalah(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase block">Status Awal:</label>
              <select
                value={statusPenyelesaian}
                onChange={(e) => setStatusPenyelesaian(e.target.value as IssueResolution)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="Menunggu Investigasi">Menunggu Investigasi</option>
                <option value="Dalam Penanganan">Dalam Penanganan</option>
                <option value="Selesai / Diganti">Selesai / Diganti</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase block">Deskripsi Masalah Lengkap:</label>
            <textarea
              rows={3}
              placeholder="Jelaskan pakaian apa yang bermasalah, ciri-cirinya, dan kronologi penemuan..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase block">Langkah Solusi / Tindak Lanjut:</label>
            <input
              type="text"
              placeholder="Misal: Dicarikan di rak cucian asrama lain, atau hubungi santri"
              value={solusi}
              onChange={(e) => setSolusi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-600">
            Pelapor: <strong className="text-slate-900">{currentStaffName}</strong>
          </div>

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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan Laporan Masalah</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
