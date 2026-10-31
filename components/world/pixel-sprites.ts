import { color, type Palette } from "./world-model";
import {
  pixel,
  cluster,
  leafCluster,
  blend,
  type Context,
} from "./pixel-drawing";

export function boulder(
  ctx: Context,
  x: number,
  y: number,
  rx: number,
  ry: number,
  p: Palette,
) {
  // Ground shadow
  cluster(ctx, x + 2, y + 2, rx * 1.05, ry * 0.45, color(p.ground, -14));
  // Flat stepped facets distinguish stone from the rounded tree canopies.
  for (let row = -Math.ceil(ry); row <= ry; row++) {
    const taper = row < -ry * 0.4 ? 0.65 : row > ry * 0.5 ? 0.8 : 1;
    const half = Math.max(1, Math.round(rx * taper));
    ctx.fillStyle = color(p.mountain, -18);
    pixel(ctx, x - half, y + row, half * 2);
    ctx.fillStyle = color(p.mountain, -4);
    pixel(ctx, x - half, y + row, half * 1.25);
  }
  // Sunlit top ridge
  cluster(
    ctx,
    x - rx * 0.22,
    y - ry * 0.32,
    rx * 0.52,
    ry * 0.42,
    color(p.far, 6),
  );
  // Lichen and moss crest
  ctx.fillStyle = color(p.grass, 4);
  pixel(ctx, x - rx * 0.35, y - ry * 0.5, Math.max(2, rx * 0.45), 2);
  pixel(ctx, x + rx * 0.08, y - ry * 0.28, Math.max(2, rx * 0.32), 1);
  ctx.fillStyle = color(p.light, -6);
  pixel(ctx, x - rx * 0.18, y - ry * 0.42, 2, 1);
}

