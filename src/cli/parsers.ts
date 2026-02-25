import type { Category } from "../models/types.js";

// Allowed category values for user input parsing.
const categories: Category[] = ["food", "transport", "sightseeing", "fun"];

// Parse an arbitrary date string into a valid Date object or null.
export const parseDate = (raw: string): Date | null => {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

// Parse separate date and time fields into a single Date object.
export const parseDateTimeParts = (dateRaw: string, timeRaw: string): Date | null => {
  const date = dateRaw.trim();
  const time = timeRaw.trim();
  const parsed = new Date(`${date}T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

// Normalize and validate category input against known categories.
export const parseCategory = (raw: string): Category | null => {
  const normalized = raw.trim().toLowerCase();
  if (!categories.includes(normalized as Category)) return null;
  return normalized as Category;
};
