// Imports
import type { Activity, Category, Trip } from "../models/types.js";

// Variables
let trips: Trip[] = [];
// let activities: Activity[] = [];
const categories = ["food", "transport", "sightseeing", "fun"];
const ERROR_T = "Trip 🫣 Sadly this trip doesn't exist yet.";
const ERROR_A = "Activity 😶‍🌫️ Couldn't find this activity.";
const ERROR_I = "🫢 Oops, wrong input!";

export const listTrips = (): Trip[] => {
  return [...trips];
};

// Find a Trip by ID
export const findTrip = (id: string): Trip => {
  const foundId = trips.find((t) => t.id === id);
  if (!foundId) throw new Error(ERROR_T);

  return foundId;
};

// Add a Trip
export const addTrip = (
  destination: string,
  country: string,
  startDate: Date,
): Trip => {
  if (
    destination.trim() === "" ||
    country.trim() === "" ||
    !(startDate instanceof Date) ||
    Number.isNaN(startDate.getTime())
  ) {
    throw new Error(ERROR_I);
  }

  // Generates ID
  const nextId: number = trips.length + 1;
  const stringId: string = nextId.toString();

  // Build new trip object
  const newTrip: Trip = {
    id: stringId,
    destination,
    country,
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
): Activity => {
  // Search for parent ID
  const foundTrip = findTrip(tripId);
  if (
    name.trim() === "" ||
    !(startTime instanceof Date) ||
    Number.isNaN(startTime.getTime()) ||
    !categories.includes(category) ||
    !Number.isFinite(cost) ||
    cost < 0
  ) {
    throw new Error(ERROR_I);
  }

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

// Delete activity
export const deleteActivity = (
  tripId: string,
  activityId: string,
): Activity => {
  // Find parents ID
  const foundTrip = findTrip(tripId);

  // Find activity Index
  const foundIndex = foundTrip.activities.findIndex((a) => a.id === activityId);
  if (foundIndex === -1) throw new Error(ERROR_A);

  // Delete Activity
  const removedActivity = foundTrip.activities.splice(foundIndex, 1)[0];
  if (!removedActivity) throw new Error(ERROR_A);
  return removedActivity;
};

// Delete trip
export const deleteTrip = (tripId: string): Trip => {
  const foundIndex = trips.findIndex((t) => t.id === tripId);
  if (foundIndex === -1) throw new Error(ERROR_T);

  const removedTrip = trips.splice(foundIndex, 1)[0];
  if (!removedTrip) throw new Error(ERROR_T);
  return removedTrip;
};

// Update an activity
export const updateActivity = (
  tripId: string,
  activityId: string,
  updates: Partial<Activity>,
): Activity => {
  // Find Parent ID
  const foundTrip = findTrip(tripId);

  // Find Activity
  const foundActivity = foundTrip.activities.find((a) => a.id === activityId);
  if (!foundActivity) throw new Error(ERROR_A);

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
export const viewByDay = (tripId: string, date: Date): Activity[] => {
  const foundTrip = findTrip(tripId);
  if (!(date instanceof Date) || Number.isNaN(date.getTime()))
    throw new Error(ERROR_I);

  const tripDate = foundTrip.activities.filter(
    (a) => a.startTime.toDateString() === date.toDateString(),
  );
  return tripDate;
};

// View by Categories
export const viewByCategories = (
  tripId: string,
  label: Category,
): Activity[] => {
  const foundTrip = findTrip(tripId);

  const tripActivities = foundTrip.activities;
  const activityCategories = tripActivities.filter((a) => a.category === label);
  return activityCategories;
};

// Sort ACtivities Chronologically
export const sortChrono = (tripId: string): Activity[] => {
  const foundTrip = findTrip(tripId);

  const tripActivities = [...foundTrip.activities];

  tripActivities.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return tripActivities;
};

// Identifies High Cost Activities
export const highCostActivities = (
  tripId: string,
  limit: number,
): Activity[] => {
  const foundTrip = findTrip(tripId);
  if (!Number.isFinite(limit)) throw new Error(ERROR_A);

  const activityCosts = foundTrip.activities;
  const tooHighCosts = activityCosts.filter((a) => a.cost > limit);
  return tooHighCosts;
};
