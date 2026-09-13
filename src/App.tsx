import React, { useState } from 'react';
import { LaundryProvider, useLaundry } from './context/LaundryContext';
import { Navbar } from './components/Navbar';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ProcessLaundryView } from './components/ProcessLaundryView';
import { ReadyPickupView } from './components/ReadyPickupView';
import { IssuesView } from './components/IssuesView';
import { StudentsView } from './components/StudentsView';
import { RoomsAndStaffView } from './components/RoomsAndStaffView';
import { ReportsView } from './components/ReportsView';
import { SantriPortalView } from './components/SantriPortalView';
import { NewTransactionModal } from './components/NewTransactionModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { PickupModal } from './components/PickupModal';
import { ReportIssueModal } from './components/ReportIssueModal';
import { LaundryTransaction } from './types';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { userRole, transactions } = useLaundry();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<LaundryTransaction | null>(null);
  const [pickupTargetTx, setPickupTargetTx] = useState<LaundryTransaction | null>(null);
  const [issueTargetTx, setIssueTargetTx] = useState<LaundryTransaction | null>(null);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSelectTransactionById = (txId: string) => {
    const found = transactions.find(t => t.id === txId);
    if (found) {
      setSelectedTransaction(found);
    }
  };

  // Keep selectedTransaction updated if transaction in context was modified
  const currentSelectedTx = selectedTransaction
    ? transactions.find(t => t.id === selectedTransaction.id) || selectedTransaction
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Navbar */}
      <Navbar onOpenNewTransaction={() => setShowNewTxModal(true)} />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6">
        
        {/* Navigation (Sidebar on Desktop, Bottom bar on Mobile) */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewTx={() => setShowNewTxModal(true)}
        />

        {/* View Area */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onOpenNewTx={() => setShowNewTxModal(true)}
              onOpenPickupModal={(tx) => setPickupTargetTx(tx)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'proses' && (
            <ProcessLaundryView
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onOpenReportIssue={(tx) => setIssueTargetTx(tx)}
              onOpenPickupModal={(tx) => setPickupTargetTx(tx)}
            />
          )}

          {activeTab === 'siap_diambil' && (
            <ReadyPickupView
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onOpenPickupModal={(tx) => setPickupTargetTx(tx)}
            />
          )}

          {activeTab === 'masalah' && (
            <IssuesView
              onSelectTransactionById={handleSelectTransactionById}
            />
          )}

          {activeTab === 'santri' && (
            <StudentsView
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            />
          )}

          {activeTab === 'kamar_petugas' && (
            <RoomsAndStaffView />
          )}

          {activeTab === 'laporan' && (
            <ReportsView />
          )}

          {activeTab === 'portal_santri' && (
            <SantriPortalView
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
            />
          )}
        </main>

      </div>

      {/* Global Modals */}

      {/* 1. New Transaction Modal */}
      <NewTransactionModal
        isOpen={showNewTxModal}
        onClose={() => setShowNewTxModal(false)}
        onSuccess={(newTx) => {
          setSelectedTransaction(newTx);
          showToast(`Transaksi ${newTx.nomorTransaksi} berhasil dibuat untuk ${newTx.studentName}!`);
        }}
      />

      {/* 2. Transaction Detail & Timeline Modal */}
      <TransactionDetailModal
        transaction={currentSelectedTx}
        onClose={() => setSelectedTransaction(null)}
        onOpenPickupModal={(tx) => {
          setSelectedTransaction(null);
          setPickupTargetTx(tx);
        }}
        onOpenReportIssue={(tx) => {
          setSelectedTransaction(null);
          setIssueTargetTx(tx);
        }}
      />

      {/* 3. Pickup Modal */}
      <PickupModal
        transaction={pickupTargetTx}
        onClose={() => setPickupTargetTx(null)}
        onSuccess={() => {
          showToast(`Laundry telah berhasil ditandai SUDAH DIAMBIL!`);
        }}
      />

      {/* 4. Report Issue Modal */}
      <ReportIssueModal
        transaction={issueTargetTx}
        onClose={() => setIssueTargetTx(null)}
        onSuccess={() => {
          showToast(`Laporan masalah laundry berhasil dicatat.`);
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-18 md:bottom-6 right-4 z-50 flex items-center space-x-2 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200 border border-emerald-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <LaundryProvider>
      <MainContent />
    </LaundryProvider>
  );
}
