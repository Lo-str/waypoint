import { createInterface } from "readline";

// Readline object
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask for input.
export const ask = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (input: string) => resolve(input.trim()));
  });
};

// Wait for input validation.
export const pause = async (): Promise<void> => {
  await ask("\nPress Enter to continue...");
};

// Close input when leaving app.
export const closeInput = (): void => {
  rl.close();
};
