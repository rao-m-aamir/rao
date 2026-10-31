import { worldPalette, color, noise } from "./world-model";
import { tree, boulder, deer } from "./pixel-sprites";
import { atmosphere } from "./atmosphere";
import { terrain } from "./terrain";
import { landscapeLayout, riverAt } from "./landscape-layout";
import { pixel, cluster, smooth, wrap, type Context } from "./pixel-drawing";
export function drawWorld(
  ctx: Context,
  w: number,
  h: number,
  progress: number,
  time: number,
) {
  const p = worldPalette(progress),
    camera = progress * 700,
    night = smooth(0.65, 0.96, progress);
  ctx.globalAlpha = 1;
  ctx.imageSmoothingEnabled = false;
  atmosphere(ctx, w, h, p, progress, time);
  terrain(ctx, w, h, p, camera, time);

  // One depth-sorted scene. Every silhouette is anchored to reserved dry ground.
  for (const item of landscapeLayout(w, h)) {
    const { x, y, size, seed } = item;
    if (item.kind === "tree") tree(ctx, x, y, size, p, seed, item.pine, time);
    else if (item.kind === "rock") boulder(ctx, x, y, size, size * 0.58, p);
    else {
      const presence =
        smooth(0.18, 0.28, progress) * (1 - smooth(0.76, 0.86, progress));
      if (presence > 0) {
        ctx.save();
        ctx.globalAlpha = presence;
        ctx.translate(Math.round(x), Math.round(y));
        ctx.scale(size, size);
        deer(ctx, 0, 0, p, time, true);
        ctx.restore();
      }
    }
  }
  // Layered drifting valley mist wisps across the river basin with enhanced movement
  const mist =
    smooth(0.58, 0.75, progress) * (1 - smooth(0.84, 0.98, progress));
  if (mist > 0) {
    for (let i = 0; i < 7; i++) {
      const mistSpan = w + 200;
      const mistSpeed = 3 + i * 1.5 + noise(i + 23) * 2;
      const mx =
        wrap(
          w * 0.35 + time * mistSpeed + i * 100 + Math.sin(time * 0.2 + i) * 20,
          mistSpan,
        ) - 100;
      const my = h * (0.48 + i * 0.07) + Math.sin(time * 0.3 + i * 1.5) * 3;
      const mw = Math.round(w * (0.25 + (i % 4) * 0.12));
      const mh = 2 + (i % 2) + Math.sin(time * 0.4 + i) * 0.5;
      ctx.globalAlpha = mist * (0.08 + (i % 4) * 0.03);
      cluster(ctx, mx, my, mw, Math.max(1, mh), color(p.haze));
    }
    ctx.globalAlpha = 1;
  }

  // Daytime floating dandelion fluff and windblown leaves with enhanced variety
  const dayFactor = 1 - night;
  if (dayFactor > 0.1) {
    ctx.globalAlpha = dayFactor * 0.45;
    ctx.fillStyle = color(p.light, 16);
    for (let i = 0; i < 8; i++) {
      const driftX = Math.sin(time * 0.55 + i * 0.85) * 18;
      const driftY = Math.cos(time * 0.35 + i * 0.7) * 8;
      const px =
        wrap(
          time * (1.1 + noise(i) * 2.0) + noise(i + 75) * (w + 55) + driftX,
          w + 55,
        ) - 27;
      const py =
        h * (0.48 + noise(i + 87) * 0.46) +
        Math.sin(time * 0.85 + i * 1.8) * 5 +
        driftY;
      const fluffSize = noise(i + 33) > 0.55 ? 2 : 1;
      pixel(ctx, px, py, fluffSize, fluffSize);
    }
    // Tumbling foliage leaves caught in the breeze with more variety
    for (let i = 0; i < 8; i++) {
      const leafDrift = Math.cos(time * 0.45 + i * 0.95) * 14;
      const leafBob = Math.sin(time * 0.25 + i * 0.6) * 6;
      const lx =
        wrap(
          time * (2.4 + noise(i + 3) * 2.8) +
            noise(i + 12) * (w + 55) +
            leafDrift,
          w + 55,
        ) - 27;
      const ly =
        h * (0.44 + noise(i + 55) * 0.5) +
        Math.sin(time * 2.4 + i * 2.5) * 7 +
        leafBob;
      const tumble = Math.sin(time * 4.8 + i * 0.75);
      const leafColor =
        i % 4 === 0
          ? color(p.leafLight)
          : i % 4 === 1
            ? color(p.light, -6)
            : i % 4 === 2
              ? color(p.leafLight, -3)
              : color(p.light, -10);
      ctx.fillStyle = leafColor;
      const leafWidth = tumble > 0.25 ? 2 : 1;
      const leafHeight = tumble < -0.25 ? 2 : 1;
      pixel(ctx, lx, ly, leafWidth, leafHeight);
    }

    // Drifting wildflower blossom petals caught in gentle eddies
    for (let pIdx = 0; pIdx < 4; pIdx++) {
      const petalDrift = Math.sin(time * 0.65 + pIdx * 1.4) * 16;
      const px =
        wrap(
          time * (2.8 + pIdx * 0.9) + noise(pIdx + 92) * (w + 40) + petalDrift,
          w + 40,
        ) - 20;
      const py =
        h * (0.52 + noise(pIdx + 41) * 0.42) +
        Math.sin(time * 1.8 + pIdx * 2.1) * 6;
      const petalColor =
        pIdx % 3 === 0 ? "#829fb6" : pIdx % 3 === 1 ? "#b36f57" : "#cdb864";
      ctx.fillStyle = petalColor;
      pixel(ctx, px, py, 1, 1);
    }
  }

  // Daytime & golden hour whimsical meadow butterflies
  if (night < 0.65) {
    const butterflyAlpha = 1 - smooth(0.48, 0.65, night);
    for (let b = 0; b < 3; b++) {
      const bSpeed = 1.6 + b * 0.9;
      const bLoopX =
        Math.sin(time * 0.9 + b * 2.1) * 32 +
        Math.sin(time * 2.2 + b * 1.5) * 8;
      const bLoopY =
        Math.cos(time * 0.7 + b * 1.8) * 12 +
        Math.sin(time * 1.9 + b * 2.7) * 5;
      const bx =
        wrap(time * bSpeed + noise(b * 19 + 7) * w + bLoopX, w + 40) - 20;
      const by = h * (0.57 + noise(b * 29 + 13) * 0.28) + bLoopY;

      // Wing flutter cycle (flutter and glide)
      const flutterPhase = (time * 11 + b * 3) % 6;
      const wingsUp = flutterPhase < 3.8 && Math.sin(time * 24 + b * 4) > 0;

      const wingColor = b === 0 ? "#74a8db" : b === 1 ? "#ebd160" : "#e08170";
      const bodyColor = b === 0 ? "#334f6e" : b === 1 ? "#6b5824" : "#5e3027";

      ctx.globalAlpha = butterflyAlpha * 0.88;
      ctx.fillStyle = bodyColor;
      pixel(ctx, bx, by, 1, 1);

      ctx.fillStyle = wingColor;
      if (wingsUp) {
        pixel(ctx, bx - 1, by - 1, 1, 2);
        pixel(ctx, bx + 1, by - 1, 1, 2);
      } else {
        pixel(ctx, bx - 1, by, 3, 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  // Dusk and night: organic wandering fireflies with enhanced glowing effects
  if (night > 0.12) {
    const riverTop = Math.ceil(h * 0.505);
    for (let i = 0; i < 24; i++) {
      const pulse = Math.sin(time * (0.8 + noise(i) * 1.3) + i * 2.8);
      const glow = smooth(-0.35, 0.9, pulse);
      if (glow > 0.05) {
        const wanderX = Math.sin(time * 0.45 + i * 1.6) * 22;
        const wanderY = Math.cos(time * 0.35 + i * 1.9) * 14;
        const verticalBob = Math.sin(time * 0.65 + i * 2.4) * 7;
        const fx =
          wrap(
            noise(i + 75) * w + wanderX + time * (1.3 + noise(i) * 0.9),
            w + 45,
          ) - 22;
        const fy = h * (0.5 + noise(i + 87) * 0.44) + wanderY + verticalBob;

        const fireflyColor =
          noise(i + 33) > 0.6
            ? "#ffe066"
            : noise(i + 44) > 0.5
              ? "#ffeb66"
              : noise(i + 55) > 0.4
                ? "#ffd933"
                : "#ffc34d";
        ctx.globalAlpha = glow * night * 0.92;
        ctx.fillStyle = fireflyColor;
        pixel(ctx, fx, fy);

        // Subtle river reflection when hovering over water
        if (fy >= riverTop) {
          const rAt = riverAt(fy, w, h, camera);
          if (Math.abs(fx - rAt.center) < rAt.width * 0.45) {
            ctx.globalAlpha = glow * night * 0.28;
            ctx.fillStyle = fireflyColor;
            pixel(ctx, fx, fy + 2, 1, 1);
          }
        }

        // Enhanced soft aura at peak brightness
        if (glow > 0.6) {
          ctx.globalAlpha = glow * night * 0.35;
          ctx.fillStyle = "#ffb84d";
          pixel(ctx, fx - 1, fy, 3, 1);
          pixel(ctx, fx, fy - 1, 1, 3);
          // Multi-layered outer glow for brightest fireflies
          if (glow > 0.75 && i % 3 === 0) {
            ctx.globalAlpha = glow * night * 0.18;
            ctx.fillStyle = "#ffa31a";
            pixel(ctx, fx - 2, fy, 5, 1);
            pixel(ctx, fx, fy - 2, 1, 5);
            // Outermost glow
            if (glow > 0.85 && i % 6 === 0) {
              ctx.globalAlpha = glow * night * 0.08;
              ctx.fillStyle = "#ff9933";
              pixel(ctx, fx - 3, fy, 7, 1);
              pixel(ctx, fx, fy - 3, 1, 7);
            }
          }
        }
      }
    }
  }
  ctx.globalAlpha = 1;
}
