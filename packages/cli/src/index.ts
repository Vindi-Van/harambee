#!/usr/bin/env node
import { runInit } from "./init.js";

async function main(): Promise<void> {
  const command = process.argv[2];

  if (command === "init") {
    await runInit();
    return;
  }

  console.log("Usage: harambee init");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
