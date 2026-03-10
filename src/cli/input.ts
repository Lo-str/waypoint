import input from "@inquirer/input";

const theme = { prefix: "" };

// Ask for input.
export const ask = async (question: string): Promise<string> => {
  return input({ message: question, theme });
};

// Wait for input validation.
export const pause = async (): Promise<void> => {
  await ask("\nPress Enter to continue...");
};

// No-ops kept for call-site compatibility.
export const closeInput = (): void => {};
export const openInput = (): void => {};
