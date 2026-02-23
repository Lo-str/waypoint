// Imports
import { test, expect } from "vitest";
import {
  addTrip,
  addActivity,
  deleteActivity,
  updateActivity,
  findTrip,
  viewByCategories,
  viewByDay,
  sortChrono,
  highCostActivities,
} from "./itinerary.js";

/*****************/
/*    CRUD       */
/*****************/

test("findTrip throws when trip is not found", () => {
  expect(() => findTrip("999")).toThrowError("Error!");
});

test("addTrip returns a new trip", () => {
  const trip = addTrip("Brazil", new Date("2026-07-10"));

  expect(trip.destination).toBe("Brazil");
  expect(trip.startDate.toISOString().slice(0, 10)).toBe("2026-07-10");
  expect(trip.activities).toEqual([]);
});

test("addActivity adds an activity to a trip", () => {
  const trip = addTrip("Peru", new Date("2026-10-05"));
  const activity = addActivity(
    trip.id,
    "Hiking",
    new Date("2026-10-06T09:00:00Z"),
    "fun",
    30,
  );

  const updatedTrip = findTrip(trip.id);

  expect(activity.name).toBe("Hiking");
  expect(activity.category).toBe("fun");
  expect(activity.cost).toBe(30);
  expect(updatedTrip.activities.some((a) => a.id === activity.id)).toBe(true);
});

test("addActivity throws when trip is not found", () => {
  expect(() =>
    addActivity(
      "999",
      "Snowboarding",
      new Date("2026-01-01T14:30:00Z"),
      "fun",
      20,
    ),
  ).toThrowError("Error!");
});

test("deleteActivity removes an activity", () => {
  const trip = addTrip("Spain", new Date("2026-08-20"));
  const activity = addActivity(
    trip.id,
    "Museum",
    new Date("2026-08-21T10:00:00Z"),
    "sightseeing",
    15,
  );

  const deleted = deleteActivity(trip.id, activity.id);

  expect(deleted.id).toBe(activity.id);
  expect(findTrip(trip.id).activities.some((a) => a.id === activity.id)).toBe(false);
});

test("updateActivity updates allowed fields", () => {
  const trip = addTrip("Iceland", new Date("2027-07-10"));
  const activity = addActivity(
    trip.id,
    "Museum",
    new Date("2026-01-01T14:30:00Z"),
    "sightseeing",
    30,
  );

  const updated = updateActivity(trip.id, activity.id, {
    name: "Exhibition",
    startTime: new Date("2026-09-01T17:30:00Z"),
    category: "fun",
    cost: 0,
  });

  expect(updated.name).toBe("Exhibition");
  expect(updated.startTime.toISOString()).toBe("2026-09-01T17:30:00.000Z");
  expect(updated.category).toBe("fun");
  expect(updated.cost).toBe(0);
});

test("updateActivity throws when activity id is missing", () => {
  const trip = addTrip("Japan", new Date("2027-03-10"));

  expect(() =>
    updateActivity(trip.id, "999", {
      name: "Should not update",
    }),
  ).toThrowError("Error!");
});

/*********************************************/
/*  ACTIVITIES VIEWED BY SPECIFIC CRITERIA  */
/*********************************************/

test("viewByDay returns only activities from selected date", () => {
  const trip = addTrip("Canada", new Date("2027-07-05"));

  addActivity(trip.id, "Brunch", new Date("2027-07-05T10:00:00Z"), "food", 22);
  addActivity(trip.id, "Kayaking", new Date("2027-07-05T14:00:00Z"), "fun", 60);
  addActivity(trip.id, "Dinner", new Date("2027-07-06T19:00:00Z"), "food", 38);

  const dayActivities = viewByDay(trip.id, new Date("2027-07-05"));

  expect(dayActivities.length).toBe(2);
  expect(dayActivities.every((a) => a.startTime.toDateString() === new Date("2027-07-05").toDateString())).toBe(true);
});

test("viewByCategories returns only matching categories", () => {
  const trip = addTrip("Italy", new Date("2027-06-20"));

  addActivity(trip.id, "Espresso", new Date("2027-06-20T07:30:00Z"), "food", 4);
  addActivity(trip.id, "Metro", new Date("2027-06-20T08:30:00Z"), "transport", 3);
  addActivity(trip.id, "Pasta", new Date("2027-06-20T20:00:00Z"), "food", 32);

  const foodActivities = viewByCategories(trip.id, "food");

  expect(foodActivities.length).toBe(2);
  expect(foodActivities.every((a) => a.category === "food")).toBe(true);
});

test("sortChrono returns activities in ascending time order", () => {
  const trip = addTrip("Brazil", new Date("2027-04-01"));

  addActivity(trip.id, "Steakhouse", new Date("2027-04-01T20:00:00Z"), "food", 45);
  addActivity(trip.id, "Breakfast", new Date("2027-04-01T08:00:00Z"), "food", 12);
  addActivity(trip.id, "Bus", new Date("2027-04-01T09:00:00Z"), "transport", 8);

  const activities = sortChrono(trip.id);

  expect(activities.length).toBe(3);
  for (let i = 1; i < activities.length; i++) {
    expect(activities[i - 1]!.startTime.getTime()).toBeLessThanOrEqual(
      activities[i]!.startTime.getTime(),
    );
  }
});

test("highCostActivities returns activities above threshold", () => {
  const trip = addTrip("Iceland", new Date("2027-05-15"));

  addActivity(
    trip.id,
    "Glacier Tour",
    new Date("2027-05-15T09:30:00Z"),
    "sightseeing",
    120,
  );
  addActivity(
    trip.id,
    "Coffee",
    new Date("2027-05-15T08:15:00Z"),
    "food",
    7,
  );
  addActivity(
    trip.id,
    "Hot Spring",
    new Date("2027-05-15T17:00:00Z"),
    "fun",
    40,
  );

  const expensive = highCostActivities(trip.id, 50);

  expect(expensive.length).toBe(1);
  expect(expensive[0]?.name).toBe("Glacier Tour");
  expect(expensive[0]?.cost).toBeGreaterThan(50);
});
