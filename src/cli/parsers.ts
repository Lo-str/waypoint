import type { Category } from "../models/types.js";

// Activity categories.
const categories: Category[] = ["food", "transport", "sightseeing", "fun"];

// Turn text into a Date, or return null.
export const parseDate = (raw: string): Date | null => {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

// Join date + time text into one Date.
export const parseDateTimeParts = (
  dateRaw: string,
  timeRaw: string,
): Date | null => {
  const date = dateRaw.trim();
  const time = timeRaw.trim();
  const parsed = new Date(`${date}T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

// Clean category text and check if allowed.
export const parseCategory = (raw: string): Category | null => {
  const normalized = raw.trim().toLowerCase();
  if (!categories.includes(normalized as Category)) return null;
  return normalized as Category;
};
