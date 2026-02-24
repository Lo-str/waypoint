// Types
export type Trip = {
  id: string;
  destination: string;
  country: string;
  startDate: Date;
  activities: Activity[];
};

export type Activity = {
  id: string;
  name: string;
  cost: number;
  category: Category;
  startTime: Date;
};

export type Category = "food" | "transport" | "sightseeing" | "fun";
