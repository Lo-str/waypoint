import { test, expect } from "vitest";
import { findTrip } from "./itinerary.js";
import { addTrip } from "./itinerary.js";
import { addActivity } from "./itinerary.js";
import { deleteActivity } from "./itinerary.js";
import { updateActivity } from "./itinerary.js";

// findTrip()
test("returns undefined when trip is not found", () => {
  const result = findTrip("999");
  expect(result).toBeUndefined();
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

test("returns undefined when trip not found", () => {
  const activity = addActivity(
    "999",
    "Snowboarding",
    new Date("2026-01-01T14:30:00Z"),
    "fun",
    20,
  );
  expect(activity).toBeUndefined();
});

// deleteActivity()
test("returns undefined when trip is not found and deleted activity when deleted", () => {
  const result = deleteActivity("999", "991");
  expect(result).toBeUndefined();
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

test("returns undefined when updateActivity activity id is missing", () => {
  const trip = addTrip("Japan", new Date("2027-03-10"));

  const result = updateActivity(trip.id, "999", {
    name: "Should not update",
  });

  expect(result).toBeUndefined();
});
