// Imports
import { createInterface } from "readline";
import { activityMenu, budgetMenu, logo, tripMenu, uxMenu } from "./design.js";
import { getBudgetSummary } from "../services/budget.js";
import { getDestinationInfo } from "../services/fetchDestination.js";
// import type { RestCountryResponse } from "../services/destination.js";

import {
  addActivity,
  addTrip,
  deleteActivity,
  deleteTrip,
  findTrip,
  highCostActivities,
  listTrips,
  sortChrono,
  updateActivity,
  viewByCategories,
  viewByDay,
} from "../services/itinerary.js";
import type { Activity, Category, Trip } from "../models/types.js";

// Vars
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
}); // Lo don't forget rl.close() !!! stdin is listening for user input foreveeeerrr!

let userName = "Barnaby";
const categories: Category[] = ["food", "transport", "sightseeing", "fun"];

// Functions
const ask = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (input: string) => resolve(input.trim()));
  });
};

const pause = async () => {
  await ask("\nPress Enter to continue...");
};

const parseDate = (raw: string): Date | null => {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const parseDateTimeParts = (dateRaw: string, timeRaw: string): Date | null => {
  const date = dateRaw.trim();
  const time = timeRaw.trim();
  const parsed = new Date(`${date}T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const parseCategory = (raw: string): Category | null => {
  const normalized = raw.trim().toLowerCase();
  if (!categories.includes(normalized as Category)) return null;
  return normalized as Category;
};

const checkTripsExist = async (): Promise<boolean> => {
  if (listTrips().length > 0) return true;

  const choice = await ask("\nNo trips found. Add one now? (y/n): ");
  if (choice.toLowerCase() === "y") {
    await handleAddTrip(false);
    if (listTrips().length > 0) return true;
  }

  console.log("\nNo trips available.");
  await pause();
  return false;
};

const pickTrip = async (title: string): Promise<Trip | null> => {
  const trips = listTrips();
  if (trips.length === 0) return null;

  console.log(`\n${title}`);
  for (let i = 0; i < trips.length; i++) {
    const trip = trips[i]!;
    const date = trip.startDate.toISOString().slice(0, 10);
    console.log(`${i + 1}. ${trip.destination}, ${trip.country} (${date})`);
  }

  const selected = Number(await ask("Choose trip number: "));
  if (!Number.isInteger(selected) || selected < 1 || selected > trips.length) {
    console.log("\nInvalid selection.");
    await pause();
    return null;
  }

  return trips[selected - 1] ?? null;
};

const checkTripHasActivities = async (tripId: string): Promise<boolean> => {
  try {
    const trip = findTrip(tripId);
    if (trip.activities.length > 0) return true;

    const choice = await ask(
      "\nThis trip has no activities. Add one now? (y/n): ",
    );
    if (choice.toLowerCase() === "y") {
      await handleAddActivity(false, tripId);
      if (findTrip(tripId).activities.length > 0) return true;
    }
  } catch {
    console.log("\nTrip not found.");
    await pause();
    return false;
  }

  console.log("\nNo activities available.");
  await pause();
  return false;
};

const pickActivity = async (
  tripId: string,
  title: string,
): Promise<Activity | null> => {
  const trip = findTrip(tripId);
  const activities = trip.activities;
  if (activities.length === 0) return null;

  console.log(`\n${title}`);
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i]!;
    const time = activity.startTime
      .toISOString()
      .replace("T", " ")
      .slice(0, 16);
    console.log(
      `${i + 1}. ${activity.name} | ${activity.category} | $${activity.cost} | ${time}`,
    );
  }

  const selected = Number(await ask("Choose activity number: "));
  if (
    !Number.isInteger(selected) ||
    selected < 1 ||
    selected > activities.length
  ) {
    console.log("\nInvalid selection.");
    await pause();
    return null;
  }

  return activities[selected - 1] ?? null;
};

const showMainMenu = async (): Promise<void> => {
  let isRunning = true;

  while (isRunning) {
    console.clear();
    uxMenu();
    console.log(`\nWelcome ${userName}!\n`);
    const choice = await ask("> ");

    switch (choice) {
      case "1":
        await showTripMenu();
        break;
      case "2":
        await showActivityMenu();
        break;
      case "3":
        await showBudgetMenu();
        break;
      case "4":
      case "q":
      case "Q":
        isRunning = false;
        break;
      default:
        console.log("\nUnknown command.");
        await pause();
    }
  }

  console.clear();
  console.log(`Have a lovely day ${userName}. See you next time!`);
  rl.close();
};

const showTripMenu = async (): Promise<void> => {
  let inTripMenu = true;

  while (inTripMenu) {
    console.clear();
    tripMenu();
    const choice = await ask("\nTrip option: ");

    switch (choice) {
      case "1":
        await handleAddTrip();
        break;
      case "2":
        await handleDeleteTrip();
        break;
      case "3":
        await handleTripInfo();
        break;
      case "4":
        await handleViewAllTrips();
        break;
      case "q":
      case "Q":
        inTripMenu = false;
        break;
      default:
        console.log("\nUnknown command.");
        await pause();
    }
  }
};

const showActivityMenu = async (): Promise<void> => {
  let inActivityMenu = true;

  while (inActivityMenu) {
    console.clear();
    activityMenu();
    const choice = await ask("\nActivity option: ");

    switch (choice) {
      case "1":
        await handleAddActivity();
        break;
      case "2":
        await handleUpdateActivity();
        break;
      case "3":
        await handleDeleteActivity();
        break;
      case "4":
        if (!(await checkTripsExist())) break;
        await handleViewActivityMenu();
        break;
      case "5":
      case "q":
      case "Q":
        inActivityMenu = false;
        break;
      default:
        console.log("\nUnknown command.");
        await pause();
    }
  }
};

const showBudgetMenu = async (): Promise<void> => {
  let inBudgetMenu = true;

  while (inBudgetMenu) {
    console.clear();
    budgetMenu();
    const choice = await ask("\nBudget option: ");

    switch (choice) {
      case "1":
        await handleBudgetBalance();
        break;
      case "2":
        await handleBudgetHighCosts();
        break;
      case "3":
      case "q":
      case "Q":
        inBudgetMenu = false;
        break;
      default:
        console.log("\nUnknown command.");
        await pause();
    }
  }
};

const handleAddTrip = async (pauseAfter = true) => {
  const destination = await ask("Destination: ");
  const country = await ask("Country: ");
  const dateInput = await ask("Start date (YYYY-MM-DD): ");
  const startDate = parseDate(dateInput);

  if (!destination || !country || !startDate) {
    console.log("\nInvalid destination, country, or date.");
    await pause();
    return;
  }

  const trip = addTrip(destination, country, startDate);
  console.log(`\nTrip added with id ${trip.id}.`);
  if (pauseAfter) await pause();
};

const handleDeleteTrip = async () => {
  if (!(await checkTripsExist())) return;

  const selectedTrip = await pickTrip("Select a trip to delete:");
  if (!selectedTrip) return;

  try {
    const removed = deleteTrip(selectedTrip.id);
    console.log(`\nDeleted trip ${removed.id} (${removed.destination}).`);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const handleTripInfo = async () => {
  if (!(await checkTripsExist())) return;

  const selectedTrip = await pickTrip("Select a trip to view info:");
  if (!selectedTrip) return;

  try {
    const trip = findTrip(selectedTrip.id);

    const info = await getDestinationInfo(selectedTrip.country);
    console.log(
      `\n${trip.destination}, ${trip.country} ${info.flag} | Currency: ${info.currency.name} ${info.currency.symbol} `,
    );
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const handleViewAllTrips = async () => {
  const trips = listTrips();
  if (trips.length === 0) {
    console.log("\nNo trips available.");
    await pause();
    return;
  }

  const rows = trips.map((trip) => ({
    id: trip.id,
    destination: trip.destination,
    country: trip.country,
    startDate: trip.startDate.toISOString().slice(0, 10),
    activities: trip.activities.length,
  }));

  console.log("\nAll trips:");
  console.table(rows);
  await pause();
};

const handleAddActivity = async (pauseAfter = true, presetTripId?: string) => {
  if (presetTripId === undefined && !(await checkTripsExist())) return;

  const selectedTrip =
    presetTripId === undefined
      ? await pickTrip("Select a trip for the new activity:")
      : findTrip(presetTripId);
  if (!selectedTrip) return;

  const tripId = selectedTrip.id;
  const name = await ask("Activity name: ");
  const activityDate = await ask("Date (YYYY-MM-DD): ");
  const activityTime = await ask("Time (HH:mm): ");
  const categoryInput = await ask(
    "Category (food/transport/sightseeing/fun): ",
  );
  const costInput = await ask("Cost: ");

  const startTime = parseDateTimeParts(activityDate, activityTime);
  const category = parseCategory(categoryInput);
  const cost = Number(costInput);

  if (!name || !startTime || !category || !Number.isFinite(cost) || cost < 0) {
    console.log("\nInvalid activity input.");
    await pause();
    return;
  }

  try {
    const created = addActivity(tripId, name, startTime, category, cost);
    console.log(`\nActivity added with id ${created.id}.`);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  if (pauseAfter) await pause();
};

const handleUpdateActivity = async () => {
  if (!(await checkTripsExist())) return;

  const selectedTrip = await pickTrip("Select a trip to update an activity:");
  if (!selectedTrip) return;
  if (!(await checkTripHasActivities(selectedTrip.id))) return;

  const selectedActivity = await pickActivity(
    selectedTrip.id,
    "Select an activity to update:",
  );
  if (!selectedActivity) return;

  const name = await ask("New name (Enter to skip): ");
  const startTimeInput = await ask("New start time (Enter to skip): ");
  const categoryInput = await ask("New category (Enter to skip): ");
  const costInput = await ask("New cost (Enter to skip): ");

  const updates: {
    name?: string;
    startTime?: Date;
    category?: Category;
    cost?: number;
  } = {};

  if (name) updates.name = name;

  if (startTimeInput) {
    const startTime = parseDate(startTimeInput);
    if (!startTime) {
      console.log("\nInvalid date format.");
      await pause();
      return;
    }
    updates.startTime = startTime;
  }

  if (categoryInput) {
    const category = parseCategory(categoryInput);
    if (!category) {
      console.log("\nInvalid category.");
      await pause();
      return;
    }
    updates.category = category;
  }

  if (costInput) {
    const cost = Number(costInput);
    if (!Number.isFinite(cost) || cost < 0) {
      console.log("\nInvalid cost.");
      await pause();
      return;
    }
    updates.cost = cost;
  }

  try {
    const updated = updateActivity(
      selectedTrip.id,
      selectedActivity.id,
      updates,
    );
    console.log(`\nUpdated activity ${updated.id}.`);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const handleDeleteActivity = async () => {
  if (!(await checkTripsExist())) return;

  const selectedTrip = await pickTrip(
    "Select a trip to delete an activity from:",
  );
  if (!selectedTrip) return;
  if (!(await checkTripHasActivities(selectedTrip.id))) return;

  const selectedActivity = await pickActivity(
    selectedTrip.id,
    "Select an activity to delete:",
  );
  if (!selectedActivity) return;

  try {
    const removed = deleteActivity(selectedTrip.id, selectedActivity.id);
    console.log(`\nDeleted activity ${removed.id} (${removed.name}).`);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const handleViewActivityMenu = async (): Promise<void> => {
  let inViewMenu = true;

  while (inViewMenu) {
    console.clear();
    console.log("View Activity");
    console.log("1. By Day");
    console.log("2. By Category");
    console.log("3. Chronological");
    console.log("q. Back");
    const choice = await ask("> ");

    switch (choice) {
      case "1":
        await handleViewByDay();
        break;
      case "2":
        await handleViewByCategory();
        break;
      case "3":
        await handleViewChronological();
        break;
      case "4":
      case "q":
      case "Q":
        inViewMenu = false;
        break;
      default:
        console.log("\nUnknown command.");
        await pause();
    }
  }
};

const handleViewByDay = async () => {
  const selectedTrip = await pickTrip("Select a trip to view activities:");
  if (!selectedTrip) return;
  if (!(await checkTripHasActivities(selectedTrip.id))) return;

  const dateInput = await ask("Date (YYYY-MM-DD): ");
  const date = parseDate(dateInput);

  if (!date) {
    console.log("\nInvalid date.");
    await pause();
    return;
  }

  try {
    date.getHours();
    const activities = viewByDay(selectedTrip.id, date);
    console.table(activities);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const handleViewByCategory = async () => {
  const selectedTrip = await pickTrip("Select a trip to view activities:");
  if (!selectedTrip) return;
  if (!(await checkTripHasActivities(selectedTrip.id))) return;

  // const categoryInput = await ask(
  //   "Category (food/transport/sightseeing/fun): ",
  // );
  // const category = parseCategory(categoryInput);

  // if (!category) {
  //   console.log("\nInvalid category.");
  //   await pause();
  //   return;
  // }

  try {
    const activities = viewByCategories(selectedTrip.id, selectedTrip.category);
    console.table(activities);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const handleViewChronological = async () => {
  const selectedTrip = await pickTrip("Select a trip to view activities:");
  if (!selectedTrip) return;
  if (!(await checkTripHasActivities(selectedTrip.id))) return;

  try {
    const activities = sortChrono(selectedTrip.id);
    console.table(activities);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const handleBudgetBalance = async () => {
  if (!(await checkTripsExist())) return;

  const selectedTrip = await pickTrip("Select a trip for budget balance:");
  if (!selectedTrip) return;

  try {
    const trip = findTrip(selectedTrip.id);
    console.log(`\n${getBudgetSummary(trip)}`);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const handleBudgetHighCosts = async () => {
  if (!(await checkTripsExist())) return;

  const selectedTrip = await pickTrip("Select a trip for high-cost filtering:");
  if (!selectedTrip) return;
  if (!(await checkTripHasActivities(selectedTrip.id))) return;

  const thresholdInput = await ask("Threshold: ");
  const threshold = Number(thresholdInput);

  if (!Number.isFinite(threshold)) {
    console.log("\nInvalid threshold.");
    await pause();
    return;
  }

  try {
    const costly = highCostActivities(selectedTrip.id, threshold);
    console.table(costly);
  } catch (error) {
    console.log(`\n${(error as Error).message}`);
  }
  await pause();
};

const seedDemoData = () => {
  const stockholm = addTrip("Stockholm", "Sweden", new Date("2026-06-10"));
  addActivity(
    stockholm.id,
    "Airport train to city",
    new Date("2026-06-10T10:30:00"),
    "transport",
    18,
  );
  addActivity(
    stockholm.id,
    "Gamla Stan walking tour",
    new Date("2026-06-10T14:00:00"),
    "sightseeing",
    25,
  );
  addActivity(
    stockholm.id,
    "Dinner in Sodermalm",
    new Date("2026-06-10T19:30:00"),
    "food",
    42,
  );
  addActivity(
    stockholm.id,
    "ABBA Museum",
    new Date("2026-06-11T11:00:00"),
    "fun",
    30,
  );

  const lisbon = addTrip("Lisbon", "Portugal", new Date("2026-07-02"));
  addActivity(
    lisbon.id,
    "Tram 28 day pass",
    new Date("2026-07-02T09:00:00"),
    "transport",
    10,
  );
  addActivity(
    lisbon.id,
    "Alfama food tasting",
    new Date("2026-07-02T13:00:00"),
    "food",
    35,
  );
  addActivity(
    lisbon.id,
    "Belem Tower visit",
    new Date("2026-07-03T10:00:00"),
    "sightseeing",
    15,
  );
  addActivity(
    lisbon.id,
    "Fado night",
    new Date("2026-07-03T21:00:00"),
    "fun",
    28,
  );

  const kyoto = addTrip("Kyoto", "Japan", new Date("2026-09-14"));
  addActivity(
    kyoto.id,
    "Bus pass",
    new Date("2026-09-14T08:30:00"),
    "transport",
    8,
  );
  addActivity(
    kyoto.id,
    "Fushimi Inari hike",
    new Date("2026-09-14T10:00:00"),
    "sightseeing",
    0,
  );
  addActivity(
    kyoto.id,
    "Ramen lunch",
    new Date("2026-09-14T13:00:00"),
    "food",
    12,
  );
  addActivity(
    kyoto.id,
    "Tea ceremony",
    new Date("2026-09-15T16:00:00"),
    "fun",
    40,
  );
};

const start = async () => {
  seedDemoData();
  console.clear();
  logo();
  const name = await ask("\nHeya! What should I call you: ");
  if (name) userName = name;
  await showMainMenu();
};

void start();
