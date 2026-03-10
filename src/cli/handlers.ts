import type { Activity, Category, Trip } from "../models/types.js";
import { getBudgetSummary } from "../services/budget.js";
import { getDestinationInfo } from "../services/fetchDestination.js";
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
import { tryRenderFlagPng } from "./flag.js";
import { parseCategory, parseDate, parseDateTimeParts } from "./parsers.js";

// Actions that menu files can call.
export type CliHandlers = {
  handleAddTrip: (pauseAfter?: boolean) => Promise<void>;
  handleDeleteTrip: () => Promise<void>;
  handleTripInfo: () => Promise<void>;
  handleViewAllTrips: () => Promise<void>;
  handleAddActivity: (
    pauseAfter?: boolean,
    presetTripId?: string,
  ) => Promise<void>;
  handleUpdateActivity: () => Promise<void>;
  handleDeleteActivity: () => Promise<void>;
  handleViewActivityMenu: () => Promise<void>;
  handleBudgetBalance: () => Promise<void>;
  handleBudgetHighCosts: () => Promise<void>;
};

// Action menu loops.
export type AskFn = (question: string) => Promise<string>;
export type PauseFn = () => Promise<void>;

type HandlerDeps = {
  ask: AskFn;
  pause: PauseFn;
};
// Factory function. Creates and returns other functions.
// Create action functions.
export const createHandlers = ({ ask, pause }: HandlerDeps): CliHandlers => {
  // Check if we have at least one trip.
  const checkTripsExist = async (): Promise<boolean> => {
    if (listTrips().length > 0) return true;

    // If none, offers to add one.
    const choice = await ask("\nNo trips found. Add one now? (y/n): ");
    if (choice.toLowerCase() === "y") {
      await handleAddTrip(false);
      if (listTrips().length > 0) return true;
    }

    console.log("\nNo trips available.");
    await pause();
    return false;
  };

  // Pick a trip by number.
  const pickTrip = async (title: string): Promise<Trip | null> => {
    // Prints a numbered list of all trips
    const trips = listTrips();
    if (trips.length === 0) return null;

    console.log(`\n${title}`);
    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i]!;
      const date = trip.startDate.toISOString().slice(0, 10);
      console.log(`${i + 1}. ${trip.destination}, ${trip.country} (${date})`);
    }

    // Asks the user to pick a number, validates it, and returns that trip object.
    const selected = Number(await ask("Choose trip number: "));
    if (
      !Number.isInteger(selected) ||
      selected < 1 ||
      selected > trips.length
    ) {
      console.log("\nInvalid selection.");
      await pause();
      return null;
    }

    return trips[selected - 1] ?? null;
  };

  // Check if trip has activities. Offer to add one if empty.
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

  // Pick activity by number.
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

  // Create a trip.
  const handleAddTrip = async (pauseAfter = true): Promise<void> => {
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

  // Delete a trip.
  const handleDeleteTrip = async (): Promise<void> => {
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

  // Show trip's country info.
  const handleTripInfo = async (): Promise<void> => {
    if (!(await checkTripsExist())) return;

    const selectedTrip = await pickTrip("Select a trip to view info:");
    if (!selectedTrip) return;

    try {
      const trip = findTrip(selectedTrip.id);
      const info = await getDestinationInfo(selectedTrip.country);
      console.log(
        `\n${trip.destination}, ${trip.country} | Currency: ${info.currency.name} ${info.currency.symbol}`,
      );
      const rendered = tryRenderFlagPng(info.flag);
      if (!rendered) {
        console.log(`Flag PNG: ${info.flag}`);
      }
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
    await pause();
  };

  // Show all trips in a table.
  const handleViewAllTrips = async (): Promise<void> => {
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

  // Create an activity.
  const handleAddActivity = async (
    pauseAfter = true,
    presetTripId?: string,
  ): Promise<void> => {
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

    if (
      !name ||
      !startTime ||
      !category ||
      !Number.isFinite(cost) ||
      cost < 0
    ) {
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

  // Update activity. Some field optional.
  const handleUpdateActivity = async (): Promise<void> => {
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

  // Delete an activity.
  const handleDeleteActivity = async (): Promise<void> => {
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

  // Show activities for one date.
  const handleViewByDay = async (): Promise<void> => {
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
      const activities = viewByDay(selectedTrip.id, date);
      console.table(activities);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
    await pause();
  };

  // Show activities for one category.
  const handleViewByCategory = async (): Promise<void> => {
    const selectedTrip = await pickTrip("Select a trip to view activities:");
    if (!selectedTrip) return;
    if (!(await checkTripHasActivities(selectedTrip.id))) return;

    const categoryInput = await ask(
      "Category (food/transport/sightseeing/fun): ",
    );
    const category = parseCategory(categoryInput);

    if (!category) {
      console.log("\nInvalid category.");
      await pause();
      return;
    }

    try {
      const activities = viewByCategories(selectedTrip.id, category);
      console.table(activities);
    } catch (error) {
      console.log(`\n${(error as Error).message}`);
    }
    await pause();
  };

  // Show activities chronologically.
  const handleViewChronological = async (): Promise<void> => {
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

  // Menu for activity viewing options.
  const handleViewActivityMenu = async (): Promise<void> => {
    if (!(await checkTripsExist())) return;

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

  // Total cost for a trip.
  const handleBudgetBalance = async (): Promise<void> => {
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

  // Display high cost activities.
  const handleBudgetHighCosts = async (): Promise<void> => {
    if (!(await checkTripsExist())) return;

    const selectedTrip = await pickTrip(
      "Select a trip for high-cost filtering:",
    );
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

  // Return all actions for menu usage.
  return {
    handleAddTrip,
    handleDeleteTrip,
    handleTripInfo,
    handleViewAllTrips,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleViewActivityMenu,
    handleBudgetBalance,
    handleBudgetHighCosts,
  };
};
