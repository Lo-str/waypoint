// Shared function signatures used for dependency injection across CLI modules.
export type AskFn = (question: string) => Promise<string>;
export type PauseFn = () => Promise<void>;
