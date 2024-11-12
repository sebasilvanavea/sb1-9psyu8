import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price);
};

export const generateOrderId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};