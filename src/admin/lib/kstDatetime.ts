// Helpers for <input type="datetime-local"> fields that admins read and write
// as Korea Standard Time, while the database stores absolute TIMESTAMPTZ.
// KST is a fixed UTC+9 offset with no DST, so a literal offset is safe.
const KST_OFFSET = '+09:00';

const kstParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** ISO timestamp from the DB -> "YYYY-MM-DDTHH:mm" in KST for the input value. */
export const isoToKstInput = (iso?: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const parts = Object.fromEntries(
    kstParts.formatToParts(date).map((part) => [part.type, part.value])
  );
  // Intl renders midnight as "24" in some engines; normalise it back to 00.
  const hour = parts.hour === '24' ? '00' : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}`;
};

/** "YYYY-MM-DDTHH:mm" typed as KST -> ISO timestamp for the DB (null when blank). */
export const kstInputToIso = (value: string): string | null => {
  if (!value.trim()) return null;
  const date = new Date(`${value}:00${KST_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/** Compact KST label for the list view, e.g. "2026-09-05 14:30". */
export const formatKstLabel = (iso?: string | null): string => {
  const input = isoToKstInput(iso);
  return input ? input.replace('T', ' ') : '';
};
