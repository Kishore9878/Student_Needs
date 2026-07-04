/**
 * Shared utility helper functions for data formatting.
 * Ensures consistent presentation of currency, dates, and percentages
 * across all modules (Attendance, Expenses, Referrals, Tutorials).
 */

// ─── Currency ────────────────────────────────────────────────────────────────

/**
 * Formats a number as Indian Rupees using the Intl API.
 * Always produces the correct ₹ symbol regardless of file encoding.
 *
 * @param {number|string} amount
 * @returns {string}  e.g. "₹1,250", "₹15,750"
 *
 * @example
 * formatINR(1250)     // "₹1,250"
 * formatINR(15750.5)  // "₹15,751"
 */
export const formatINR = (amount) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Same as formatINR but keeps up to 2 decimal places.
 *
 * @param {number|string} amount
 * @returns {string}  e.g. "₹1,250.75"
 */
export const formatINRDecimal = (amount) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Returns the correct currency symbol for a given ISO 4217 code.
 * Uses Intl.NumberFormat so the symbol is always correctly encoded.
 *
 * @param {string} currencyCode  e.g. "INR", "USD", "EUR", "GBP"
 * @returns {string}  e.g. "₹", "$", "€", "£"
 */
export const getCurrencySymbol = (currencyCode = 'INR') => {
  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode || 'INR',
      maximumFractionDigits: 0,
    }).format(0);
    // Strip the numeric part — what's left is the symbol
    return formatted.replace(/[\d,. ]/g, '').trim();
  } catch {
    return '₹';
  }
};

/**
 * Formats an amount using any supported ISO currency code.
 *
 * @param {number|string} amount
 * @param {string} currencyCode  e.g. "INR", "USD"
 * @returns {string}
 */
export const formatCurrencyByCode = (amount, currencyCode = 'INR') => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return getCurrencySymbol(currencyCode) + '0';
  const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode || 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// ─── Legacy alias (kept for backward compatibility) ───────────────────────────

/**
 * @deprecated Use formatINR() or formatCurrencyByCode() instead.
 */
export const formatCurrency = (value) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '₹0';
  return formatINR(numericValue);
};

// ─── Dates ────────────────────────────────────────────────────────────────────

/**
 * Formats a date string or object into a standardized readable format (e.g. Oct 24, 2026).
 * @param {Date|string} date - The date to format.
 * @param {Object} options - Custom options for formatting.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(d);
};

// ─── Percentages ──────────────────────────────────────────────────────────────

/**
 * Formats a decimal or percentage number into a standard percentage string (e.g. 94.2%).
 * @param {number|string} value - The value to format.
 * @param {boolean} isDecimal - If true, treats 0.94 as 94%. If false, treats 94 as 94%.
 * @returns {string} The formatted percentage string.
 */
export const formatPercentage = (value, isDecimal = false) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '0%';

  const multiplier = isDecimal ? 100 : 1;
  return `${(numericValue * multiplier).toFixed(1).replace(/\.0$/, '')}%`;
};

