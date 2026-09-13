import { Student, Room, Staff, LaundryTransaction, LaundryIssue, NotificationItem } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STR-001',
    namaLengkap: 'Muhammad Azka Fathoni',
    nis: '20241001',
    kelas: '11 MA Keagamaan',
    kamar: 'Kamar Abu Bakar 01',
    asrama: 'Asrama Al-Ghazali',
    noWhatsapp: '081234567801',
    statusAktif: true
  },
  {
    id: 'STR-002',
    namaLengkap: 'Ahmad Zaki Al-Faruq',
    nis: '20241002',
    kelas: '12 MA IPA',
    kamar: 'Kamar Abu Bakar 02',
    asrama: 'Asrama Al-Ghazali',
    noWhatsapp: '081234567802',
    statusAktif: true
  },
  {
    id: 'STR-003',
    namaLengkap: 'Fathur Rahman Syah',
    nis: '20241003',
    kelas: '10 MA IPS',
    kamar: 'Kamar Umar 01',
    asrama: 'Asrama Ibnu Sina',
    noWhatsapp: '081234567803',
    statusAktif: true
  },
  {
    id: 'STR-004',
    namaLengkap: 'Hanif Al-Baqir',
    nis: '20241004',
    kelas: '9 MTs A',
    kamar: 'Kamar Umar 02',
    asrama: 'Asrama Ibnu Sina',
    noWhatsapp: '081234567804',
    statusAktif: true
  },
  {
    id: 'STR-005',
    namaLengkap: 'Rizqi Ramadhan',
    nis: '20241005',
    kelas: '8 MTs B',
    kamar: 'Kamar Utsman 01',
    asrama: 'Asrama Asy-Syafi\'i',
    noWhatsapp: '081234567805',
    statusAktif: true
  },
  {
    id: 'STR-006',
    namaLengkap: 'M. Bilal Nashrullah',
    nis: '20241006',
    kelas: '11 MA IPA',
    kamar: 'Kamar Utsman 02',
    asrama: 'Asrama Asy-Syafi\'i',
    noWhatsapp: '081234567806',
    statusAktif: true
  },
  {
    id: 'STR-007',
    namaLengkap: 'Faris Hibatullah',
    nis: '20241007',
    kelas: '10 MA Keagamaan',
    kamar: 'Kamar Ali 01',
    asrama: 'Asrama Al-Ghazali',
    noWhatsapp: '081234567807',
    statusAktif: true
  },
  {
    id: 'STR-008',
    namaLengkap: 'Salman Al-Farisi',
    nis: '20241008',
    kelas: '12 MA Bahasa',
    kamar: 'Kamar Ali 02',
    asrama: 'Asrama Al-Ghazali',
    noWhatsapp: '081234567808',
    statusAktif: true
  },
  {
    id: 'STR-009',
    namaLengkap: 'Siti Aisyah Rahmawati',
    nis: '20242001',
    kelas: '11 MA IPA Putri',
    kamar: 'Kamar Khadijah 01',
    asrama: 'Asrama Khadijah',
    noWhatsapp: '081234567809',
    statusAktif: true
  },
  {
    id: 'STR-010',
    namaLengkap: 'Nabila Zahra Syahrani',
    nis: '20242002',
    kelas: '10 MA Keagamaan Putri',
    kamar: 'Kamar Khadijah 02',
    asrama: 'Asrama Khadijah',
    noWhatsapp: '081234567810',
    statusAktif: true
  },
  {
    id: 'STR-011',
    namaLengkap: 'Fatimah Azzahra',
    nis: '20242003',
    kelas: '12 MA IPA Putri',
    kamar: 'Kamar Fatimah 01',
    asrama: 'Asrama Fatimah',
    noWhatsapp: '081234567811',
    statusAktif: true
  },
  {
    id: 'STR-012',
    namaLengkap: 'Nurul Hidayah',
    nis: '20242004',
    kelas: '9 MTs Putri A',
    kamar: 'Kamar Fatimah 02',
    asrama: 'Asrama Fatimah',
    noWhatsapp: '081234567812',
    statusAktif: true
  },
  {
    id: 'STR-013',
    namaLengkap: 'Daffa Ihsan Mubarak',
    nis: '20241009',
    kelas: '7 MTs Unggulan',
    kamar: 'Kamar Abu Bakar 01',
    asrama: 'Asrama Al-Ghazali',
    noWhatsapp: '081234567813',
    statusAktif: true
  },
  {
    id: 'STR-014',
    namaLengkap: 'Raihan Robbani',
    nis: '20241010',
    kelas: '8 MTs Tahfidz',
    kamar: 'Kamar Umar 01',
    asrama: 'Asrama Ibnu Sina',
    noWhatsapp: '081234567814',
    statusAktif: true
  },
  {
    id: 'STR-015',
    namaLengkap: 'Zulfa Muthmainnah',
    nis: '20242005',
    kelas: '11 MA Bahasa Putri',
    kamar: 'Kamar Khadijah 01',
    asrama: 'Asrama Khadijah',
    noWhatsapp: '081234567815',
    statusAktif: false
  }
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'RM-01', namaKamar: 'Kamar Abu Bakar 01', namaAsrama: 'Asrama Al-Ghazali', kapasitas: 8, keterangan: 'Lantai 1 Asrama Putra' },
  { id: 'RM-02', namaKamar: 'Kamar Abu Bakar 02', namaAsrama: 'Asrama Al-Ghazali', kapasitas: 8, keterangan: 'Lantai 1 Asrama Putra' },
  { id: 'RM-03', namaKamar: 'Kamar Umar 01', namaAsrama: 'Asrama Ibnu Sina', kapasitas: 6, keterangan: 'Lantai 2 Asrama Putra' },
  { id: 'RM-04', namaKamar: 'Kamar Umar 02', namaAsrama: 'Asrama Ibnu Sina', kapasitas: 6, keterangan: 'Lantai 2 Asrama Putra' },
  { id: 'RM-05', namaKamar: 'Kamar Utsman 01', namaAsrama: 'Asrama Asy-Syafi\'i', kapasitas: 10, keterangan: 'Gedung Tahfidz Putra' },
  { id: 'RM-06', namaKamar: 'Kamar Ali 01', namaAsrama: 'Asrama Al-Ghazali', kapasitas: 8, keterangan: 'Lantai dasar Putra' },
  { id: 'RM-07', namaKamar: 'Kamar Khadijah 01', namaAsrama: 'Asrama Khadijah', kapasitas: 8, keterangan: 'Lantai 1 Asrama Putri' },
  { id: 'RM-08', namaKamar: 'Kamar Fatimah 01', namaAsrama: 'Asrama Fatimah', kapasitas: 8, keterangan: 'Lantai 2 Asrama Putri' }
];

