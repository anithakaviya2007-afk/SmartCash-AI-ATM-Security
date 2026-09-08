/**
 * Formats current and given timestamps in strict compliance with:
 * Date: DD MMM YYYY (e.g. "02 Sep 2026")
 * Time: HH:MM AM/PM (e.g. "07:45 PM")
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatCustomDate(d: Date = new Date()): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatCustomTime(d: Date = new Date()): string {
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0');
  return `${strHours}:${minutes} ${ampm}`;
}

export function formatTimeWithSeconds(d: Date = new Date()): string {
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, '0');
  return `${strHours}:${minutes}:${seconds} ${ampm}`;
}

export function getLiveDateTimeString(d: Date = new Date()) {
  return {
    date: formatCustomDate(d),
    time: formatCustomTime(d),
    timeWithSeconds: formatTimeWithSeconds(d),
    iso: d.toISOString()
  };
}

export function generateVerificationId(prefix: string = 'SEC'): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}
