import { logo } from "./design.js";
import { createHandlers } from "./handlers.js";
import { ask, closeInput, pause } from "./input.js";
import { showMainMenu } from "./menus.js";
import { seedDemoData } from "./seed.js";

// Default name.
let userName = "Barnaby";

// CLI app start.
const start = async (): Promise<void> => {
  // Add sample data so the app is not empty.
  seedDemoData();
  console.clear();
  logo();

  // Ask user for name.
  const name = await ask("\nHeya! What should I call you: ");
  if (name) userName = name;

  // Build action functions.
  const handlers = createHandlers({ ask, pause });

  // Handle open main menu and on exit.
  await showMainMenu({
    ask,
    pause,
    handlers,
    getUserName: () => userName,
    onExit: () => {
      console.clear();
      console.log(`Have a lovely day ${userName}. See you next time!`);
      closeInput();
    },
  });
};

void start();
