import { createInterface } from "readline";

// Single readline instance for the entire CLI session.
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user and return trimmed input.
export const ask = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (input: string) => resolve(input.trim()));
  });
};

// Simple pause helper used after most actions.
export const pause = async (): Promise<void> => {
  await ask("\nPress Enter to continue...");
};

// Gracefully close stdin when the app exits.
export const closeInput = (): void => {
  rl.close();
};
