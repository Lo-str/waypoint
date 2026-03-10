import type { Category } from "../models/types.js";

// Activity categories.
const categories: Category[] = ["food", "transport", "sightseeing", "fun"];

// Turn a strict YYYY-MM-DD string into a Date, or return null.
// Rejects invalid ranges and dates that roll over (e.g. Feb 30).
export const parseDate = (raw: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const parsed = new Date(year, month - 1, day);
  if (parsed.getMonth() + 1 !== month || parsed.getDate() !== day) return null;
  return parsed;
};

// Join strict YYYY-MM-DD + HH:mm strings into one Date, or return null.
// Rejects out-of-range hours (>23), minutes (>59), and rolled-over dates.
export const parseDateTimeParts = (
  dateRaw: string,
  timeRaw: string,
): Date | null => {
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(timeRaw.trim());
  if (!timeMatch) return null;
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  if (hours > 23 || minutes > 59) return null;

  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateRaw.trim());
  if (!dateMatch) return null;
  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const parsed = new Date(year, month - 1, day, hours, minutes);
  if (parsed.getMonth() + 1 !== month || parsed.getDate() !== day) return null;
  return parsed;
};

// Validate that an activity name contains only letters and spaces.
export const parseActivityName = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!/^[a-zA-Z ]+$/.test(trimmed)) return null;
  return trimmed;
};

// Clean category text and check if allowed.
export const parseCategory = (raw: string): Category | null => {
  const normalized = raw.trim().toLowerCase();
  if (!categories.includes(normalized as Category)) return null;
  return normalized as Category;
};
