import { color, noise, type Palette } from "./world-model";
import {
  pixel,
  cluster,
  blend,
  smooth,
  wrap,
  type Context,
} from "./pixel-drawing";
export function atmosphere(
  ctx: Context,
  w: number,
  h: number,
  p: Palette,
  progress: number,
  time: number,
) {
  const horizon = Math.round(h * 0.49),
    night = smooth(0.65, 0.96, progress);
  // Enhanced sky with more color bands
  for (let band = 0; band < 9; band++) {
    const y = Math.floor((band * horizon) / 9),
      end = Math.ceil(((band + 1) * horizon) / 9);
    const bandProgress = band / 8;
    const skyColor = blend(p.sky, p.haze, bandProgress);
    ctx.fillStyle = color(skyColor);
    pixel(ctx, 0, y, w, end - y);
    if (band > 0) {
      ctx.fillStyle = color(blend(p.sky, p.haze, (band - 1) / 8));
      for (let x = band % 2; x < w; x += 4) pixel(ctx, x, y);
    }
  }
  // Twinkling stars with subtle 4-point sparkle on prominent stars and varied brightness
  for (let i = 0; i < 95; i++) {
    const twinkle = Math.sin(time * (0.5 + noise(i) * 1.4) + i * 2.1);
    const brightness = 0.25 + noise(i + 42) * 0.75;
    const visibility =
      night * (brightness * (0.3 + 0.7 * smooth(-0.8, 0.8, twinkle)));
    if (visibility > 0.02) {
      ctx.globalAlpha = visibility;
      const starColor =
        noise(i + 15) > 0.6
          ? "#f0e6d0"
          : noise(i + 25) > 0.5
            ? "#c8e0f0"
            : noise(i + 35) > 0.4
              ? "#ffd9b3"
              : "#e8f0f0";
      ctx.fillStyle = starColor;
      const x = noise(i + 5) * w,
        y = 4 + noise(i + 89) * h * 0.38;
      const starSize = noise(i + 67) > 0.65 ? 2 : 1;
      pixel(ctx, x, y, starSize, starSize);
      if (i % 8 === 0 && visibility > 0.45) {
        ctx.globalAlpha = visibility * 0.35;
        pixel(ctx, x - 1, y, 3, 1);
        pixel(ctx, x, y - 1, 1, 3);
        // Extra sparkle for brightest stars
        if (visibility > 0.7 && i % 16 === 0) {
          ctx.globalAlpha = visibility * 0.18;
          pixel(ctx, x - 2, y, 5, 1);
          pixel(ctx, x, y - 2, 1, 5);
        }
      }
    }
  }
  // Occasional swift shooting star at deep night with randomized timing and paths
  if (night > 0.65) {
    const shootCycle = 11 + noise(Math.floor(time / 15)) * 4;
    const shootT = time % shootCycle;
    if (shootT < 0.8) {
      const sp = shootT / 0.8;
      const seedIndex = Math.floor(time / shootCycle);
      const startX = w * 0.15 + noise(seedIndex + 11) * w * 0.65;
      const startY = h * 0.03 + noise(seedIndex + 77) * h * 0.15;
      const direction = noise(seedIndex + 33) > 0.5 ? 1 : -1;
      const sx = startX + sp * 65 * direction;
      const sy = startY + sp * 25;
      const streakAlpha = night * (1 - sp * sp);
      ctx.globalAlpha = streakAlpha;
      ctx.fillStyle = "#ffffff";
      pixel(ctx, sx, sy);
      ctx.globalAlpha = streakAlpha * 0.55;
      ctx.fillStyle = "#d4eaf7";
      pixel(ctx, sx - 2 * direction, sy - 1, 2, 1);
      ctx.globalAlpha = streakAlpha * 0.2;
      ctx.fillStyle = "#a8d4e8";
      pixel(ctx, sx - 4 * direction, sy - 1, 2, 1);
    }
  }
  ctx.globalAlpha = 1;

  // Sun with enhanced sunset warmth and atmospheric glow
  const sunY = h * 0.14 + smooth(0.38, 0.78, progress) * h * 0.32;
  const sunVisible = 1 - smooth(0.66, 0.8, progress);
  if (sunVisible > 0) {
    ctx.globalAlpha = sunVisible;
    const sunset = smooth(0.35, 0.68, progress);
    const sunPulse = 1 + Math.sin(time * 0.7) * 0.06;

    // Enhanced sunset glow layers
    if (sunset > 0.08) {
      const sunsetIntensity = smooth(0.35, 0.68, progress);
      ctx.globalAlpha = sunVisible * sunsetIntensity * 0.55;
      cluster(ctx, w * 0.79, sunY, 15 * sunPulse, 15 * sunPulse, "#ff8c42");
      ctx.globalAlpha = sunVisible * sunsetIntensity * 0.35;
      cluster(ctx, w * 0.79, sunY, 18 * sunPulse, 18 * sunPulse, "#ffb347");
      ctx.globalAlpha = sunVisible;
    }

    // Main sun with color transition
    const sunColor =
      sunset > 0.5 ? "#ffb347" : sunset > 0.3 ? "#ffd700" : "#fffacd";
    cluster(ctx, w * 0.79, sunY, 10 * sunPulse, 10 * sunPulse, sunColor);

    // Sun core highlight
    ctx.globalAlpha = sunVisible * 0.3;
    cluster(ctx, w * 0.79, sunY, 6 * sunPulse, 6 * sunPulse, "#fff8dc");
    ctx.globalAlpha = sunVisible;

    // Enhanced sun rays with animation
    if (sunset < 0.4) {
      const rayIntensity = 1 - sunset * 2.5;
      ctx.globalAlpha = sunVisible * rayIntensity * 0.2;
      const rayAngle = time * 0.25;
      for (let i = 0; i < 12; i++) {
        const angle = rayAngle + (i * Math.PI) / 6;
        const rayLength = 12 + Math.sin(time * 0.5 + i) * 3;
        const rayX = w * 0.79 + Math.cos(angle) * rayLength;
        const rayY = sunY + Math.sin(angle) * rayLength;
        pixel(ctx, rayX, rayY, 4, 1);
      }
    }
  }

  // Moon rising gracefully as night settles, with subtle crescent detail and glow
  const moonVisible = smooth(0.68, 0.86, progress);
  if (moonVisible > 0) {
    const moonRise = smooth(0.68, 1, progress);
    const moonY = h * 0.21 - moonRise * h * 0.07;
    const moonGlow = 1 + Math.sin(time * 0.5) * 0.08;
    ctx.globalAlpha = moonVisible;
    ctx.fillStyle = "#dbe2c4";
    for (let row = -8; row <= 8; row++) {
      const left = -Math.sqrt(Math.max(0, 64 - row * row)),
        right = Math.sqrt(Math.max(0, 64 - row * row));
      const cut = 3 - Math.sqrt(Math.max(0, 64 - (row + 3) * (row + 3)));
      if (cut > left)
        pixel(ctx, w * 0.79 + left, moonY + row, Math.min(right, cut) - left);
    }
    // Moon glow aura
    ctx.globalAlpha = moonVisible * 0.12 * moonGlow;
    ctx.fillStyle = "#e8ebd9";
    cluster(ctx, w * 0.79, moonY, 11 * moonGlow, 11 * moonGlow, "#e8ebd9");
    ctx.globalAlpha = moonVisible * 0.18;
    ctx.fillStyle = "#e0e8d0";
    pixel(ctx, w * 0.79 - 9, moonY - 2, 1, 5);
    pixel(ctx, w * 0.79 + 8, moonY - 3, 1, 6);
  }
  ctx.globalAlpha = 1;

  // Multi-tier drifting clouds with enhanced lighting and more variety
  const wrapSpan = w + 200;
  for (let i = 0; i < 10; i++) {
    const layer = i < 4 ? 0 : i < 7 ? 1 : 2;
    const speed = layer === 0 ? 0.28 : layer === 1 ? 0.52 : 0.78;
    const s =
      layer === 0
        ? 0.5 + noise(i + 45) * 0.4
        : layer === 1
          ? 0.7 + noise(i + 45) * 0.45
          : 0.85 + noise(i + 45) * 0.55;
    const wobble = Math.sin(time * 0.35 + i * 0.9) * 3;
    const verticalDrift = Math.sin(time * 0.2 + i * 0.7) * 1.5;
    const x =
      wrap(
        noise(i + 23) * wrapSpan + time * speed - progress * 20 + wobble,
        wrapSpan,
      ) - 100;
    const y =
      h *
        (layer === 0
          ? 0.05 + noise(i + 99) * 0.13
          : layer === 1
            ? 0.13 + noise(i + 99) * 0.14
            : 0.21 + noise(i + 99) * 0.11) +
      verticalDrift * 0.01;

    const cloudBase = blend(
      p.sky,
      p.haze,
      layer === 0 ? 0.45 : layer === 1 ? 0.6 : 0.75,
    );
    const cloudShadow = blend(cloudBase, p.far, 0.45);
    const cloudLight = blend(cloudBase, p.light, 0.4);
    const sunset = smooth(0.35, 0.68, progress);
    const cloudHighlight =
      sunset > 0.2
        ? blend(p.light, [255, 195, 145], sunset * 0.7)
        : blend(cloudBase, [255, 255, 240], 0.25);

    // Main cloud puffs with varied shapes and sizes
    const puffCount = 3 + (i % 4);
    for (let j = 0; j < puffCount; j++) {
      const puffX = x + (j - 1) * 9 * s + noise(i + j * 7) * 5;
      const puffY = y + noise(i + j * 11) * 4 - j * 2.5;
      const puffSize = (9 + noise(i + j * 13) * 7) * s;
      cluster(ctx, puffX, puffY, puffSize, puffSize * 0.42, color(cloudBase));

      // Add depth shading to larger puffs
      if (puffSize > 10 * s) {
        ctx.fillStyle = color(cloudShadow);
        cluster(
          ctx,
          puffX,
          puffY + puffSize * 0.2,
          puffSize * 0.8,
          puffSize * 0.15,
          color(cloudShadow),
        );
      }
    }

    // Enhanced sunlit top highlight with multiple layers
    ctx.fillStyle = color(cloudHighlight);
    pixel(ctx, x - 7 * s, y - 8 * s, 16 * s, 1.8 * s);
    pixel(ctx, x + 5 * s, y - 10 * s, 12 * s, 1.8 * s);

    // Secondary highlight for depth
    ctx.fillStyle = color(cloudLight);
    pixel(ctx, x - 5 * s, y - 6 * s, 12 * s, 1.2 * s);
    pixel(ctx, x + 3 * s, y - 7 * s, 8 * s, 1.2 * s);

    // Soft underside shadow band with gradient
    ctx.fillStyle = color(cloudShadow);
    pixel(ctx, x - 22 * s, y + 4 * s, 42 * s, 1.8 * s);

    // Add subtle cloud edges for definition
    if (noise(i + 67) > 0.6) {
      ctx.fillStyle = color(blend(cloudBase, p.haze, 0.2));
      pixel(ctx, x - 18 * s, y - 1, 40 * s, 1);
    }
  }

  // Faint ethereal Milky Way stardust trail at night
  if (night > 0.35) {
    const mwAlpha = smooth(0.35, 0.85, night) * 0.07;
    ctx.globalAlpha = mwAlpha;
    ctx.fillStyle = "#cad6f5";
    for (let band = 0; band < 18; band++) {
      const bx = w * 0.18 + (band / 18) * (w * 0.64) + Math.sin(band * 0.4) * 8;
      const by = h * 0.04 + (band / 18) * (h * 0.24);
      pixel(ctx, bx - 6, by, 14, 2);
      pixel(ctx, bx - 10, by + 1, 20, 1);
    }
    ctx.globalAlpha = 1;
  }

  // Migratory bird flock flying gracefully across the sky in V-formation with flap-and-glide
  const birdNight = smooth(0.62, 0.78, progress);
  if (birdNight < 1) {
    ctx.globalAlpha = (1 - birdNight) * 0.65;
    ctx.fillStyle = color(p.mountain, -20);
    const flockSpan = w + 140;
    const flockX = wrap(time * 7 + w * 0.3, flockSpan) - 70;
    const flockY = h * 0.22 + Math.sin(time * 0.2) * 4;

    const formation = [
      { dx: 0, dy: 0, lead: 0 },
      { dx: -10, dy: -5, lead: 1 },
      { dx: -9, dy: 6, lead: 2 },
      { dx: -19, dy: -9, lead: 3 },
      { dx: -18, dy: 11, lead: 4 },
    ];

    const flapCycle = (time * 3.5) % 8;
    for (const b of formation) {
      const bx = flockX + b.dx;
      const by = flockY + b.dy;
      let wing = 0;
      if (flapCycle < 4.8) {
        const phase = Math.floor((time * 4 + b.lead * 0.4) % 4);
        wing = phase === 1 ? 1 : phase === 3 ? -1 : 0;
      } else {
        wing = -1;
      }
      pixel(ctx, bx, by);
      pixel(ctx, bx - 2, by + wing, 2, 1);
      pixel(ctx, bx + 1, by + wing, 2, 1);
    }
    ctx.globalAlpha = 1;
  }

  // Soaring solitary mountain eagle circling thermal updrafts
  if (birdNight < 0.88) {
    ctx.globalAlpha = (1 - birdNight) * 0.68;
    ctx.fillStyle = color(p.far, -32);
    const eagleT = time * 0.16;
    const ex = w * 0.48 + Math.cos(eagleT) * (w * 0.22);
    const ey = h * 0.13 + Math.sin(eagleT) * (h * 0.032);
    const bank = Math.cos(eagleT);
    const wingTilt = bank > 0.4 ? 1 : bank < -0.4 ? -1 : 0;
    pixel(ctx, ex, ey, 1, 1);
    pixel(ctx, ex - 2, ey - wingTilt, 2, 1);
    pixel(ctx, ex + 1, ey + wingTilt, 2, 1);
    ctx.globalAlpha = 1;
  }
}
