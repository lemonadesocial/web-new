import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse currency input by removing $ and commas, keeping only numbers and decimal
 */
export function parseCurrencyInput(input: string): string {
  return input.replace(/[^0-9.]/g, "");
}