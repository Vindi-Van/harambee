#!/usr/bin/env node
import { runInit } from "./init.js";

async function main(): Promise<void> {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  if (command === "init") {
    await runInit({ allowOgaOverride: args.includes("--allow-oga-override") });
    return;
  }

  console.log("Usage: harambee init [--allow-oga-override]");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
