import { LaundryStatus } from '../types';

export interface StatusConfig {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
  stepNumber: number;
}

export const STATUS_CONFIG: Record<LaundryStatus, StatusConfig> = {
  diterima: {
    label: 'Diterima',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-200',
    dotClass: 'bg-sky-500',
    stepNumber: 1
  },
  proses_sortir: {
    label: 'Proses Sortir',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200',
    dotClass: 'bg-indigo-500',
    stepNumber: 2
  },
  dicuci: {
    label: 'Dicuci',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
    dotClass: 'bg-blue-500',
    stepNumber: 3
  },
  dikeringkan: {
    label: 'Dikeringkan',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    dotClass: 'bg-amber-500',
    stepNumber: 4
  },
  disetrika: {
    label: 'Disetrika',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-200',
    dotClass: 'bg-purple-500',
    stepNumber: 5
  },
  siap_diambil: {
    label: 'Siap Diambil',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-300',
    dotClass: 'bg-emerald-500',
    stepNumber: 6
  },
  sudah_diambil: {
    label: 'Sudah Diambil',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-600',
    borderClass: 'border-slate-200',
    dotClass: 'bg-slate-400',
    stepNumber: 7
  },
  bermasalah: {
    label: 'Bermasalah',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-300',
    dotClass: 'bg-rose-500',
    stepNumber: 0
  }
};

export const PIPELINE_STEPS: LaundryStatus[] = [
  'diterima',
  'proses_sortir',
  'dicuci',
  'dikeringkan',
  'disetrika',
  'siap_diambil',
  'sudah_diambil'
];

export const getNextStatus = (current: LaundryStatus): LaundryStatus | null => {
  const idx = PIPELINE_STEPS.indexOf(current);
  if (idx !== -1 && idx < PIPELINE_STEPS.length - 1) {
    return PIPELINE_STEPS[idx + 1];
  }
  return null;
};
