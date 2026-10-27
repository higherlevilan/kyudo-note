#!/usr/bin/env node
// Run the journal's plain self-checks (src/lib/journal/selfcheck.ts) under Node's built-in TypeScript type
// stripping, no test framework or bundler needed:
//
//   npm test
//
// The journal modules use extensionless relative imports ("./csv"), as the Next bundler expects; the resolve hook
// below retries those with ".ts" so Node can load them directly. Exits 1 and lists the failures if any check fails.

import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (!specifier.startsWith(".")) throw err;
      for (const suffix of [".ts", "/index.ts"]) {
        try {
          return nextResolve(specifier + suffix, context);
        } catch {
          /* try the next suffix */
        }
      }
      throw err;
    }
  },
});

const { runJournalSelfChecks } = await import("../../src/lib/journal/selfcheck.ts");
const failures = await runJournalSelfChecks();
if (failures.length) {
  console.error(`Journal self-checks: ${failures.length} failed`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("Journal self-checks: all passed");
