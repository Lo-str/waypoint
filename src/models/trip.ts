// Imports
import type { Activity } from "./activity.js";
import type { DestinationInfo } from "./destination.js";

// Types
export type Trip = {
  id: string;
  destination: DestinationInfo;
  startDate: Date;
  activities: Activity[];
};
