import { format } from 'date-fns';

/**
 * Format a date to a human-readable string (e.g., "Friday, September 29, 2023")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE, MMMM d, yyyy');
}

/**
 * Format a time to a human-readable string (e.g., "2:30 PM")
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'h:mm a');
}

/**
 * Format currency in pounds
 */
export function formatCurrency(amount: number): string {
  return `£${(amount / 100).toFixed(2)}`;
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Basic formatting - actual implementation would depend on your phone number format
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

/**
 * Generate a random confirmation code
 */
export function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
} 