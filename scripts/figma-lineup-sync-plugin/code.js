figma.showUI(__html__, { width: 360, height: 220 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== "apply" || !msg.payload?.entries) {
    figma.ui.postMessage({ type: "error", text: "Invalid payload" });
    return;
  }

  let updated = 0;
  const fontCache = new Map();

  async function loadFont(fontName) {
    const key = fontName.family + "::" + fontName.style;
    if (fontCache.has(key)) return fontCache.get(key);
    const promise = figma.loadFontAsync(fontName);
    fontCache.set(key, promise);
    return promise;
  }

  try {
    for (const entry of msg.payload.entries) {
      for (const nodeId of entry.nodeIds) {
        const node = figma.getNodeById(nodeId);
        if (!node || node.type !== "TEXT") continue;

        const fontName = node.fontName;
        if (fontName === figma.mixed) {
          const segments = node.getStyledTextSegments(["fontName"]);
          for (const segment of segments) {
            await loadFont(segment.fontName);
          }
        } else {
          await loadFont(fontName);
        }

        node.characters = entry.text;
        updated += 1;
      }
    }

    figma.ui.postMessage({
      type: "done",
      text: "Updated " + updated + " text node(s).",
    });
  } catch (error) {
    figma.ui.postMessage({
      type: "error",
      text: String(error instanceof Error ? error.message : error),
    });
  }
};