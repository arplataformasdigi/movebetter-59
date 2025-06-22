
/**
 * Utility functions for date handling with proper timezone management
 */

/**
 * Get current date in YYYY-MM-DD format (local timezone)
 */
export const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date string to Brazilian Portuguese format (DD/MM/YYYY)
 */
export const formatDateToBrazilian = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString + 'T00:00:00') : dateString;
  
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
  });
};

/**
 * Convert database date to input format (YYYY-MM-DD)
 */
export const formatDateToInput = (dateString: string | Date): string => {
  if (!dateString) return getCurrentDate();
  
  const date = typeof dateString === 'string' ? new Date(dateString + 'T00:00:00') : dateString;
  
  if (isNaN(date.getTime())) return getCurrentDate();
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Validate and normalize date string
 */
export const normalizeDate = (dateString: string): string => {
  if (!dateString) return getCurrentDate();
  
  // If already in YYYY-MM-DD format, validate and return
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const date = new Date(dateString + 'T00:00:00');
    if (!isNaN(date.getTime())) {
      return dateString;
    }
  }
  
  return getCurrentDate();
};

/**
 * Compare two dates (returns true if date1 >= date2)
 */
export const isDateGreaterOrEqual = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  return d1 >= d2;
};

/**
 * Compare two dates (returns true if date1 <= date2)
 */
export const isDateLessOrEqual = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  return d1 <= d2;
};

/**
 * Get date range filter for transactions
 */
export const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true;
  return isDateGreaterOrEqual(date, startDate) && isDateLessOrEqual(date, endDate);
};
