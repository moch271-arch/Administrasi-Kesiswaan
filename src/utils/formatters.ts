/**
 * Formats a number to Indonesian Rupiah currency format
 * @param amount Number to format
 * @returns Formatted string, e.g. "Rp 1.800.000"
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\u00A0/, ' ');
}

/**
 * Formats YYYY-MM-DD to Indonesian long date format
 * @param dateStr e.g. "2026-07-15"
 * @returns e.g. "15 Juli 2026"
 */
export function formatTanggalIndo(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(d);
      }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}
