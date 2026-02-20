// Imports
import type { Trip } from "../models/trip.js";
import type { Activity, Category } from "../models/activity.js";

// Calculate Total Cost
// export const calculateTotalCost = (trip: Trip): number => {
//   return trip.activities.reduce((sum, activity) => sum + activity.cost, 0);
// };

// Variables
let trips: Trip[] = [];
let activities: Activity[] = [];
const categories = ["food", "transport", "sightseeing", "fun"];

/*****************/
/*    CRUD       */
/*****************/

// Find a Trip by ID
export const findTrip = (id: string): Trip | undefined => {
  const foundId = trips.find((t) => t.id === id);
  if (!foundId) return undefined;

  return foundId;
};

// Add a Trip
export const addTrip = (destination: string, startDate: Date): Trip => {
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
  trips.push(newTrip);
  return newTrip;
};

// Add activity to the array
export const addActivity = (
  tripId: string,
  name: string,
  startTime: Date,
  category: Category,
  cost: number,
): Activity | undefined => {
  // Search for parent ID
  const foundTrip = findTrip(tripId);
  if (!foundTrip) throw new Error("Error!");

  // Generates ID
  const nextId: number = foundTrip.activities.length + 1;
  const stringId: string = nextId.toString();

  // Create and push activity

  const foundActivity: Activity = {
    id: stringId,
    name,
    startTime,
    category,
    cost,
  };

  foundTrip.activities.push(foundActivity);
  return foundActivity;
};

// Delete activity from tha array
export const deleteActivity = (
  tripId: string,
  activityId: string,
): Activity | undefined => {
  // Find parents ID
  const foundTrip = findTrip(tripId);
  if (!foundTrip) throw new Error("Error!");

  // Find activity Index
  const foundIndex = foundTrip.activities.findIndex((a) => a.id === activityId);
  if (foundIndex === -1) throw new Error("Error!");

  // Delete Activity
  const removedActivity = foundTrip.activities.splice(foundIndex, 1)[0];
  return removedActivity;
};

// Update an activity
export const updateActivity = (
  tripId: string,
  activityId: string,
  updates: Partial<Activity>,
): Activity | undefined => {
  // Find Parent ID
  const foundTrip = findTrip(tripId);
  if (!foundTrip) throw new Error("Error!");

  // Find Activity
  const foundActivity = foundTrip.activities.find((a) => a.id === activityId);
  if (!foundActivity) throw new Error("Error!");

  //
  if (updates.name !== undefined && updates.name !== "")
    foundActivity.name = updates.name;
  if (
    updates.startTime instanceof Date &&
    !Number.isNaN(updates.startTime.getTime())
  )
    foundActivity.startTime = updates.startTime;
  if (updates.category !== undefined && categories.includes(updates.category))
    foundActivity.category = updates.category;
  if (
    updates.cost !== undefined &&
    Number.isFinite(updates.cost) &&
    updates.cost >= 0
  )
    foundActivity.cost = updates.cost;

  return foundActivity;
};

/*********************************************/
/*  ACTIVITIES VIEWED BY SPECIFIC CRITERIA  */
/*******************************************/

// View by Day
// User choose a date.
//  - program iterate through activities dates
//  - compare timestamps of every date of every object with the user input
//  - match the timestamps and store them in a new array
//  - target the day value getDay()
//  - convert to string toDateString()
//  - Print the day of the week and the activities

export const viewByDay = (tripId: string, date: Date): Activity[] => {
  const foundTrip = findTrip(tripId);
  if (!foundTrip) throw new Error("Error!");

  const tripActivities = [...foundTrip.activities];
  const dayStamp = tripActivities.filter(
    (a) => a.startTime.toISOString() === date.toISOString(),
  );
  dayStamp;
  return dayActivities;
};

// View by Categories
export const viewByCategories = (
  tripId: string,
  label: Category,
): Activity[] | undefined => {
  const foundTrip = findTrip(tripId);
  if (!foundTrip) throw new Error("Error!");

  const tripActivities = foundTrip.activities;

  // const matchingDate =
  const activityCategories = tripActivities.filter((a) => a.category === label);
  return activityCategories;
};

// Sort ACtivities Chronologically
export const sortChrono = (tripId: string): Activity[] | undefined => {
  const foundTrip = findTrip(tripId);
  if (!foundTrip) throw new Error("Error!");

  const tripActivities = [...foundTrip.activities];

  tripActivities.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return tripActivities;
};

// Identifies High Cost Activities
export const highCostActivities = (
  tripId: string,
  limit: number,
): Activity[] | undefined => {
  const foundTrip = findTrip(tripId);
  if (!foundTrip) throw new Error("Error!");

  const activityCosts = foundTrip.activities;
  const tooHighCosts = activityCosts.filter((a) => a.cost >= limit);
  return tooHighCosts;
};
