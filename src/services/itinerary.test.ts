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
} from "./itinerary.js";

/*****************/
/*    CRUD       */
/*****************/

// findTrip()
test("returns error message when trip is not found", () => {
  expect(() => findTrip("999")).toThrowError("Error!");
});

// addTrip()
test("returns added trip", () => {
  const trip = addTrip("Brazil", new Date("2026-07-10"));
  expect(trip.destination).toBe("Brazil");
  expect(trip.startDate.toISOString().slice(0, 10)).toBe("2026-07-10");
  expect(trip.activities).toEqual([]);
});

// Test trip
const testTrip = addTrip("Brazil", new Date("2026-07-10"));

// addActivity()
test("returns added activity when trip has been found", () => {
  const activity = addActivity(
    testTrip.id,
    "Climbing",
    new Date("2026-01-01T14:30:00Z"),
    "fun",
    20,
  );
  if (!activity) throw new Error("Expected addActivity to return an activity");

  const [datePart, timePart] = activity.startTime.toISOString().split("T");
  if (!timePart)
    throw new Error("Expected ISO time part after splitting at 'T'");

  const pretty = `${datePart} ${timePart.slice(0, 5)}`; // YYYY-MM-DD HH:MM
  expect(activity.name).toBe("Climbing");
  expect(pretty);
  expect(activity.category).toBe("fun");
  expect(activity.cost).toBe(20);
});

