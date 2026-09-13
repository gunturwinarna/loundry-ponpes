import React, { useState } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { ClothingItems, Student, LaundryTransaction } from '../types';
import { X, Plus, Minus, Check, Sparkles, User, Calendar, Tag, FileText } from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tx: LaundryTransaction) => void;
}

const CLOTHING_CATEGORIES: { key: keyof ClothingItems; label: string; icon: string }[] = [
  { key: 'baju', label: 'Baju / Kaos', icon: '👕' },
  { key: 'celana', label: 'Celana', icon: '👖' },
  { key: 'sarung', label: 'Sarung', icon: '🧣' },
  { key: 'koko', label: 'Baju Koko', icon: '🥼' },
  { key: 'jaket', label: 'Jaket / Sweater', icon: '🧥' },
  { key: 'sprei', label: 'Sprei Kasur', icon: '🛏️' },
  { key: 'handuk', label: 'Handuk Mandi', icon: '🧖' },
  { key: 'lainnya', label: 'Lainnya (Jilbab/dll)', icon: '🧺' },
];

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { students, currentStaffName, addTransaction } = useLaundry();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [jenisLayanan, setJenisLayanan] = useState<string>('Reguler (3 Hari)');
  const [catatan, setCatatan] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Dates
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultEstimate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [tanggalMasuk, setTanggalMasuk] = useState<string>(todayStr);
  const [estimasiSelesai, setEstimasiSelesai] = useState<string>(defaultEstimate);

  // Clothing counts
  const [items, setItems] = useState<ClothingItems>({
    baju: 0,
    celana: 0,
    sarung: 0,
    koko: 0,
    jaket: 0,
    sprei: 0,
    handuk: 0,
    lainnya: 0
  });

  if (!isOpen) return null;

  const filteredStudents = students.filter(s => 
    s.namaLengkap.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.kamar.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.nis.includes(studentSearch)
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const totalPcs = (Object.values(items) as number[]).reduce((a, b) => a + (b || 0), 0);

  const handleItemCountChange = (key: keyof ClothingItems, delta: number) => {
    setItems(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  const handleItemDirectInput = (key: keyof ClothingItems, value: string) => {
    const num = parseInt(value, 10);
    setItems(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const handleLayananChange = (val: string) => {
    setJenisLayanan(val);
    const now = new Date();
    if (val.includes('1 Hari') || val.includes('Kilat')) {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      setEstimasiSelesai(tomorrow);
    } else {
      const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      setEstimasiSelesai(threeDays);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    if (totalPcs <= 0) {
      alert('Harap masukkan minimal 1 pakaian!');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTx = await addTransaction({
        studentId: selectedStudent.id,
        studentName: selectedStudent.namaLengkap,
        kamar: selectedStudent.kamar,
        asrama: selectedStudent.asrama,
        tanggalMasuk,
        estimasiSelesai,
        jenisLayanan,
        items,
        catatan,
        petugasPenerima: currentStaffName
      });

      onSuccess(newTx);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan transaksi laundry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-emerald-700 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">Catat Transaksi Laundry Masuk</h2>
              <p className="text-xs text-emerald-100">Petugas loket penerimaan pakaian santri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1 text-slate-800">
          
          {/* Santri Selection */}
          <div className="space-y-2">
            <label className="flex items-center space-x-1 text-xs font-bold text-slate-700 uppercase">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Pilih Santri</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Cari nama santri, NIS, atau kamar..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
              />
              <select
                id="select-santri"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                required
              >
                {filteredStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.namaLengkap} - {s.kamar} ({s.asrama.replace('Asrama ', '')})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Santri Info Pill */}
            {selectedStudent && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-900">{selectedStudent.namaLengkap}</span>
                  <span className="text-slate-500 ml-2">(NIS: {selectedStudent.nis})</span>
                </div>
                <div className="text-slate-600">
                  <span className="font-medium text-emerald-700">{selectedStudent.kamar}</span> • {selectedStudent.asrama}
                </div>
              </div>
            )}
          </div>

          {/* Layanan & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="flex items-center space-x-1 text-xs font-bold text-slate-700 uppercase">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Jenis Layanan</span>
              </label>
              <select
                value={jenisLayanan}
                onChange={(e) => handleLayananChange(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="Reguler (3 Hari)">Reguler (3 Hari)</option>
                <option value="Kilat (1 Hari)">Kilat (1 Hari)</option>
                <option value="Cuci Setrika">Cuci Setrika</option>
                <option value="Cuci Lipat">Cuci Lipat</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center space-x-1 text-xs font-bold text-slate-700 uppercase">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tanggal Masuk</span>
              </label>
              <input
                type="date"
                value={tanggalMasuk}
                onChange={(e) => setTanggalMasuk(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center space-x-1 text-xs font-bold text-slate-700 uppercase">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimasi Selesai</span>
              </label>
              <input
                type="date"
                value={estimasiSelesai}
                onChange={(e) => setEstimasiSelesai(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>
          </div>

          {/* Clothing Items Grid with Counters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase">
                2. Rincian Jenis Pakaian:
              </label>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                totalPcs > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                Total: {totalPcs} pcs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CLOTHING_CATEGORIES.map((cat) => {
                const count = items[cat.key] || 0;
                return (
                  <div 
                    key={cat.key}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                      count > 0 ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-xs font-medium text-slate-800">{cat.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleItemCountChange(cat.key, -1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => handleItemDirectInput(cat.key, e.target.value)}
                        className="w-12 h-7 text-center font-bold text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleItemCountChange(cat.key, 1)}
                        className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 flex items-center justify-center text-white transition shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Catatan Khusus */}
          <div className="space-y-1">
            <label className="flex items-center space-x-1 text-xs font-bold text-slate-700 uppercase">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Catatan Pakaian (Opsional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Misal: Sarung hijau cap mangga, baju koko putih jangan disikat, ada gamis berbordir..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
            />
          </div>

          {/* Petugas Bertugas */}
          <div className="p-3 rounded-lg bg-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Petugas Penerima: <strong className="text-slate-900">{currentStaffName}</strong></span>
            <span className="text-slate-400">Status awal: Diterima</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              id="btn-submit-new-tx"
              type="submit"
              disabled={isSubmitting || totalPcs <= 0}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Transaksi ({totalPcs} Pcs)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
