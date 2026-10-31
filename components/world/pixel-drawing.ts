import { color, noise, type RGB } from "./world-model";
export type Context = CanvasRenderingContext2D;
/** Every mark lands on the native pixel grid, including moving objects. */
export function pixel(ctx: Context, x: number, y: number, w = 1, h = 1) {
  ctx.fillRect(
    Math.round(x),
    Math.round(y),
    Math.max(1, Math.round(w)),
    Math.max(1, Math.round(h)),
  );
}
export function blend(a: RGB, b: RGB, t: number): RGB {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;
}
export function smooth(a: number, b: number, v: number) {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
export function wrap(v: number, size: number) {
  return ((v % size) + size) % size;
}
/** Stepped oval for cloud lobes, foliage clusters and ground shadows. */
export function cluster(
  ctx: Context,
  x: number,
  y: number,
  rx: number,
  ry: number,
  shade: string,
) {
  ctx.fillStyle = shade;
  for (let row = -Math.ceil(ry); row <= ry; row++) {
    const half = Math.round(
      rx * Math.sqrt(Math.max(0, 1 - (row * row) / (ry * ry))),
    );
    if (half) pixel(ctx, x - half, y + row, half * 2, 1);
  }
}
export function leafCluster(
  ctx: Context,
  x: number,
  y: number,
  r: number,
  base: RGB,
  light: RGB,
  seed: number,
) {
  cluster(ctx, x, y, r, r * 0.72, color(base));
  cluster(
    ctx,
    x - r * 0.17,
    y - r * 0.2,
    r * 0.77,
    r * 0.48,
    color(blend(base, light, 0.45)),
  );
  cluster(ctx, x - r * 0.28, y - r * 0.32, r * 0.47, r * 0.24, color(light));
  for (let i = 0; i < 4; i++) {
    const px = (noise(seed + i) * 2 - 1) * r * 0.75,
      py = (noise(seed + i + 51) * 2 - 1) * r * 0.45;
    ctx.fillStyle = color(i % 3 ? base : light);
    pixel(ctx, x + px, y + py, 2, 1);
  }
}
