#!/usr/bin/env node
/**
 * Sync WC26 final lineups from API-Football into a Figma broadcast board.
 *
 * Figma REST API is used to fetch the file tree and resolve layer names → node ids.
 * Text writes require the companion plugin (Plugin API) — see scripts/figma-lineup-sync-plugin/.
 *
 * Usage:
 *   FIGMA_TOKEN=... API_FOOTBALL_KEY=... node scripts/sync-figma-final-lineups.mjs --dry-run
 *   FIGMA_TOKEN=... API_FOOTBALL_KEY=... node scripts/sync-figma-final-lineups.mjs --once
 *   FIGMA_TOKEN=... API_FOOTBALL_KEY=... node scripts/sync-figma-final-lineups.mjs --poll --serve
 */
import { createServer } from "node:http";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadConfig } from "./lib/figma-lineup-sync/config.mjs";
import {
  fetchMatchLineupPayload,
  lineupsAreReady,
  resolveApiFixtureId,
} from "./lib/figma-lineup-sync/api-football.mjs";
import { buildTextUpdates } from "./lib/figma-lineup-sync/lineup-slot-mapper.mjs";
import {
  buildPluginPayload,
  fetchFigmaFile,
  indexTextNodesByName,
  layerNameSet,
  validateUpdates,
} from "./lib/figma-lineup-sync/figma-rest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @type {{ payload: object | null; hash: string | null }} */
const pluginState = { payload: null, hash: null };

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
    once: argv.includes("--once") || argv.includes("--dry-run"),
    poll: argv.includes("--poll"),
    serve: argv.includes("--serve"),
    exportPath: readArgValue(argv, "--export"),
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

function readArgValue(argv, flag) {
  const index = argv.indexOf(flag);
  if (index === -1) return null;
  return argv[index + 1] ?? null;
}

function hashPayload(payload) {
  return JSON.stringify(payload);
}

function printHelp() {
  console.log(`sync-figma-final-lineups

Environment:
  FIGMA_TOKEN              Personal access token (file_content:read)
  API_FOOTBALL_KEY         api-sports.io key
  FIGMA_FILE_KEY           Default: vV10C5mvxJ2wlb27PyxEt3
  API_FOOTBALL_FIXTURE_ID  Optional api-sports fixture id override
  WC26_FIGMA_FIXTURE_ID    Local id label (default: fixture-104)
  FIGMA_LINEUP_POLL_MS     Poll interval (default: 60000)
  FIGMA_LINEUP_PLUGIN_PORT Plugin bridge port (default: 8765)

Flags:
  --dry-run    Fetch + validate layers, write payload JSON, no plugin server
  --once       Single sync attempt (default if neither --poll nor --dry-run)
  --poll       Keep polling until lineups are announced, then sync
  --serve      Start localhost HTTP bridge for the Figma plugin
  --export     Write plugin payload to a JSON path
  --help       Show this help

Match-day flow:
  1. node scripts/sync-figma-final-lineups.mjs --poll --serve
  2. Open Figma file → Plugins → Development → GoalCurrent Lineup Sync → Run
  3. Plugin pulls payload from http://localhost:8765/payload and updates text layers
`);
}

async function syncOnce(config, { dryRun = false, exportPath = null } = {}) {
  const apiFixtureId = await resolveApiFixtureId(config);
  console.log(`API-Football fixture id: ${apiFixtureId}`);

  const matchPayload = await fetchMatchLineupPayload(config.apiFootballKey, apiFixtureId);
  if (!lineupsAreReady(matchPayload)) {
    console.log("Lineups not announced yet (need 11 starters per team).");
    return { synced: false, reason: "not-ready", matchPayload };
  }

  console.log(
    `Lineups ready: ${matchPayload.home?.teamName} ${matchPayload.home?.formation} vs ${matchPayload.away?.teamName} ${matchPayload.away?.formation}`,
  );

  const figmaFile = await fetchFigmaFile(config.figmaFileKey, config.figmaToken);
  const textIndex = indexTextNodesByName(figmaFile.document);
  const knownLayers = layerNameSet(textIndex);

  const textUpdates = buildTextUpdates(matchPayload, knownLayers);
  const validation = validateUpdates(textIndex, textUpdates);
  const pluginPayload = buildPluginPayload(textIndex, textUpdates);

  console.log(`Figma layers matched: ${validation.matched.length}`);
  if (validation.missing.length > 0) {
    console.warn(`Missing layers (${validation.missing.length}):`);
    for (const name of validation.missing.slice(0, 12)) {
      console.warn(`  - ${name}`);
    }
    if (validation.missing.length > 12) {
      console.warn(`  ... and ${validation.missing.length - 12} more`);
    }
  }

  const outputPath =
    exportPath ?? join(root, "scripts", "figma-lineup-sync-plugin", "last-payload.json");

  await writeFile(outputPath, `${JSON.stringify(pluginPayload, null, 2)}\n`, "utf8");
  console.log(`Plugin payload written: ${outputPath}`);

  pluginState.payload = pluginPayload;
  pluginState.hash = hashPayload(pluginPayload);

  if (dryRun) {
    console.log("Dry run complete — open the Figma plugin to apply, or re-run with --serve.");
    return { synced: true, dryRun: true, pluginPayload };
  }

  return { synced: true, pluginPayload };
}

function shouldPollForLineups(config) {
  const kickoffMs = Date.parse(config.kickoffUtc);
  if (!Number.isFinite(kickoffMs)) return true;
  const revealAt = kickoffMs - config.lineupRevealMs;
  return Date.now() >= revealAt;
}

function startPluginServer(port) {
  const server = createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, hasPayload: Boolean(pluginState.payload) }));
      return;
    }

    if (req.url === "/payload") {
      if (!pluginState.payload) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No payload yet — wait for lineups or run without --poll" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(pluginState.payload));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`Plugin bridge listening on http://127.0.0.1:${port}/payload`);
  });

  return server;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const config = loadConfig();
  const runPoll = args.poll;
  const runOnce = args.once || (!runPoll && !args.serve);

  if (args.serve) {
    startPluginServer(config.pluginPort);
  }

  const attempt = async () => {
    if (runPoll && !shouldPollForLineups(config)) {
      const kickoffMs = Date.parse(config.kickoffUtc);
      const revealAt = kickoffMs - config.lineupRevealMs;
      console.log(
        `Before lineup reveal window — resumes at ${new Date(revealAt).toISOString()}`,
      );
      return { synced: false, reason: "before-window" };
    }

    return syncOnce(config, {
      dryRun: args.dryRun,
      exportPath: args.exportPath,
    });
  };

  if (runPoll) {
    console.log(`Polling every ${config.pollIntervalMs}ms for lineups…`);
    for (;;) {
      try {
        const result = await attempt();
        if (result.synced) {
          console.log("Lineups synced to plugin payload.");
          if (!args.serve) break;
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
      await new Promise((resolve) => setTimeout(resolve, config.pollIntervalMs));
    }
    if (args.serve) {
      console.log("Poll loop ended — plugin server still running. Press Ctrl+C to exit.");
      await new Promise(() => {});
    }
    return;
  }

  if (runOnce) {
    await attempt();
  } else if (args.serve) {
    console.log("Serve-only mode — waiting for manual sync trigger is not implemented; use --poll --serve.");
    await new Promise(() => {});
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
