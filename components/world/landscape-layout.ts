/** Shared geometry for water, trail, vegetation and scenery placement. */
export function riverAt(y: number, w: number, h: number, camera: number) {
  const top = h * 0.505;
  const depth = Math.max(0, Math.min(1, (y - top) / (h - top)));

  // More organic river meandering with multiple frequency components
  const baseCurve = Math.sin(depth * 2.3 + camera * 0.0012) * 0.048;
  const secondaryCurve = Math.sin(depth * 4.7 - camera * 0.0008) * 0.028;
  const tertiaryCurve = Math.sin(depth * 7.3 + camera * 0.0004) * 0.012;
  const microMeander = Math.sin(depth * 12.5 - camera * 0.0002) * 0.005;

  const center =
    w * (0.46 + baseCurve + secondaryCurve + tertiaryCurve + microMeander);

  // Variable river width with natural expansion/contraction
  const widthVariation = Math.sin(depth * 3.5 + camera * 0.0015) * 0.15;
  const width = 2 + depth * depth * w * 0.11 * (1 + widthVariation);

  // More natural path placement with varying distance from river
  const pathDistanceVariation = Math.sin(depth * 2.9 + camera * 0.001) * 0.4;
  const path =
    center +
    width * (0.52 + pathDistanceVariation * 0.1) +
    4 +
    depth * w * 0.032;
  const pathWidth = 2 + depth * depth * 7 * (1 + Math.sin(depth * 4.2) * 0.1);

  return { depth, center, width, path, pathWidth };
}
export function clearOfRoutes(
  x: number,
  top: number,
  bottom: number,
  halfWidth: number,
  w: number,
  h: number,
  camera: number,
  padding = 3,
) {
  for (
    let y = Math.max(h * 0.505, Math.floor(top));
    y <= Math.min(h, Math.ceil(bottom));
    y++
  ) {
    const r = riverAt(y, w, h, camera);
    if (
      x + halfWidth >= r.center - r.width / 2 - padding &&
      x - halfWidth <= r.path + r.pathWidth + padding
    )
      return false;
  }
  return true;
}
/** Reserve the full sprite silhouette, shadow and sway across the whole journey.
 * Fixed bank anchors prevent scenery sliding sideways to dodge the moving river. */
export function bankPosition(
  side: "left" | "right",
  fraction: number,
  top: number,
  bottom: number,
  halfWidth: number,
  w: number,
  h: number,
) {
  let left = w,
    right = 0;
  for (let camera = 0; camera <= 700; camera += 10) {
    for (
      let y = Math.max(h * 0.505, Math.floor(top));
      y <= Math.min(h, Math.ceil(bottom));
      y++
    ) {
      const r = riverAt(y, w, h, camera);
      left = Math.min(left, r.center - r.width / 2 - 6);
      right = Math.max(right, r.path + r.pathWidth + 6);
    }
  }
  const min = side === "left" ? halfWidth + 2 : right + halfWidth;
  const max = side === "left" ? left - halfWidth : w - halfWidth - 2;
  if (max < min) return null;
  return min + (max - min) * Math.max(0, Math.min(1, fraction));
}
export type Scenery = {
  kind: "tree" | "rock" | "deer";
  x: number;
  y: number;
  size: number;
  seed: number;
  pine?: boolean;
  halfWidth: number;
  top: number;
  bottom: number;
};
const cache = new Map<string, Scenery[]>();
export function landscapeLayout(w: number, h: number): Scenery[] {
  const key = `${w}:${h}`;
  const previous = cache.get(key);
  if (previous) return previous;
  const result: Scenery[] = [];
  const add = (
    kind: Scenery["kind"],
    side: "left" | "right",
    fraction: number,
    y: number,
    size: number,
    seed: number,
    pine = false,
  ) => {
    const halfWidth =
      kind === "tree"
        ? size * 0.46 + 3
        : kind === "rock"
          ? size * 1.12 + 3
          : size * 10;
    const top =
      y -
      (kind === "tree"
        ? size * 1.08
        : kind === "rock"
          ? size * 0.8
          : size * 17);
    const bottom =
      y +
      (kind === "tree"
        ? size * 0.05 + 2
        : kind === "rock"
          ? size * 0.6 + 3
          : size * 5);
    const x = bankPosition(side, fraction, top, bottom, halfWidth, w, h);
    if (x === null) return;
    result.push({ kind, x, y, size, seed, pine, halfWidth, top, bottom });
  };
  // Irregular groves leave the center valley open. Perspective controls every scale.
  const rows = [0.59, 0.64, 0.7, 0.77, 0.85, 0.95, 1.055];
  rows.forEach((depth, i) => {
    for (const side of ["left", "right"] as const) {
      const size = Math.min(w * 0.16, 11 + i * 6 + (side === "right" ? 3 : 0));
      add(
        "tree",
        side,
        side === "left"
          ? i % 2 === 0
            ? 0.13
            : 0.45
          : i % 2 === 0
            ? 0.72
            : 0.32,
        h * (depth + (side === "right" ? 0.017 : 0)),
        size,
        i * 19 + (side === "left" ? 31 : 71),
        i % 3 !== 1,
      );
    }
  });
  // A few low outcrops, grouped on open dry ground instead of scattered everywhere.
  add("rock", "left", 0.78, h * 0.72, Math.min(5, w * 0.025), 201);
  add("rock", "left", 0.9, h * 0.735, Math.min(3, w * 0.018), 202);
  add("rock", "right", 0.33, h * 0.87, Math.min(7, w * 0.035), 203);
  add("rock", "right", 0.52, h * 0.885, Math.min(3.5, w * 0.019), 204);
  add("deer", "left", 0.77, h * 0.645, 1, 301);
  result.sort((a, b) => a.y - b.y);
  if (cache.size > 8) cache.clear();
  cache.set(key, result);
  return result;
}
