// Imports
import type { Activity } from "./activity.js";

// Types
export type Trip = {
  id: string;
  destination: string;
  country: string;
  startDate: Date;
  activities: Activity[];
};