export function deer(
  ctx: Context,
  x: number,
  y: number,
  p: Palette,
  time: number,
  facingRight = false,
) {
  // Natural grazing cycle: 5.5s grazing, 2.5s alert
  const cycle = (time * 0.75) % 8;
  const grazing = cycle < 5.5;
  const dir = facingRight ? 1 : -1;

  // Gentle breathing heave (1 pixel vertical expansion)
  const breath = Math.sin(time * 2.2) > 0.65 ? 1 : 0;
  // Tail flick animation: quick 2-beat twitch while grazing
  const tailFlick =
    (cycle > 2.0 && cycle < 2.5) || (cycle > 4.5 && cycle < 5.0)
      ? Math.sin(time * 18) > 0
        ? -1
        : 1
      : 0;
  // Chewing motion while grazing
  const chew = grazing && Math.sin(time * 6.5) > 0.2 ? 1 : 0;
  // Subtle ear twitch
  const earTwitch = cycle > 1.2 && cycle < 1.6 && Math.sin(time * 14) > 0;

  // Ground shadow
  cluster(ctx, x, y + 2, 6, 2, color(p.ground, -12));

  // Slender legs
  ctx.fillStyle = color(p.trunk, -8);
  pixel(ctx, x - 3, y - 1, 1, 3);
  pixel(ctx, x - 1, y - 1, 1, 3);
  pixel(ctx, x + 2, y - 1, 1, 3);
  pixel(ctx, x + 4, y - 1, 1, 3);

  // Warm russet body with breathing
  ctx.fillStyle = color(p.trunk, 12);
  pixel(ctx, x - 3, y - 6 - breath, 8, 5 + breath);
  pixel(ctx, x - 2, y - 7 - breath, 6, 2);
  // White tail / flank mark with flick animation
  ctx.fillStyle = "#e2d9c4";
  const tailX = facingRight ? x - 4 : x + 4;
  pixel(ctx, tailX, y - 6 - breath + tailFlick, 2, 2);

  // Neck, head & antlers
  ctx.fillStyle = color(p.trunk, 12);
  if (grazing) {
    // Head lowered eating meadow grass with chewing
    pixel(ctx, x + dir * 5, y - 5, 2, 3);
    pixel(ctx, x + dir * 6, y - 3, 2, 3);
    pixel(ctx, x + dir * 7, y - 1 + chew, 2, 2);
    // Ears back with occasional twitch
    pixel(ctx, x + dir * 5, y - 6 - (earTwitch ? 1 : 0), 1, 1);
  } else {
    // Alert head raised scanning the valley
    pixel(ctx, x + dir * 4, y - 9 - breath, 2, 4);
    pixel(ctx, x + dir * 5, y - 11 - breath, 3, 3);
    pixel(ctx, x + dir * 7, y - 10 - breath, 2, 1); // muzzle
    // Ears
    ctx.fillStyle = color(p.trunk, 4);
    pixel(ctx, x + dir * 4, y - 13 - breath - (earTwitch ? 1 : 0), 1, 2);
    // Antlers
    ctx.fillStyle = "#96836c";
    pixel(ctx, x + dir * 3, y - 14 - breath, 1, 3);
    pixel(ctx, x + dir * 2, y - 15 - breath, 2, 1);
    pixel(ctx, x + dir * 5, y - 15 - breath, 1, 4);
    pixel(ctx, x + dir * 6, y - 16 - breath, 2, 1);
  }
}
export function tree(
  ctx: Context,
  x: number,
  y: number,
  size: number,
  p: Palette,
  seed: number,
  pine = false,
  time = 0,
) {
  // Sway scales with tree height so foreground trees sway with grandeur
  const maxSway = Math.max(1, size * 0.04);
  const sway =
    (Math.sin(time * 0.82 + seed * 0.12) * 0.72 +
      Math.sin(time * 1.55 + seed * 0.28) * 0.28) *
    maxSway;

  cluster(
    ctx,
    x + size * 0.08,
    y,
    size * 0.26,
    size * 0.045,
    color(p.ground, -10),
  );
  // Rooted trunk with subtle upper flex
  ctx.fillStyle = color(p.trunk, -9);
  pixel(ctx, x - 2, y - size * 0.7, Math.max(1, size * 0.065), size * 0.7);
  ctx.fillStyle = color(p.trunk, 13);
  pixel(ctx, x, y - size * 0.65, 1, size * 0.63);

  if (pine) {
    for (let tier = 0; tier < 5; tier++) {
      const top = y - size + tier * size * 0.14,
        spread = size * (0.14 + tier * 0.035),
        tall = size * 0.33;
      // Fluid tier inertia: upper tiers sway more with harmonic phase lag
      const tierLag = tier * 0.22;
      const tierSway =
        (Math.sin(time * 0.85 + seed * 0.15 + tierLag) * 0.7 +
          Math.sin(time * 1.6 + seed * 0.3) * 0.3) *
        maxSway *
        (1.2 - tier * 0.18);
      for (let row = 0; row < tall; row++) {
        const half = (spread * row) / tall,
          tierFlex = (1 - tier * 0.16) * (row / tall),
          dx = tierSway * tierFlex;
        ctx.fillStyle = color(p.leaf);
        pixel(ctx, x - half + dx, top + row, half * 2 + 1);
        ctx.fillStyle = color(blend(p.leaf, p.leafLight, 0.4));
        pixel(ctx, x - half + dx, top + row, Math.max(1, half * 0.7));
      }
    }
  } else {
    // For larger trees, subtle boughs stay tucked well inside the canopy base
    if (size >= 32) {
      ctx.fillStyle = color(p.trunk);
      const boughReach = Math.min(Math.floor(size * 0.12), 6);
      for (let i = 0; i < boughReach; i++) {
        const branchSway = sway * (i / boughReach);
        pixel(ctx, x - i + branchSway, y - size * 0.65 - i * 0.5, 2, 2);
        pixel(ctx, x + i + branchSway, y - size * 0.68 - i * 0.5, 2, 2);
      }
    }
    // Main solid foliage backing ensures full lush canopy coverage
    cluster(
      ctx,
      x + sway,
      y - size * 0.68,
      size * 0.28,
      size * 0.27,
      color(p.leaf),
    );
    const lobes = [
      [-0.18, -0.57, 0.2],
      [0.17, -0.6, 0.22],
      [0.02, -0.88, 0.23],
      [-0.14, -0.85, 0.19],
      [0.18, -0.85, 0.17],
      [-0.02, -0.65, 0.26],
    ];
    lobes.forEach(([dx, dy, r], i) =>
      leafCluster(
        ctx,
        x + size * dx + sway,
        y + size * dy,
        size * r,
        p.leaf,
        p.leafLight,
        seed + i * 17,
      ),
    );
  }
  // Root tips and moss tie the trunk into the ground
  ctx.fillStyle = color(p.trunk);
  pixel(ctx, x - 4, y - 1, 7);
  ctx.fillStyle = color(p.grass);
  pixel(ctx, x - 5, y, 3);
  pixel(ctx, x + 2, y + 1, 4);
}
