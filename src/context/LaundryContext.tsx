import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  LaundryStatus, 
  LaundryTransaction, 
  Student, 
  Room, 
  Staff, 
  LaundryIssue, 
  NotificationItem, 
  IssueResolution 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_ROOMS, 
  INITIAL_STAFF, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ISSUES, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

interface LaundryContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentStaffName: string;
  setCurrentStaffName: (name: string) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  transactions: LaundryTransaction[];
  students: Student[];
  rooms: Room[];
  staff: Staff[];
  issues: LaundryIssue[];
  notifications: NotificationItem[];
  isOnline: boolean;
  isInstallable: boolean;
  promptInstallApp: () => void;
  addTransaction: (data: {
    studentId: string;
    studentName: string;
    kamar: string;
    asrama: string;
    tanggalMasuk: string;
    estimasiSelesai: string;
    jenisLayanan: string;
    items: LaundryTransaction['items'];
    catatan?: string;
    petugasPenerima: string;
  }) => Promise<LaundryTransaction>;
  updateTransactionStatus: (id: string, newStatus: LaundryStatus, petugasName: string, notes?: string) => Promise<void>;
  markAsPickedUp: (id: string, pengambilName: string, petugasName: string) => Promise<void>;
  reportIssue: (issueData: Omit<LaundryIssue, 'id' | 'updatedAt'>) => Promise<void>;
  updateIssueResolution: (id: string, status: IssueResolution, solution?: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<Student>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addRoom: (room: Omit<Room, 'id'>) => Promise<void>;
  addStaff: (staff: Omit<Staff, 'id'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  resetDemoData: () => void;
}

const LaundryContext = createContext<LaundryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'lp_user_role',
  STAFF_NAME: 'lp_staff_name',
  ACTIVE_STUDENT: 'lp_active_student',
  TRANSACTIONS: 'lp_transactions',
  STUDENTS: 'lp_students',
  ROOMS: 'lp_rooms',
  STAFF: 'lp_staff',
  ISSUES: 'lp_issues',
  NOTIFICATIONS: 'lp_notifications'
};

