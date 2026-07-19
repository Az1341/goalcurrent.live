const FIGMA_API = "https://api.figma.com/v1";

/**
 * Fetch Figma file JSON (REST API — read-only for text content).
 * @param {string} fileKey
 * @param {string} token
 * @param {number} [depth]
 */
export async function fetchFigmaFile(fileKey, token, depth = 6) {
  const res = await fetch(`${FIGMA_API}/files/${fileKey}?depth=${depth}`, {
    headers: { "X-Figma-Token": token },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Figma GET /files/${fileKey} failed (${res.status}): ${body.slice(0, 200)}`);
  }

  return res.json();
}

/**
 * Index TEXT nodes by layer name (supports duplicate names on desktop + mobile).
 * @param {Record<string, unknown>} node
 * @param {Map<string, string[]>} [index]
 */
export function indexTextNodesByName(node, index = new Map()) {
  if (!node || typeof node !== "object") return index;

  if (node.type === "TEXT" && typeof node.name === "string") {
    const ids = index.get(node.name) ?? [];
    ids.push(String(node.id));
    index.set(node.name, ids);
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      indexTextNodesByName(child, index);
    }
  }

  return index;
}

/** @param {Map<string, string[]>} index */
export function layerNameSet(index) {
  return new Set(index.keys());
}

/**
 * Validate that expected lineup layers exist in the Figma file.
 * @param {Map<string, string[]>} index
 * @param {import('./types.mjs').TextUpdates} updates
 */
export function validateUpdates(index, updates) {
  const missing = [];
  const matched = [];

  for (const layerName of Object.keys(updates)) {
    if (index.has(layerName)) {
      matched.push(layerName);
    } else {
      missing.push(layerName);
    }
  }

  return { missing, matched };
}

/**
 * Figma REST API cannot mutate text nodes — returns node id map for the plugin bridge.
 * @param {Map<string, string[]>} index
 * @param {import('./types.mjs').TextUpdates} updates
 */
export function buildPluginPayload(index, updates) {
  /** @type {Array<{ nodeIds: string[]; layerName: string; text: string }>} */
  const entries = [];

  for (const [layerName, text] of Object.entries(updates)) {
    const nodeIds = index.get(layerName);
    if (!nodeIds?.length) continue;
    entries.push({ layerName, nodeIds, text });
  }

  return {
    generatedAt: new Date().toISOString(),
    updateCount: entries.length,
    entries,
  };
}
