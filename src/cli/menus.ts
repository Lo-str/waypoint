import { activityMenu, budgetMenu, tripMenu, uxMenu } from "./design.js";
import type { CliHandlers } from "./handlers.js";
import type { AskFn, PauseFn } from "./types.js";

// Dependencies needed to run top-level navigation.
type MenuDeps = {
  ask: AskFn;
  pause: PauseFn;
  handlers: CliHandlers;
  getUserName: () => string;
  onExit: () => void;
};

// Main navigation loop that routes to trip/activity/budget submenus.
export const showMainMenu = async ({
  ask,
  pause,
  handlers,
  getUserName,
  onExit,
}: MenuDeps): Promise<void> => {
  let isRunning = true;

  while (isRunning) {
    console.clear();
    uxMenu();
    console.log(`\nWelcome ${getUserName()}!\n`);
    const choice = await ask("> ");

    switch (choice) {
      case "1":
        await showTripMenu({ ask, pause, handlers });
        break;
      case "2":
        await showActivityMenu({ ask, pause, handlers });
        break;
      case "3":
        await showBudgetMenu({ ask, pause, handlers });
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

  onExit();
};

// Shared dependencies for submenu loops.
type SubMenuDeps = {
  ask: AskFn;
  pause: PauseFn;
  handlers: CliHandlers;
};

// Trip submenu loop and action dispatcher.
const showTripMenu = async ({ ask, pause, handlers }: SubMenuDeps): Promise<void> => {
  let inTripMenu = true;

  while (inTripMenu) {
    console.clear();
    tripMenu();
    const choice = await ask("\nTrip option: ");

    switch (choice) {
      case "1":
        await handlers.handleAddTrip();
        break;
      case "2":
        await handlers.handleDeleteTrip();
        break;
      case "3":
        await handlers.handleTripInfo();
        break;
      case "4":
        await handlers.handleViewAllTrips();
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

// Activity submenu loop and action dispatcher.
const showActivityMenu = async ({ ask, pause, handlers }: SubMenuDeps): Promise<void> => {
  let inActivityMenu = true;

  while (inActivityMenu) {
    console.clear();
    activityMenu();
    const choice = await ask("\nActivity option: ");

    switch (choice) {
      case "1":
        await handlers.handleAddActivity();
        break;
      case "2":
        await handlers.handleUpdateActivity();
        break;
      case "3":
        await handlers.handleDeleteActivity();
        break;
      case "4":
        await handlers.handleViewActivityMenu();
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

// Budget submenu loop and action dispatcher.
const showBudgetMenu = async ({ ask, pause, handlers }: SubMenuDeps): Promise<void> => {
  let inBudgetMenu = true;

  while (inBudgetMenu) {
    console.clear();
    budgetMenu();
    const choice = await ask("\nBudget option: ");

    switch (choice) {
      case "1":
        await handlers.handleBudgetBalance();
        break;
      case "2":
        await handlers.handleBudgetHighCosts();
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
