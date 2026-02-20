// Types

export type Activity = {
  id: string;
  name: string;
  cost: number;
  category: Category;
  startTime: Date;
};

export type Category = "food" | "transport" | "sightseeing" | "fun";

// label1: "food";
// label2: "transport";
// label3: "sightseeing";
// label4: "fun";
