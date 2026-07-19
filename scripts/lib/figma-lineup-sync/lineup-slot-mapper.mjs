/** @typedef {import('./types.mjs').ApiLineupPlayer} ApiLineupPlayer */
/** @typedef {import('./types.mjs').ApiLineupSide} ApiLineupSide */
/** @typedef {import('./types.mjs').TextUpdates} TextUpdates */

/** @type {Record<string, { pitch: string[]; subs: number }>} */
export const TEAM_SLOT_TEMPLATES = {
  arg: {
    pitch: [
      "gk",
      "def-1",
      "def-2",
      "def-3",
      "def-4",
      "mid-1",
      "mid-2",
      "mid-3",
      "fwd-1",
      "fwd-2",
      "fwd-3",
    ],
    subs: 7,
  },
  esp: {
    pitch: [
      "gk",
      "def-1",
      "def-2",
      "def-3",
      "def-4",
      "mid-1",
      "mid-2",
      "att-1",
      "att-2",
      "att-3",
      "fwd-1",
    ],
    subs: 7,
  },
};

/** @param {string} teamName */
export function teamPrefixFromName(teamName) {
  const lower = teamName.toLowerCase();
  if (lower.includes("argentin")) return "arg";
  if (lower.includes("spain") || lower.includes("espa")) return "esp";
  return null;
}

/** @param {string} fullName */
export function lastName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

/** @param {ApiLineupPlayer} player @param {"broadcast" | "full"} style */
export function formatPlayerLabel(player, style = "broadcast") {
  const name = style === "broadcast" ? lastName(player.name) : player.name;
  if (player.number == null) return name;
  return style === "full" ? `${player.number} ${player.name}` : name;
}

/** @param {string | null | undefined} grid */
function parseGrid(grid) {
  if (!grid) return null;
  const [rowRaw, colRaw] = grid.split(":");
  const row = Number(rowRaw);
  const col = Number(colRaw);
  if (!Number.isFinite(row) || !Number.isFinite(col)) return null;
  return { row, col };
}

/** @param {ApiLineupPlayer[]} players */
function sortByGrid(players) {
  return [...players].sort((a, b) => {
    const ga = parseGrid(a.grid);
    const gb = parseGrid(b.grid);
    if (ga && gb) {
      if (ga.row !== gb.row) return ga.row - gb.row;
      return ga.col - gb.col;
    }
    if (ga) return -1;
    if (gb) return 1;
    return (a.number ?? 99) - (b.number ?? 99);
  });
}

/** @param {ApiLineupPlayer[]} players @param {string} pos */
function byPos(players, pos) {
  return sortByGrid(players.filter((p) => (p.pos ?? "").toUpperCase() === pos));
}

/**
 * Map API-Football start XI to Figma pitch layer suffixes.
 * @param {ApiLineupSide} side
 * @param {string} prefix
 */
export function mapStartXiToSlots(side, prefix) {
  const template = TEAM_SLOT_TEMPLATES[prefix];
  if (!template) return {};

  const players = side.startXI ?? [];
  const gk = byPos(players, "G");
  const defs = byPos(players, "D");
  const mids = byPos(players, "M");
  const fwds = byPos(players, "F");

  /** @type {Record<string, ApiLineupPlayer>} */
  const slots = {};

  if (gk[0]) slots["gk"] = gk[0];

  defs.slice(0, 4).forEach((player, index) => {
    slots[`def-${index + 1}`] = player;
  });

  mids.slice(0, 3).forEach((player, index) => {
    slots[`mid-${index + 1}`] = player;
  });

  const forwardSlots = template.pitch.filter(
    (slot) => slot.startsWith("fwd-") || slot.startsWith("att-"),
  );

  fwds.slice(0, forwardSlots.length).forEach((player, index) => {
    slots[forwardSlots[index]] = player;
  });

  return slots;
}

/**
 * @param {import('./types.mjs').MatchLineupPayload} payload
 * @param {Set<string>} [knownLayerNames]
 * @returns {TextUpdates}
 */
export function buildTextUpdates(payload, knownLayerNames = new Set()) {
  /** @type {TextUpdates} */
  const updates = {};

  const setText = (layerName, value) => {
    if (!value) return;
    if (knownLayerNames.size > 0 && !knownLayerNames.has(layerName)) return;
    updates[layerName] = value;
  };

  if (payload.kickoffLabel) {
    setText("header/match-kickoff", payload.kickoffLabel);
  }
  if (payload.venueLabel) {
    setText("header/match-venue", payload.venueLabel);
  }

  const sides = [
    { side: payload.home, prefix: payload.home ? teamPrefixFromName(payload.home.teamName) : null },
    { side: payload.away, prefix: payload.away ? teamPrefixFromName(payload.away.teamName) : null },
  ];

  for (const { side, prefix } of sides) {
    if (!side || !prefix) continue;

    const template = TEAM_SLOT_TEMPLATES[prefix];
    const slotPlayers = mapStartXiToSlots(side, prefix);

    for (const slot of template.pitch) {
      const player = slotPlayers[slot];
      if (!player) continue;
      setText(`${prefix}-${slot}-name`, lastName(player.name));
      if (player.number != null) {
        setText(`${prefix}-${slot}-number`, String(player.number));
      }
    }

    if (side.formation) {
      const managerLine = side.coach
        ? `${side.coach} · ${side.formation}`
        : side.formation;
      setText(`header/${prefix}-manager-formation`, managerLine);
      setText(`managers/${prefix}-formation`, side.formation);
      if (side.coach) {
        setText(`managers/${prefix}-manager-name`, side.coach);
      }
    }

    const subs = sortByGrid(side.substitutes ?? []).slice(0, template.subs);
    subs.forEach((player, index) => {
      const label = formatPlayerLabel(player, "full");
      setText(`subs/${prefix}-sub-${index + 1}-name`, label);
    });

    const subsList = subs.map((player) => formatPlayerLabel(player, "full")).join("\n");
    setText(`subs/${prefix}-subs-list`, subsList);
  }

  return updates;
}
