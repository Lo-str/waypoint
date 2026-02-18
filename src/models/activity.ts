// Types

export type Activity = {
  id: string;
  name: string;
  cost?: number;
  category?: "food" | "transport" | "sightseeing";
  startTime: Date;
};
