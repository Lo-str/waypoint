import { logo } from "./design.js";
import { createHandlers } from "./handlers.js";
import { ask, closeInput, pause } from "./input.js";
import { showMainMenu } from "./menus.js";
import { seedDemoData } from "./seed.js";

// Default display name used until user provides one.
let userName = "Barnaby";

// App bootstrap: seed data, greet user, wire dependencies, and start menu loop.
const start = async (): Promise<void> => {
  // Demo content keeps the CLI non-empty for first-time runs.
  seedDemoData();
  console.clear();
  logo();

  // Optional personalized greeting.
  const name = await ask("\nHeya! What should I call you: ");
  if (name) userName = name;

  // Handlers receive shared input/pause utilities.
  const handlers = createHandlers({ ask, pause });

  // Start menu navigation and define shutdown behavior.
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

// Fire-and-forget startup at module load.
void start();
