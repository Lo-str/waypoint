// Imports
import inquirer from "inquirer";
import {
  getHighCostActivities,
  getActivitiesWithinBudget,
  getBudgetSummary,
} from "../services/budget.js";
import type { Trip } from "../models/trip.js";

// npx tsx src/cli/cli.ts to run file

// ADD MORE TRIPS IN AN ARRAY LATER
const trips: Trip[] = [
  {
    id: "1",
    destination: "Paris",
    startDate: new Date("2026-09-03"),
    activities: [
      {
        name: "Eiffel Tower",
        cost: 30,
        id: "1",
        category: "food",
        startTime: new Date(),
      },
      {
        name: "Louvre Museum",
        cost: 40,
        id: "2",
        category: "food",
        startTime: new Date(),
      },
      {
        name: "Wine Tasting",
        cost: 150,
        id: "3",
        category: "food",
        startTime: new Date(),
      },
    ],
  },
  {
    id: "2",
    destination: "Tokyo",
    startDate: new Date("2026-12-10"),
    activities: [
      {
        name: "Shibuya Crossing",
        cost: 0,
        id: "4",
        category: "food",
        startTime: new Date(),
      },
      {
        name: "Sushi Dinner",
        cost: 80,
        id: "5",
        category: "food",
        startTime: new Date(),
      },
      {
        name: "Robot Restaurant",
        cost: 100,
        id: "6",
        category: "food",
        startTime: new Date(),
      },
    ],
  },
];

const handleBudgetMenu = async (selectedTrip: Trip) => {
  const { budgetAction } = await inquirer.prompt([
    {
      type: "list",
      name: "budgetAction",
      message: `Budget Management Options for ${selectedTrip.destination}: \n
      - View Total Cost \n
      - Filter Activities \n
      - Back to Main Menu \n`,
      choices: [
        "View Total Cost",
        "Filter Activities", // High cost vs within budget activities
        "Back to Main Menu",
      ],
    },
  ]);

  // Switch case for budget actions here
  switch (budgetAction) {
    case "View Total Cost":
      console.log("\n" + getBudgetSummary(selectedTrip) + "\n");
      break;

    case "Filter Activities":
      const { amount } = await inquirer.prompt([
        {
          type: "number",
          name: "amount",
          message: "Enter the threshold amount:",
        },
      ]);

      const expensive = getHighCostActivities(selectedTrip, amount);
      const affordable = getActivitiesWithinBudget(
        selectedTrip.activities,
        amount,
      );

      console.log(`\n--- Activities ABOVE ${amount} ---`);
      console.table(expensive);

      console.log(`\n--- Activities WITHIN ${amount} ---`);
      console.table(affordable);
      break;

    case "Back to Main Menu":
      return;
  }

  // Return to budget menu until user goes "Back"
  await handleBudgetMenu(selectedTrip);
};

// Menu Loop
const mainMenu = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: `What would you like to do?
      - View Trips \n
      - Add Activity \n
      - View Budget \n
      - Exit \n`,
      choices: ["View Trips", "Add Activity", "View Budget", "Exit"],
    },
  ]);

  // Handle user choices here
  switch (answers["action"]) {
    case "View Budget":
      const { selectedTripName } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedTripName",
          message: `Select a trip to manage: \n
          - Paris \n
          - Tokyo \n`,
          choices: trips.map((t) => t.destination),
        },
      ]);

      // Find the trip object that matches the name
      const trip = trips.find((t) => t.destination === selectedTripName);

      if (trip) {
        await handleBudgetMenu(trip);
      }
      break;

    case "Exit":
      console.log("Goodbye!");
      process.exit(0);
  }

  await mainMenu(); // Loop back to main menu after handling action
};

mainMenu();
