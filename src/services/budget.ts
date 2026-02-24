import type { Activity, Trip } from "../models/types.js";

// Cost of every activity (code from document)
export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce((sum, activity) => sum + activity.cost, 0);
};

// Identifies activities over the budget
export const getHighCostActivities = (
  trip: Trip,
  threshold: number,
): Activity[] => {
  return trip.activities.filter(
    (activity: Activity) => activity.cost > threshold,
  );
};

// Identifies activities within the budget
export const getActivitiesWithinBudget = (
  activities: Activity[],
  budget: number,
): Activity[] => {
  return activities.filter((activity: Activity) => activity.cost <= budget);
};

// Returns the total trip cost
export const getBudgetSummary = (trip: Trip): string => {
  const total = calculateTotalCost(trip);
  return `Total Trip Cost for ${trip.destination}: $${total.toFixed(2)}`;
};