export const INITIAL_STAFF: Staff[] = [
  { id: 'STF-01', nama: 'Kang Harun Ar-Rasyid', noHp: '08218899001', shift: 'Pagi', status: 'Aktif' },
  { id: 'STF-02', nama: 'Kang Ridwan Hakim', noHp: '08218899002', shift: 'Sore', status: 'Aktif' },
  { id: 'STF-03', nama: 'Teh Maryam Sholiha', noHp: '08218899003', shift: 'Pagi', status: 'Aktif' },
  { id: 'STF-04', nama: 'Kang Latif Nurhadi', noHp: '08218899004', shift: 'Full Time', status: 'Aktif' }
];

export const INITIAL_TRANSACTIONS: LaundryTransaction[] = [
  {
    id: 'tx-001',
    nomorTransaksi: 'LP-20260913-001',
    studentId: 'STR-001',
    studentName: 'Muhammad Azka Fathoni',
    kamar: 'Kamar Abu Bakar 01',
    asrama: 'Asrama Al-Ghazali',
    tanggalMasuk: '2026-09-11 08:30',
    estimasiSelesai: '2026-09-13',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 5, celana: 3, sarung: 2, koko: 2, jaket: 0, sprei: 0, handuk: 1, lainnya: 0 },
    totalPakaian: 13,
    catatan: 'Sarung warna hijau cap mangga, baju koko putih jangan disikat kasar',
    status: 'siap_diambil',
    petugasPenerima: 'Kang Harun Ar-Rasyid',
    history: [
      { id: 'h-1-1', status: 'diterima', tanggal: '2026-09-11', jam: '08:30', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Pakaian diterima lengkap' },
      { id: 'h-1-2', status: 'proses_sortir', tanggal: '2026-09-11', jam: '10:15', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Pemisahan warna putih dan sarung' },
      { id: 'h-1-3', status: 'dicuci', tanggal: '2026-09-11', jam: '13:00', petugas: 'Kang Ridwan Hakim', catatan: 'Mesin Cuci 02' },
      { id: 'h-1-4', status: 'dikeringkan', tanggal: '2026-09-12', jam: '08:00', petugas: 'Teh Maryam Sholiha', catatan: 'Pengeringan selesai' },
      { id: 'h-1-5', status: 'disetrika', tanggal: '2026-09-12', jam: '14:30', petugas: 'Kang Latif Nurhadi', catatan: 'Setrika uap rapi & wangi lavender' },
      { id: 'h-1-6', status: 'siap_diambil', tanggal: '2026-09-13', jam: '08:00', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Sudah dipacking plastik laundry' }
    ],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 7200000
  },
  {
    id: 'tx-002',
    nomorTransaksi: 'LP-20260913-002',
    studentId: 'STR-003',
    studentName: 'Fathur Rahman Syah',
    kamar: 'Kamar Umar 01',
    asrama: 'Asrama Ibnu Sina',
    tanggalMasuk: '2026-09-11 09:00',
    estimasiSelesai: '2026-09-13',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 4, celana: 3, sarung: 1, koko: 1, jaket: 1, sprei: 0, handuk: 1, lainnya: 0 },
    totalPakaian: 11,
    catatan: 'Jaket hitam almamater pesantren',
    status: 'siap_diambil',
    petugasPenerima: 'Kang Harun Ar-Rasyid',
    history: [
      { id: 'h-2-1', status: 'diterima', tanggal: '2026-09-11', jam: '09:00', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Diterima di loket' },
      { id: 'h-2-2', status: 'proses_sortir', tanggal: '2026-09-11', jam: '11:00', petugas: 'Kang Harun Ar-Rasyid' },
      { id: 'h-2-3', status: 'dicuci', tanggal: '2026-09-11', jam: '14:20', petugas: 'Kang Ridwan Hakim' },
      { id: 'h-2-4', status: 'dikeringkan', tanggal: '2026-09-12', jam: '09:15', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-2-5', status: 'disetrika', tanggal: '2026-09-12', jam: '16:00', petugas: 'Kang Latif Nurhadi' },
      { id: 'h-2-6', status: 'siap_diambil', tanggal: '2026-09-13', jam: '08:30', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Siap di rak B-04' }
    ],
    createdAt: Date.now() - 170000000,
    updatedAt: Date.now() - 6000000
  },
  {
    id: 'tx-003',
    nomorTransaksi: 'LP-20260913-003',
    studentId: 'STR-002',
    studentName: 'Ahmad Zaki Al-Faruq',
    kamar: 'Kamar Abu Bakar 02',
    asrama: 'Asrama Al-Ghazali',
    tanggalMasuk: '2026-09-12 08:15',
    estimasiSelesai: '2026-09-14',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 6, celana: 4, sarung: 2, koko: 2, jaket: 0, sprei: 1, handuk: 1, lainnya: 0 },
    totalPakaian: 16,
    catatan: 'Sprei kasur motif kotak biru',
    status: 'disetrika',
    petugasPenerima: 'Kang Ridwan Hakim',
    history: [
      { id: 'h-3-1', status: 'diterima', tanggal: '2026-09-12', jam: '08:15', petugas: 'Kang Ridwan Hakim' },
      { id: 'h-3-2', status: 'proses_sortir', tanggal: '2026-09-12', jam: '10:00', petugas: 'Kang Ridwan Hakim' },
      { id: 'h-3-3', status: 'dicuci', tanggal: '2026-09-12', jam: '13:30', petugas: 'Kang Latif Nurhadi' },
      { id: 'h-3-4', status: 'dikeringkan', tanggal: '2026-09-12', jam: '17:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-3-5', status: 'disetrika', tanggal: '2026-09-13', jam: '07:45', petugas: 'Teh Maryam Sholiha', catatan: 'Sedang disetrika' }
    ],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'tx-004',
    nomorTransaksi: 'LP-20260913-004',
    studentId: 'STR-005',
    studentName: 'Rizqi Ramadhan',
    kamar: 'Kamar Utsman 01',
    asrama: 'Asrama Asy-Syafi\'i',
    tanggalMasuk: '2026-09-12 10:45',
    estimasiSelesai: '2026-09-14',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 3, celana: 2, sarung: 2, koko: 1, jaket: 0, sprei: 0, handuk: 1, lainnya: 0 },
    totalPakaian: 9,
    catatan: '',
    status: 'dikeringkan',
    petugasPenerima: 'Teh Maryam Sholiha',
    history: [
      { id: 'h-4-1', status: 'diterima', tanggal: '2026-09-12', jam: '10:45', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-4-2', status: 'proses_sortir', tanggal: '2026-09-12', jam: '13:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-4-3', status: 'dicuci', tanggal: '2026-09-12', jam: '15:30', petugas: 'Kang Ridwan Hakim' },
      { id: 'h-4-4', status: 'dikeringkan', tanggal: '2026-09-13', jam: '08:00', petugas: 'Kang Latif Nurhadi', catatan: 'Mesin dryer 01' }
    ],
    createdAt: Date.now() - 79200000,
    updatedAt: Date.now() - 2500000
  },
  {
    id: 'tx-005',
    nomorTransaksi: 'LP-20260913-005',
    studentId: 'STR-009',
    studentName: 'Siti Aisyah Rahmawati',
    kamar: 'Kamar Khadijah 01',
    asrama: 'Asrama Khadijah',
    tanggalMasuk: '2026-09-12 14:00',
    estimasiSelesai: '2026-09-14',
    jenisLayanan: 'Cuci Setrika',
    items: { baju: 5, celana: 2, sarung: 0, koko: 0, jaket: 1, sprei: 0, handuk: 1, lainnya: 3 },
    totalPakaian: 12,
    catatan: 'Lainnya berupa 3 jilbab instan hitam dan cokelat',
    status: 'dicuci',
    petugasPenerima: 'Teh Maryam Sholiha',
    history: [
      { id: 'h-5-1', status: 'diterima', tanggal: '2026-09-12', jam: '14:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-5-2', status: 'proses_sortir', tanggal: '2026-09-12', jam: '16:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-5-3', status: 'dicuci', tanggal: '2026-09-13', jam: '08:30', petugas: 'Teh Maryam Sholiha', catatan: 'Cuci lembut untuk jilbab' }
    ],
    createdAt: Date.now() - 64800000,
    updatedAt: Date.now() - 1800000
  },
  {
    id: 'tx-006',
    nomorTransaksi: 'LP-20260913-006',
    studentId: 'STR-006',
    studentName: 'M. Bilal Nashrullah',
    kamar: 'Kamar Utsman 02',
    asrama: 'Asrama Asy-Syafi\'i',
    tanggalMasuk: '2026-09-13 07:15',
    estimasiSelesai: '2026-09-13',
    jenisLayanan: 'Kilat (1 Hari)',
    items: { baju: 2, celana: 2, sarung: 1, koko: 1, jaket: 0, sprei: 0, handuk: 0, lainnya: 0 },
    totalPakaian: 6,
    catatan: 'Paket Kilat 1 Hari - Seragam upacara besok',
    status: 'proses_sortir',
    petugasPenerima: 'Kang Harun Ar-Rasyid',
    history: [
      { id: 'h-6-1', status: 'diterima', tanggal: '2026-09-13', jam: '07:15', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Layanan Kilat Masuk' },
      { id: 'h-6-2', status: 'proses_sortir', tanggal: '2026-09-13', jam: '08:00', petugas: 'Kang Harun Ar-Rasyid' }
    ],
    createdAt: Date.now() - 14400000,
    updatedAt: Date.now() - 10800000
  },
  {
    id: 'tx-007',
    nomorTransaksi: 'LP-20260913-007',
    studentId: 'STR-004',
    studentName: 'Hanif Al-Baqir',
    kamar: 'Kamar Umar 02',
    asrama: 'Asrama Ibnu Sina',
    tanggalMasuk: '2026-09-13 08:10',
    estimasiSelesai: '2026-09-15',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 4, celana: 3, sarung: 2, koko: 1, jaket: 0, sprei: 0, handuk: 1, lainnya: 0 },
    totalPakaian: 11,
    catatan: '',
    status: 'diterima',
    petugasPenerima: 'Kang Harun Ar-Rasyid',
    history: [
      { id: 'h-7-1', status: 'diterima', tanggal: '2026-09-13', jam: '08:10', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Laundry baru masuk hari ini' }
    ],
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000
  },
  {
    id: 'tx-008',
    nomorTransaksi: 'LP-20260913-008',
    studentId: 'STR-007',
    studentName: 'Faris Hibatullah',
    kamar: 'Kamar Ali 01',
    asrama: 'Asrama Al-Ghazali',
    tanggalMasuk: '2026-09-13 09:25',
    estimasiSelesai: '2026-09-15',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 5, celana: 3, sarung: 1, koko: 2, jaket: 1, sprei: 0, handuk: 1, lainnya: 0 },
    totalPakaian: 13,
    catatan: 'Sarung wadimor hitam motif garis',
    status: 'diterima',
    petugasPenerima: 'Kang Harun Ar-Rasyid',
    history: [
      { id: 'h-8-1', status: 'diterima', tanggal: '2026-09-13', jam: '09:25', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Pakaian dicek dan dihitung' }
    ],
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'tx-009',
    nomorTransaksi: 'LP-20260912-009',
    studentId: 'STR-008',
    studentName: 'Salman Al-Farisi',
    kamar: 'Kamar Ali 02',
    asrama: 'Asrama Al-Ghazali',
    tanggalMasuk: '2026-09-11 11:30',
    estimasiSelesai: '2026-09-13',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 4, celana: 3, sarung: 2, koko: 1, jaket: 0, sprei: 0, handuk: 1, lainnya: 0 },
    totalPakaian: 11,
    catatan: 'Sarung bHS sutra cokelat',
    status: 'bermasalah',
    petugasPenerima: 'Kang Ridwan Hakim',
    history: [
      { id: 'h-9-1', status: 'diterima', tanggal: '2026-09-11', jam: '11:30', petugas: 'Kang Ridwan Hakim' },
      { id: 'h-9-2', status: 'proses_sortir', tanggal: '2026-09-11', jam: '14:00', petugas: 'Kang Ridwan Hakim' },
      { id: 'h-9-3', status: 'bermasalah', tanggal: '2026-09-12', jam: '09:30', petugas: 'Teh Maryam Sholiha', catatan: '1 Sarung tertukar saat penyortiran' }
    ],
    createdAt: Date.now() - 160000000,
    updatedAt: Date.now() - 50000000
  },
  {
    id: 'tx-010',
    nomorTransaksi: 'LP-20260912-010',
    studentId: 'STR-010',
    studentName: 'Nabila Zahra Syahrani',
    kamar: 'Kamar Khadijah 02',
    asrama: 'Asrama Khadijah',
    tanggalMasuk: '2026-09-11 15:20',
    estimasiSelesai: '2026-09-13',
    jenisLayanan: 'Cuci Setrika',
    items: { baju: 6, celana: 2, sarung: 0, koko: 0, jaket: 1, sprei: 0, handuk: 1, lainnya: 2 },
    totalPakaian: 12,
    catatan: 'Gamis putih ada noda tinta pulpen di lengan kanan',
    status: 'bermasalah',
    petugasPenerima: 'Teh Maryam Sholiha',
    history: [
      { id: 'h-10-1', status: 'diterima', tanggal: '2026-09-11', jam: '15:20', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-10-2', status: 'dicuci', tanggal: '2026-09-12', jam: '10:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-10-3', status: 'bermasalah', tanggal: '2026-09-12', jam: '13:45', petugas: 'Teh Maryam Sholiha', catatan: 'Noda tinta pulpen membandel tidak hilang setelah 2x cuci' }
    ],
    createdAt: Date.now() - 140000000,
    updatedAt: Date.now() - 40000000
  },
  {
    id: 'tx-011',
    nomorTransaksi: 'LP-20260910-011',
    studentId: 'STR-011',
    studentName: 'Fatimah Azzahra',
    kamar: 'Kamar Fatimah 01',
    asrama: 'Asrama Fatimah',
    tanggalMasuk: '2026-09-08 09:00',
    estimasiSelesai: '2026-09-10',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 5, celana: 2, sarung: 0, koko: 0, jaket: 0, sprei: 1, handuk: 1, lainnya: 3 },
    totalPakaian: 12,
    catatan: '',
    status: 'sudah_diambil',
    petugasPenerima: 'Teh Maryam Sholiha',
    tanggalDiambil: '2026-09-10 16:30',
    petugasPengambil: 'Teh Maryam Sholiha',
    namaPengambil: 'Fatimah Azzahra (Sendiri)',
    history: [
      { id: 'h-11-1', status: 'diterima', tanggal: '2026-09-08', jam: '09:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-11-2', status: 'proses_sortir', tanggal: '2026-09-08', jam: '11:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-11-3', status: 'dicuci', tanggal: '2026-09-08', jam: '14:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-11-4', status: 'dikeringkan', tanggal: '2026-09-09', jam: '09:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-11-5', status: 'disetrika', tanggal: '2026-09-09', jam: '15:00', petugas: 'Kang Latif Nurhadi' },
      { id: 'h-11-6', status: 'siap_diambil', tanggal: '2026-09-10', jam: '08:30', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-11-7', status: 'sudah_diambil', tanggal: '2026-09-10', jam: '16:30', petugas: 'Teh Maryam Sholiha', catatan: 'Diambil sendiri oleh santriwati Fatimah Azzahra' }
    ],
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now() - 259200000
  },
  {
    id: 'tx-012',
    nomorTransaksi: 'LP-20260909-012',
    studentId: 'STR-001',
    studentName: 'Muhammad Azka Fathoni',
    kamar: 'Kamar Abu Bakar 01',
    asrama: 'Asrama Al-Ghazali',
    tanggalMasuk: '2026-09-06 08:00',
    estimasiSelesai: '2026-09-08',
    jenisLayanan: 'Reguler (3 Hari)',
    items: { baju: 4, celana: 3, sarung: 2, koko: 2, jaket: 0, sprei: 0, handuk: 1, lainnya: 0 },
    totalPakaian: 12,
    catatan: '',
    status: 'sudah_diambil',
    petugasPenerima: 'Kang Harun Ar-Rasyid',
    tanggalDiambil: '2026-09-08 17:00',
    petugasPengambil: 'Kang Harun Ar-Rasyid',
    namaPengambil: 'Muhammad Azka Fathoni (Sendiri)',
    history: [
      { id: 'h-12-1', status: 'diterima', tanggal: '2026-09-06', jam: '08:00', petugas: 'Kang Harun Ar-Rasyid' },
      { id: 'h-12-2', status: 'dicuci', tanggal: '2026-09-06', jam: '14:00', petugas: 'Kang Ridwan Hakim' },
      { id: 'h-12-3', status: 'dikeringkan', tanggal: '2026-09-07', jam: '08:00', petugas: 'Teh Maryam Sholiha' },
      { id: 'h-12-4', status: 'disetrika', tanggal: '2026-09-07', jam: '16:00', petugas: 'Kang Latif Nurhadi' },
      { id: 'h-12-5', status: 'siap_diambil', tanggal: '2026-09-08', jam: '08:00', petugas: 'Kang Harun Ar-Rasyid' },
      { id: 'h-12-6', status: 'sudah_diambil', tanggal: '2026-09-08', jam: '17:00', petugas: 'Kang Harun Ar-Rasyid', catatan: 'Diambil santri' }
    ],
    createdAt: Date.now() - 604800000,
    updatedAt: Date.now() - 432000000
  }
];

export const INITIAL_ISSUES: LaundryIssue[] = [
  {
    id: 'iss-001',
    transactionId: 'tx-009',
    nomorTransaksi: 'LP-20260912-009',
    studentId: 'STR-008',
    studentName: 'Salman Al-Farisi',
    kamar: 'Kamar Ali 02',
    jenisMasalah: 'Pakaian tertukar',
    deskripsi: 'Sarung BHS sutra cokelat tertukar dengan sarung serupa saat proses lipat.',
    jumlahBermasalah: 1,
    tanggal: '2026-09-12 09:30',
    petugas: 'Teh Maryam Sholiha',
    statusPenyelesaian: 'Dalam Penanganan',
    solusi: 'Sedang dicocokkan dengan tumpukan laundry kamar Ali 01 dan Abu Bakar 02',
    updatedAt: Date.now() - 40000000
  },
  {
    id: 'iss-002',
    transactionId: 'tx-010',
    nomorTransaksi: 'LP-20260912-010',
    studentId: 'STR-010',
    studentName: 'Nabila Zahra Syahrani',
    kamar: 'Kamar Khadijah 02',
    jenisMasalah: 'Noda tidak hilang',
    deskripsi: 'Noda tinta pulpen membandel di bagian pergelangan tangan gamis putih.',
    jumlahBermasalah: 1,
    tanggal: '2026-09-12 13:45',
    petugas: 'Teh Maryam Sholiha',
    statusPenyelesaian: 'Menunggu Investigasi',
    solusi: 'Menghubungi santriwati untuk izin menggunakan cairan pembersih khusus anti noda tinta',
    updatedAt: Date.now() - 35000000
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    judul: 'Laundry Siap Diambil!',
    pesan: 'Laundry LP-20260913-001 atas nama Muhammad Azka Fathoni sudah selesai disetrika dan siap diambil di loket.',
    tipe: 'selesai',
    timestamp: 'Hari ini, 08:00',
    dibaca: false,
    transactionId: 'tx-001',
    nomorTransaksi: 'LP-20260913-001',
    studentId: 'STR-001'
  },
  {
    id: 'notif-002',
    judul: 'Peringatan Masalah Laundry',
    pesan: 'Laporan pakaian tertukar pada transaksi LP-20260912-009 santri Salman Al-Farisi perlu penanganan.',
    tipe: 'bermasalah',
    timestamp: 'Kemarin, 09:30',
    dibaca: false,
    transactionId: 'tx-009',
    nomorTransaksi: 'LP-20260912-009'
  },
  {
    id: 'notif-003',
    judul: 'Laundry Baru Diterima',
    pesan: 'Laundry LP-20260913-007 (Hanif Al-Baqir - 11 pcs) berhasil dicatat masuk ke antrian cuci.',
    tipe: 'diterima',
    timestamp: 'Hari ini, 08:10',
    dibaca: true,
    transactionId: 'tx-007',
    nomorTransaksi: 'LP-20260913-007'
  },
  {
    id: 'notif-004',
    judul: 'Laundry Belum Diambil > 2 Hari',
    pesan: 'Laundry LP-20260911-002 santri Fathur Rahman sudah siap diambil sejak pagi, mohon ingatkan santri.',
    tipe: 'belum_diambil',
    timestamp: 'Hari ini, 09:00',
    dibaca: false,
    transactionId: 'tx-002',
    nomorTransaksi: 'LP-20260913-002'
  }
];
