import { clsx, type ClassValue } from 'clsx'

/** Gabungkan className secara kondisional (mengikuti pola $attributes->merge di Blade). */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