test("returns error message when trip not found", () => {
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

// deleteActivity()
test("returns error message when trip is not found and deleted activity when deleted", () => {
  expect(() => deleteActivity("999", "991")).toThrowError("Error!");
});

// updateActivity()
test("return updated activity", () => {
  const testTrip2 = addTrip("Iceland", new Date("2027-07-10"));
  const testActivity = addActivity(
    testTrip2.id,
    "Museum",
    new Date("2026-01-01T14:30:00Z"),
    "sightseeing",
    30,
  );

  if (!testActivity)
    throw new Error(
      "Expected addActivity to create an activity for update test",
    );

  const activity2 = updateActivity(testTrip2.id, testActivity.id, {
    name: "Exhibition",
    startTime: new Date("2026-09-01T17:30:00Z"),
    category: "fun",
    cost: 0,
  });

  if (!activity2)
    throw new Error("Expected updateActivity to return an activity");

  const [datePart, timePart] = activity2.startTime.toISOString().split("T");
  if (!timePart)
    throw new Error("Expected ISO time part after splitting at 'T'");
  const pretty = `${datePart} ${timePart.slice(0, 5)}`; // YYYY-MM-DD HH:MM

  expect(activity2.name).toBe("Exhibition");
  expect(pretty);
  expect(activity2.category).toBe("fun");
  expect(activity2.cost).toBe(0);
});

test("returns error message when updateActivity activity id is missing", () => {
  const trip = addTrip("Japan", new Date("2027-03-10"));

  expect(() =>
    updateActivity(trip.id, "999", {
      name: "Should not update",
    }),
  ).toThrowError("Error!");
});

/*********************************************/
/*  ACTIVITIES VIEWED BY SPECIFIC CRITERIA  */
/*******************************************/
// test trips
const trip1 = addTrip("Japan", new Date("2027-03-10"));
const trip2 = addTrip("Brazil", new Date("2027-04-01"));
const trip3 = addTrip("Iceland", new Date("2027-05-15"));
const trip4 = addTrip("Italy", new Date("2027-06-20"));
const trip5 = addTrip("Canada", new Date("2027-07-05"));

const t1a1 = addActivity(
  trip1.id,
  "Museum",
  new Date("2027-03-10T14:00:00Z"),
  "sightseeing",
  30,
);
const t1a2 = addActivity(
  trip1.id,
  "Lunch",
  new Date("2027-03-10T11:30:00Z"),
  "food",
  20,
);
const t1a3 = addActivity(
  trip1.id,
  "Train",
  new Date("2027-03-10T09:00:00Z"),
  "transport",
  15,
);
const t1a4 = addActivity(
  trip1.id,
  "Park Walk",
  new Date("2027-03-10T16:45:00Z"),
  "fun",
  0,
);
const t1a5 = addActivity(
  trip1.id,
  "Dinner",
  new Date("2027-03-10T19:30:00Z"),
  "food",
  35,
);

const t2a1 = addActivity(
  trip2.id,
  "Beach",
  new Date("2027-04-01T10:00:00Z"),
  "fun",
  25,
);
const t2a2 = addActivity(
  trip2.id,
  "Breakfast",
  new Date("2027-04-01T08:00:00Z"),
  "food",
  12,
);
const t2a3 = addActivity(
  trip2.id,
  "Bus",
  new Date("2027-04-01T09:00:00Z"),
  "transport",
  8,
);
const t2a4 = addActivity(
  trip2.id,
  "Market",
  new Date("2027-04-01T13:00:00Z"),
  "sightseeing",
  0,
);
const t2a5 = addActivity(
  trip2.id,
  "Steakhouse",
  new Date("2027-04-01T20:00:00Z"),
  "food",
  45,
);

const t3a1 = addActivity(
  trip3.id,
  "Glacier Tour",
  new Date("2027-05-15T09:30:00Z"),
  "sightseeing",
  120,
);
const t3a2 = addActivity(
  trip3.id,
  "Coffee",
  new Date("2027-05-15T08:15:00Z"),
  "food",
  7,
);
const t3a3 = addActivity(
  trip3.id,
  "Shuttle",
  new Date("2027-05-15T07:45:00Z"),
  "transport",
  18,
);
const t3a4 = addActivity(
  trip3.id,
  "Hot Spring",
  new Date("2027-05-15T17:00:00Z"),
  "fun",
  40,
);
const t3a5 = addActivity(
  trip3.id,
  "Fish Dinner",
  new Date("2027-05-15T19:00:00Z"),
  "food",
  55,
);

const t4a1 = addActivity(
  trip4.id,
  "Colosseum",
  new Date("2027-06-20T10:00:00Z"),
  "sightseeing",
  28,
);
const t4a2 = addActivity(
  trip4.id,
  "Espresso",
  new Date("2027-06-20T07:30:00Z"),
  "food",
  4,
);
const t4a3 = addActivity(
  trip4.id,
  "Metro",
  new Date("2027-06-20T08:30:00Z"),
  "transport",
  3,
);
const t4a4 = addActivity(
  trip4.id,
  "Gelato Stop",
  new Date("2027-06-20T15:30:00Z"),
  "fun",
  6,
);
const t4a5 = addActivity(
  trip4.id,
  "Pasta Dinner",
  new Date("2027-06-20T20:00:00Z"),
  "food",
  32,
);

const t5a1 = addActivity(
  trip5.id,
  "Lake Visit",
  new Date("2027-07-05T11:00:00Z"),
  "sightseeing",
  0,
);
const t5a2 = addActivity(
  trip5.id,
  "Brunch",
  new Date("2027-07-05T10:00:00Z"),
  "food",
  22,
);
const t5a3 = addActivity(
  trip5.id,
  "Tram",
  new Date("2027-07-05T09:00:00Z"),
  "transport",
  5,
);
const t5a4 = addActivity(
  trip5.id,
  "Kayaking",
  new Date("2027-07-05T14:00:00Z"),
  "fun",
  60,
);
const t5a5 = addActivity(
  trip5.id,
  "BBQ",
  new Date("2027-07-05T19:00:00Z"),
  "food",
  38,
);

// if (
/*   !t1a1 || !t1a2 || !t1a3 || !t1a4 || !t1a5 ||
/*   !t2a1 || !t2a2 || !t2a3 || !t2a4 || !t2a5 ||
/*   !t3a1 || !t3a2 || !t3a3 || !t3a4 || !t3a5 ||
/*   !t4a1 || !t4a2 || !t4a3 || !t4a4 || !t4a5 ||
/*   !t5a1 || !t5a2 || !t5a3 || !t5a4 || !t5a5*/
// ) throw new Error("setup failed");

// viewByDay()

test("returns the activities of the day input of a chosen trip", () => {
  const dayActivity = viewByDay(trip5.id, new Date("2027-07-05"));

  expect(dayActivity.length).toBe(5);
  expect(dayActivity.some((a) => a.name === "Lake Visit")).toBe(true);
  expect(dayActivity.some((a) => a.name === "Brunch")).toBe(true);
  expect(dayActivity.some((a) => a.name === "Tram")).toBe(true);
  expect(dayActivity.some((a) => a.name === "Kayaking")).toBe(true);
  expect(dayActivity.some((a) => a.name === "BBQ")).toBe(true);
  expect(dayActivity.some((a) => a.name === "Climbing")).toBe(false);
});

// viewByCategories
test("returns activities of a chosen trip chronologically", () => {
  const activities = sortChrono(trip2.id);

  expect(activities.length).toBe(5);

  for (let i = 1; i < activities.length; i++) {
    expect(activities[i - 1]!.startTime.getTime()).toBeLessThanOrEqual(
      activities[i]!.startTime.getTime(),
    );
  }
});
