import { spawnSync } from "child_process";
import { rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

// Show flag img in WezTerm terminal only.
export const tryRenderFlagPng = (flagUrl: string): boolean => {
  // Stop early if not WezTerm terminal.
  const termProgram = process.env["TERM_PROGRAM"]?.toLowerCase() ?? "";
  if (!termProgram.includes("wezterm")) return false;

  // Save downloaded img to temp file.
  const tempFile = join(
    tmpdir(),
    `travel-guide-flag-${Date.now()}-${Math.random().toString(36).slice(2)}.png`,
  );

  try {
    // Download the img.
    const download = spawnSync("curl", ["-L", "-sS", "-o", tempFile, flagUrl], {
      stdio: "ignore",
    });
    if (download.status !== 0) return false;

    // Show img in terminal.
    const result = spawnSync("wezterm", ["imgcat", tempFile], {
      stdio: "inherit",
    });
    return result.status === 0;
  } catch {
    return false;
  } finally {
    // Delete temp file.
    rmSync(tempFile, { force: true });
  }
};
