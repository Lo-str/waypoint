import { spawnSync } from "child_process";
import { rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

// Render a remote PNG in WezTerm if the terminal supports `wezterm imgcat`.
export const tryRenderFlagPng = (flagUrl: string): boolean => {
  // Only run the image flow when we are inside WezTerm.
  const termProgram = process.env["TERM_PROGRAM"]?.toLowerCase() ?? "";
  if (!termProgram.includes("wezterm")) return false;

  // Use a temporary file since imgcat expects a local path.
  const tempFile = join(
    tmpdir(),
    `travel-guide-flag-${Date.now()}-${Math.random().toString(36).slice(2)}.png`,
  );

  try {
    // Download image quietly; fail fast if curl cannot fetch it.
    const download = spawnSync("curl", ["-L", "-sS", "-o", tempFile, flagUrl], {
      stdio: "ignore",
    });
    if (download.status !== 0) return false;

    // Print image directly in terminal.
    const result = spawnSync("wezterm", ["imgcat", tempFile], {
      stdio: "inherit",
    });
    return result.status === 0;
  } catch {
    return false;
  } finally {
    // Always clean up temporary files.
    rmSync(tempFile, { force: true });
  }
};
