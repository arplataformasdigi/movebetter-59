
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
 * Prevents timezone issues by treating input as local date
 */
export const formatDateToBrazilian = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  let date: Date;
  
  if (typeof dateString === 'string') {
    // Parse as local date to avoid timezone conversion
    const [year, month, day] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = dateString;
  }
  
  if (isNaN(date.getTime())) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Convert database date to input format (YYYY-MM-DD)
 * Handles local dates without timezone conversion
 */
export const formatDateToInput = (dateString: string | Date): string => {
  if (!dateString) return getCurrentDate();
  
  let date: Date;
  
  if (typeof dateString === 'string') {
    // Parse as local date to avoid timezone conversion
    const [year, month, day] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = dateString;
  }
  
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
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
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
  const [year1, month1, day1] = date1.split('-').map(Number);
  const [year2, month2, day2] = date2.split('-').map(Number);
  
  const d1 = new Date(year1, month1 - 1, day1);
  const d2 = new Date(year2, month2 - 1, day2);
  
  return d1 >= d2;
};

/**
 * Compare two dates (returns true if date1 <= date2)
 */
export const isDateLessOrEqual = (date1: string, date2: string): boolean => {
  const [year1, month1, day1] = date1.split('-').map(Number);
  const [year2, month2, day2] = date2.split('-').map(Number);
  
  const d1 = new Date(year1, month1 - 1, day1);
  const d2 = new Date(year2, month2 - 1, day2);
  
  return d1 <= d2;
};

/**
 * Get date range filter for transactions
 */
export const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true;
  return isDateGreaterOrEqual(date, startDate) && isDateLessOrEqual(date, endDate);
};
