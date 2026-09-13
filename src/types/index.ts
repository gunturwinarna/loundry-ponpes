export type UserRole = 'admin' | 'petugas' | 'santri';

export type LaundryStatus = 
  | 'diterima'
  | 'proses_sortir'
  | 'dicuci'
  | 'dikeringkan'
  | 'disetrika'
  | 'siap_diambil'
  | 'sudah_diambil'
  | 'bermasalah';

export interface ClothingItems {
  baju: number;
  celana: number;
  sarung: number;
  koko: number;
  jaket: number;
  sprei: number;
  handuk: number;
  lainnya: number;
}

export interface Student {
  id: string; // e.g. "STR-001"
  namaLengkap: string;
  nis: string;
  kelas: string;
  kamar: string;
  asrama: string;
  noWhatsapp: string;
  statusAktif: boolean;
}

export interface Room {
  id: string;
  namaKamar: string;
  namaAsrama: string;
  kapasitas: number;
  keterangan?: string;
}

export interface Staff {
  id: string;
  nama: string;
  noHp: string;
  shift: 'Pagi' | 'Sore' | 'Full Time';
  status: 'Aktif' | 'Nonaktif';
}

export interface StatusHistoryEntry {
  id: string;
  status: LaundryStatus;
  tanggal: string; // YYYY-MM-DD
  jam: string; // HH:mm
  petugas: string;
  catatan?: string;
}

export interface LaundryTransaction {
  id: string; // Firestore Doc ID
  nomorTransaksi: string; // e.g. "LP-20260913-001"
  studentId: string;
  studentName: string;
  kamar: string;
  asrama: string;
  tanggalMasuk: string; // YYYY-MM-DD HH:mm
  estimasiSelesai: string; // YYYY-MM-DD
  jenisLayanan: string; // e.g. "Reguler (3 Hari)", "Kilat (1 Hari)"
  items: ClothingItems;
  totalPakaian: number;
  catatan?: string;
  status: LaundryStatus;
  petugasPenerima: string;
  tanggalDiambil?: string;
  petugasPengambil?: string;
  namaPengambil?: string;
  history: StatusHistoryEntry[];
  createdAt: number;
  updatedAt: number;
}

export type IssueType = 
  | 'Pakaian rusak'
  | 'Pakaian hilang'
  | 'Pakaian tertukar'
  | 'Noda tidak hilang'
  | 'Jumlah tidak sesuai'
  | 'Masalah lainnya';

export type IssueResolution = 'Menunggu Investigasi' | 'Dalam Penanganan' | 'Selesai / Diganti';

export interface LaundryIssue {
  id: string;
  transactionId: string;
  nomorTransaksi: string;
  studentId: string;
  studentName: string;
  kamar: string;
  jenisMasalah: IssueType;
  deskripsi: string;
  jumlahBermasalah: number;
  fotoBuktiUrl?: string;
  tanggal: string;
  petugas: string;
  statusPenyelesaian: IssueResolution;
  solusi?: string;
  updatedAt: number;
}

export interface NotificationItem {
  id: string;
  judul: string;
  pesan: string;
  tipe: 'diterima' | 'selesai' | 'bermasalah' | 'belum_diambil' | 'info';
  timestamp: string;
  dibaca: boolean;
  transactionId?: string;
  nomorTransaksi?: string;
  studentId?: string;
}

export interface AppUser {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  studentId?: string; // If role is santri
}
