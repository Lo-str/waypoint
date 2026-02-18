// Imports
import type { Trip } from "../models/trip.js";
import type { Activity } from "../models/activity.js";

// Calculate Total Cost
// export const calculateTotalCost = (trip: Trip): number => {
//   return trip.activities.reduce((sum, activity) => sum + activity.cost, 0);
// };

// Variables
const trips: Trip[] = [];
const activities: Activity[] = [];

// Functions
const findTrip = (id: string): Trip | undefined => {
  const foundId = trips.find((t) => t.id === id);
  if (!foundId) return undefined;

  return foundId;
};

const addTrip = (destination: string, startDate: Date): Trip => {
  // Generates ID
  const nextId: number = trips.length + 1;
  const stringId: string = nextId.toString();

  // Build new trip object
  const newTrip: Trip = {
    id: stringId,
    destination,
    startDate,
    activities: [],
  };
  return newTrip;
};

const addActivity = (
  tripId: string,
  name: string,
  startTime: Date,
  category?: [],
  cost?: number,
): Activity | undefined => {
  // Search for parent ID
  const foundTrip = findTrip(tripId);
  if (!foundTrip) return undefined;

  // Generates ID
  const nextId: number = foundTrip.activities.length + 1;
  const stringId: string = nextId.toString();

  // Create and push activity
  const newActivity: Activity = {
    id: stringId,
    name,
    startTime,
  };

  foundTrip.activities.push(newActivity);

  return newActivity;
};

const deleteActivity = (
  tripId: string,
  activityId: string,
): Activity | undefined => {
  // Find parents ID
  const foundTrip = findTrip(tripId);
  if (!foundTrip) return undefined;

  // Find activity Index
  const foundIndex = foundTrip.activities.findIndex((a) => a.id === activityId);
  if (foundIndex === -1) return undefined;

  // Delete Activity
  const removedActivity = foundTrip.activities.splice(foundIndex, 1)[0];
  return removedActivity;
};

const updateActivity = (
  tripId: string,
  activityId: string,
  name: string,
  startTime: Date,
  category?: string,
  cost?: number,
): Activity | undefined => {
  // Find Parent ID
  const foundTrip = findTrip(tripId);
  if (!foundTrip) return undefined;

  // Find Activity
  const foundActivity = foundTrip.activities.find((a) => a.id === activityId);
  if (!foundActivity) return undefined;

  const updatedActivity: Activity = {
    id: activityId,
    name,
    startTime,
  };
  return updatedActivity;
};
