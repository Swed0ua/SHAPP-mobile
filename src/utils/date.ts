/** Local-midnight copy of a date. */
export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Serializes a date to a stable, timezone-safe id (YYYY-MM-DD, local). */
export function toDateId(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a YYYY-MM-DD id into a local-midnight Date. */
export function parseDateId(id: string): Date {
  const [year, month, day] = id.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayId(reference: Date = new Date()): string {
  return toDateId(startOfDay(reference));
}
