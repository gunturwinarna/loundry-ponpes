import React, { useState } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { LaundryIssue, IssueResolution, LaundryTransaction } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Search, 
  ShieldAlert,
  ArrowRight,
  Eye
} from 'lucide-react';

interface IssuesViewProps {
  onSelectTransactionById: (txId: string) => void;
}

export const IssuesView: React.FC<IssuesViewProps> = ({ onSelectTransactionById }) => {
  const { issues, updateIssueResolution, userRole } = useLaundry();

  const [filterResolution, setFilterResolution] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<IssueResolution>('Dalam Penanganan');
  const [editSolution, setEditSolution] = useState('');

  const filteredIssues = issues.filter(issue => {
    const matchRes = filterResolution === 'all' || issue.statusPenyelesaian === filterResolution;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      issue.nomorTransaksi.toLowerCase().includes(q) ||
      issue.studentName.toLowerCase().includes(q) ||
      issue.jenisMasalah.toLowerCase().includes(q) ||
      issue.kamar.toLowerCase().includes(q);
    return matchRes && matchQuery;
  });

  const handleStartEdit = (issue: LaundryIssue) => {
    setEditingIssueId(issue.id);
    setEditStatus(issue.statusPenyelesaian);
    setEditSolution(issue.solusi || '');
  };

  const handleSaveEdit = async (issueId: string) => {
    await updateIssueResolution(issueId, editStatus, editSolution);
    setEditingIssueId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Daftar Laundry Bermasalah & Komplain
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penanganan pakaian rusak, hilang, tertukar, noda membandel, atau selisih jumlah pakaian santri.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari transaksi / santri / jenis masalah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterResolution('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filterResolution === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua Masalah ({issues.length})
        </button>

        <button
          onClick={() => setFilterResolution('Menunggu Investigasi')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filterResolution === 'Menunggu Investigasi'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-rose-700 hover:bg-rose-50'
          }`}
        >
          Menunggu Investigasi
        </button>

        <button
          onClick={() => setFilterResolution('Dalam Penanganan')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filterResolution === 'Dalam Penanganan'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
          }`}
        >
          Dalam Penanganan
        </button>

        <button
          onClick={() => setFilterResolution('Selesai / Diganti')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            filterResolution === 'Selesai / Diganti'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          Selesai / Diganti
        </button>
      </div>

      {/* Issues Grid */}
      {filteredIssues.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak Ada Laundry Bermasalah</h3>
          <p className="text-xs text-slate-500 mt-1">Semua operasional laundry berjalan lancar dan tertib.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map((issue) => {
            const isEditing = editingIssueId === issue.id;

            return (
              <div
                key={issue.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-xs transition"
              >
                {/* Header: Issue type & status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    ⚠️ {issue.jenisMasalah} ({issue.jumlahBermasalah} pcs)
                  </span>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    issue.statusPenyelesaian === 'Selesai / Diganti'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : issue.statusPenyelesaian === 'Dalam Penanganan'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {issue.statusPenyelesaian}
                  </span>
                </div>

                {/* Transaksi & Santri info */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">
                      {issue.studentName}
                    </h3>
                    <span className="font-mono text-xs text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      {issue.nomorTransaksi}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {issue.kamar} • Dilaporkan pada {issue.tanggal} oleh {issue.petugas}
                  </p>
                </div>

                {/* Deskripsi */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div>
                    <span className="font-semibold text-slate-900">Kronologi / Deskripsi:</span>
                    <p className="mt-0.5 text-slate-600 leading-relaxed">{issue.deskripsi}</p>
                  </div>

                  {issue.solusi && !isEditing && (
                    <div className="pt-2 border-t border-slate-200 text-emerald-800">
                      <span className="font-semibold">Tindak Lanjut / Solusi:</span>
                      <p className="mt-0.5 italic">{issue.solusi}</p>
                    </div>
                  )}
                </div>

                {/* Inline edit form if active */}
                {isEditing && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                    <label className="font-bold text-amber-900 block">Perbarui Status Penyelesaian:</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as IssueResolution)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Menunggu Investigasi">Menunggu Investigasi</option>
                      <option value="Dalam Penanganan">Dalam Penanganan</option>
                      <option value="Selesai / Diganti">Selesai / Diganti</option>
                    </select>

                    <label className="font-bold text-amber-900 block mt-2">Catatan Solusi / Penyelesaian:</label>
                    <input
                      type="text"
                      placeholder="Misal: Sudah ditemukan di rak B-02 dan diserahkan ke santri"
                      value={editSolution}
                      onChange={(e) => setEditSolution(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />

                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingIssueId(null)}
                        className="px-3 py-1 rounded-md text-slate-600 hover:bg-slate-200"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(issue.id)}
                        className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        Simpan Solusi
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectTransactionById(issue.transactionId)}
                    className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Transaksi</span>
                  </button>

                  {userRole !== 'santri' && !isEditing && (
                    <button
                      onClick={() => handleStartEdit(issue)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold"
                    >
                      Ubah Status Solusi
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
