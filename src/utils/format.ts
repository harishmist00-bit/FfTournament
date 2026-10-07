export const formatINR = (n: number): string => '₹' + n.toLocaleString('en-IN');
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const formatDay = (iso: string): string => {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]}`;
};
export const formatRange = (a: string, b: string): string => {
  const x = new Date(a), y = new Date(b);
  const dd = (d: Date) => String(d.getUTCDate()).padStart(2, '0');
  return x.getUTCMonth() === y.getUTCMonth()
    ? `${dd(x)} - ${dd(y)} ${MONTHS[y.getUTCMonth()]}`
    : `${formatDay(a)} - ${formatDay(b)}`;
};
export const formatLongDate = (iso: string): string => {
  const d = new Date(iso);
  const m = MONTHS[d.getUTCMonth()];
  return `${d.getUTCDate()} ${m.charAt(0) + m.slice(1).toLowerCase()} ${d.getUTCFullYear()}`;
};
export const formatTime = (hhmm: string): string => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${String(h % 12 === 0 ? 12 : h % 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
};
export const slugify = (s: string): string =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