export const LaundryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'petugas';
  });

  const [currentStaffName, setCurrentStaffNameState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.STAFF_NAME) || 'Kang Harun Ar-Rasyid';
  });

  const [activeStudentId, setActiveStudentIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT) || 'STR-001';
  });

  const [transactions, setTransactions] = useState<LaundryTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [issues, setIssues] = useState<LaundryIssue[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  // Online / offline detector
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Firestore sync listener
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'laundry_transactions'), (snapshot) => {
        if (!snapshot.empty) {
          const list: LaundryTransaction[] = [];
          snapshot.forEach((d) => {
            list.push({ ...d.data(), id: d.id } as LaundryTransaction);
          });
          // Sort descending by createdAt
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setTransactions(list);
        }
      }, (error) => {
        console.warn('Firestore transactions sync fallback to local:', error.message);
      });
      return () => unsub();
    } catch {
      // ignore
    }
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  };

  const setCurrentStaffName = (name: string) => {
    setCurrentStaffNameState(name);
    localStorage.setItem(STORAGE_KEYS.STAFF_NAME, name);
  };

  const setActiveStudentId = (id: string) => {
    setActiveStudentIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, id);
  };

  const promptInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  const addTransaction = async (data: {
    studentId: string;
    studentName: string;
    kamar: string;
    asrama: string;
    tanggalMasuk: string;
    estimasiSelesai: string;
    jenisLayanan: string;
    items: LaundryTransaction['items'];
    catatan?: string;
    petugasPenerima: string;
  }): Promise<LaundryTransaction> => {
    const totalPakaian = Object.values(data.items).reduce((sum, val) => sum + (val || 0), 0);
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const nomorTransaksi = `LP-${dateStr}-${randomSuffix}`;
    const id = `tx-${Date.now()}`;
    
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toISOString().slice(0, 10);

    const newTx: LaundryTransaction = {
      id,
      nomorTransaksi,
      studentId: data.studentId,
      studentName: data.studentName,
      kamar: data.kamar,
      asrama: data.asrama,
      tanggalMasuk: data.tanggalMasuk || `${dateFormatted} ${timeFormatted}`,
      estimasiSelesai: data.estimasiSelesai,
      jenisLayanan: data.jenisLayanan,
      items: data.items,
      totalPakaian,
      catatan: data.catatan || '',
      status: 'diterima',
      petugasPenerima: data.petugasPenerima,
      history: [
        {
          id: `h-${Date.now()}`,
          status: 'diterima',
          tanggal: dateFormatted,
          jam: timeFormatted,
          petugas: data.petugasPenerima,
          catatan: 'Laundry diterima dan dicatat ke sistem'
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      judul: 'Laundry Masuk Baru',
      pesan: `Transaksi ${nomorTransaksi} (${data.studentName} - ${totalPakaian} pcs) berhasil didaftarkan.`,
      tipe: 'diterima',
      timestamp: 'Baru saja',
      dibaca: false,
      transactionId: id,
      nomorTransaksi,
      studentId: data.studentId
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Async write to Firestore
    try {
      await setDoc(doc(db, 'laundry_transactions', id), newTx);
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
    } catch (err) {
      console.warn('Firestore write error (using local storage):', err);
    }

    return newTx;
  };

  const updateTransactionStatus = async (
    id: string, 
    newStatus: LaundryStatus, 
    petugasName: string, 
    notes?: string
  ) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toISOString().slice(0, 10);

    let updatedTx: LaundryTransaction | null = null;

    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          const newHistory = [
            ...tx.history,
            {
              id: `h-${Date.now()}`,
              status: newStatus,
              tanggal: dateFormatted,
              jam: timeFormatted,
              petugas: petugasName,
              catatan: notes || `Status diubah menjadi ${newStatus.replace('_', ' ')}`
            }
          ];

          updatedTx = {
            ...tx,
            status: newStatus,
            history: newHistory,
            updatedAt: Date.now()
          };
          return updatedTx;
        }
        return tx;
      })
    );

    // If marked ready for pickup, trigger notification
    if (newStatus === 'siap_diambil' && updatedTx) {
      const readyTx = updatedTx as LaundryTransaction;
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        judul: 'Laundry Siap Diambil!',
        pesan: `Laundry ${readyTx.nomorTransaksi} milik ${readyTx.studentName} (${readyTx.totalPakaian} pcs) sudah selesai dan siap diambil.`,
        tipe: 'selesai',
        timestamp: 'Baru saja',
        dibaca: false,
        transactionId: readyTx.id,
        nomorTransaksi: readyTx.nomorTransaksi,
        studentId: readyTx.studentId
      };
      setNotifications((prev) => [notif, ...prev]);
      try {
        await setDoc(doc(db, 'notifications', notif.id), notif);
      } catch {
        // ignore
      }
    }

    // Sync to Firestore
    try {
      if (updatedTx) {
        await updateDoc(doc(db, 'laundry_transactions', id), {
          status: newStatus,
          history: (updatedTx as LaundryTransaction).history,
          updatedAt: Date.now()
        });
      }
    } catch (err) {
      console.warn('Firestore update error (using local state):', err);
    }
  };

  const markAsPickedUp = async (id: string, pengambilName: string, petugasName: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toISOString().slice(0, 10);
    const fullDateTime = `${dateFormatted} ${timeFormatted}`;

    let updatedTx: LaundryTransaction | null = null;

    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          const newHistory = [
            ...tx.history,
            {
              id: `h-${Date.now()}`,
              status: 'sudah_diambil' as LaundryStatus,
              tanggal: dateFormatted,
              jam: timeFormatted,
              petugas: petugasName,
              catatan: `Diambil oleh ${pengambilName}, diserahkan oleh ${petugasName}`
            }
          ];

          updatedTx = {
            ...tx,
            status: 'sudah_diambil',
            tanggalDiambil: fullDateTime,
            namaPengambil: pengambilName,
            petugasPengambil: petugasName,
            history: newHistory,
            updatedAt: Date.now()
          };
          return updatedTx;
        }
        return tx;
      })
    );

    // Sync to Firestore
    try {
      if (updatedTx) {
        await updateDoc(doc(db, 'laundry_transactions', id), {
          status: 'sudah_diambil',
          tanggalDiambil: fullDateTime,
          namaPengambil: pengambilName,
          petugasPengambil: petugasName,
          history: (updatedTx as LaundryTransaction).history,
          updatedAt: Date.now()
        });
      }
    } catch (err) {
      console.warn('Firestore pickup update error:', err);
    }
  };

  const reportIssue = async (issueData: Omit<LaundryIssue, 'id' | 'updatedAt'>) => {
    const id = `iss-${Date.now()}`;
    const newIssue: LaundryIssue = {
      ...issueData,
      id,
      updatedAt: Date.now()
    };

    setIssues((prev) => [newIssue, ...prev]);

    // Also update the transaction status to "bermasalah"
    await updateTransactionStatus(
      issueData.transactionId,
      'bermasalah',
      issueData.petugas,
      `Masalah dilaporkan: ${issueData.jenisMasalah} - ${issueData.deskripsi}`
    );

    // Add alert notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      judul: 'Laporan Masalah Laundry',
      pesan: `Transaksi ${issueData.nomorTransaksi} (${issueData.studentName}) dilaporkan: ${issueData.jenisMasalah}.`,
      tipe: 'bermasalah',
      timestamp: 'Baru saja',
      dibaca: false,
      transactionId: issueData.transactionId,
      nomorTransaksi: issueData.nomorTransaksi,
      studentId: issueData.studentId
    };
    setNotifications((prev) => [notif, ...prev]);

    try {
      await setDoc(doc(db, 'laundry_issues', id), newIssue);
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (err) {
      console.warn('Firestore issue error:', err);
    }
  };

  const updateIssueResolution = async (id: string, status: IssueResolution, solution?: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === id) {
          return {
            ...iss,
            statusPenyelesaian: status,
            solusi: solution !== undefined ? solution : iss.solusi,
            updatedAt: Date.now()
          };
        }
        return iss;
      })
    );

    try {
      await updateDoc(doc(db, 'laundry_issues', id), {
        statusPenyelesaian: status,
        solusi: solution,
        updatedAt: Date.now()
      });
    } catch (err) {
      console.warn('Firestore update issue error:', err);
    }
  };

  const addStudent = async (data: Omit<Student, 'id'>): Promise<Student> => {
    const id = `STR-${String(students.length + 1).padStart(3, '0')}`;
    const newStudent: Student = { ...data, id };
    setStudents((prev) => [newStudent, ...prev]);

    try {
      await setDoc(doc(db, 'students', id), newStudent);
    } catch (err) {
      console.warn('Firestore student save error:', err);
    }
    return newStudent;
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );

    try {
      await updateDoc(doc(db, 'students', id), data);
    } catch (err) {
      console.warn('Firestore student update error:', err);
    }
  };

  const deleteStudent = async (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (err) {
      console.warn('Firestore student delete error:', err);
    }
  };

  const addRoom = async (data: Omit<Room, 'id'>) => {
    const id = `RM-${String(rooms.length + 1).padStart(2, '0')}`;
    const newRoom: Room = { ...data, id };
    setRooms((prev) => [...prev, newRoom]);

    try {
      await setDoc(doc(db, 'rooms', id), newRoom);
    } catch (err) {
      console.warn('Firestore room error:', err);
    }
  };

  const addStaff = async (data: Omit<Staff, 'id'>) => {
    const id = `STF-${String(staff.length + 1).padStart(2, '0')}`;
    const newStaff: Staff = { ...data, id };
    setStaff((prev) => [...prev, newStaff]);

    try {
      await setDoc(doc(db, 'users', id), newStaff);
    } catch (err) {
      console.warn('Firestore staff error:', err);
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, dibaca: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, dibaca: true })));
  };

  const resetDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setStudents(INITIAL_STUDENTS);
    setRooms(INITIAL_ROOMS);
    setStaff(INITIAL_STAFF);
    setIssues(INITIAL_ISSUES);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  return (
    <LaundryContext.Provider
      value={{
        userRole,
        setUserRole,
        currentStaffName,
        setCurrentStaffName,
        activeStudentId,
        setActiveStudentId,
        transactions,
        students,
        rooms,
        staff,
        issues,
        notifications,
        isOnline,
        isInstallable,
        promptInstallApp,
        addTransaction,
        updateTransactionStatus,
        markAsPickedUp,
        reportIssue,
        updateIssueResolution,
        addStudent,
        updateStudent,
        deleteStudent,
        addRoom,
        addStaff,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData
      }}
    >
      {children}
    </LaundryContext.Provider>
  );
};

export const useLaundry = () => {
  const context = useContext(LaundryContext);
  if (!context) {
    throw new Error('useLaundry must be used within a LaundryProvider');
  }
  return context;
};
