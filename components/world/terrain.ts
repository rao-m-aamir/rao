import { color, noise, type Palette } from "./world-model";
import { pixel, blend, type Context } from "./pixel-drawing";
import { riverAt, clearOfRoutes } from "./landscape-layout";
export { riverAt } from "./landscape-layout";
export function terrain(
  ctx: Context,
  w: number,
  h: number,
  p: Palette,
  camera: number,
  time: number,
) {
  const shades = [p.far, p.mountain, p.hill, p.ground];
  for (let layer = 0; layer < 4; layer++) {
    for (let x = 0; x < w; x++) {
      const wx = x + camera * (0.022 + layer * 0.025);
      let ridge: number;
      if (layer === 0) {
        // Craggy alpine peaks with more varied, natural ridgelines
        const primaryPeak = Math.abs(Math.sin(wx * 0.012 + 1.4)) * h * 0.075;
        const secondaryPeak = Math.abs(Math.sin(wx * 0.028 + 0.8)) * h * 0.04;
        const tertiaryPeak = Math.abs(Math.sin(wx * 0.045 + 2.1)) * h * 0.025;
        const baseElevation = Math.sin(wx * 0.0065) * h * 0.038;
        const noiseVariation = noise(Math.floor(wx / 4)) * h * 0.015;

        const peak =
          primaryPeak +
          secondaryPeak +
          tertiaryPeak +
          baseElevation +
          noiseVariation;
        ridge = h * 0.265 + peak;
        ctx.fillStyle = color(shades[0]);
        pixel(ctx, x, ridge, 1, h - ridge);
        // Crisp snowcaps & sunlit rock highlights on tall peaks
        if (ridge < h * 0.315) {
          ctx.fillStyle = color(blend(shades[0], [242, 248, 255], 0.42));
          pixel(ctx, x, ridge, 1, 2 + noise(Math.floor(wx / 3)) * 3);
        }
        // Add rocky outcrops on steep slopes
        if (Math.sin(wx * 0.038 + 1.7) > 0.6 && ridge > h * 0.32) {
          ctx.fillStyle = color(blend(shades[0], [180, 185, 190], 0.25));
          pixel(ctx, x, ridge + 1, 1, 2 + noise(Math.floor(wx / 5)) * 2);
        }
      } else if (layer === 1) {
        // Mid-distance rocky mountains with more varied profiles
        const primaryRange = Math.sin(wx * 0.016 + 2.7) * h * 0.055;
        const secondaryRange = Math.sin(wx * 0.038 + 1.2) * h * 0.025;
        const tertiaryRange = Math.sin(wx * 0.065 + 3.8) * h * 0.012;
        const baseElevation = Math.sin(wx * 0.0085) * h * 0.038;
        const noiseVariation = noise(Math.floor(wx / 6)) * h * 0.012;

        ridge =
          h * 0.375 +
          primaryRange +
          secondaryRange +
          tertiaryRange +
          baseElevation +
          noiseVariation;
        ctx.fillStyle = color(shades[1]);
        pixel(ctx, x, ridge, 1, h - ridge);
        // Rock face stratification with more natural patterns
        if (Math.sin(wx * 0.042 + 1.3) > 0.25) {
          ctx.fillStyle = color(blend(shades[1], p.haze, 0.12));
          pixel(ctx, x, ridge + 2, 1, 3 + noise(Math.floor(wx / 4)) * 4);
        }
        // Add occasional cliff faces
        if (Math.sin(wx * 0.055 + 2.8) > 0.7) {
          ctx.fillStyle = color(blend(shades[1], [140, 145, 150], 0.2));
          pixel(ctx, x, ridge + 1, 1, 4 + noise(Math.floor(wx / 7)) * 3);
        }
      } else if (layer === 2) {
        // Rolling forested hills with more varied topography
        const primaryRoll = Math.sin(wx * 0.02 + 4.2) * h * 0.042;
        const secondaryRoll = Math.sin(wx * 0.048 + 2.3) * h * 0.018;
        const tertiaryRoll = Math.sin(wx * 0.075 + 5.1) * h * 0.008;
        const baseElevation = Math.sin(wx * 0.012) * h * 0.025;
        const noiseVariation = noise(Math.floor(wx / 5)) * h * 0.01;

        ridge =
          h * 0.435 +
          primaryRoll +
          secondaryRoll +
          tertiaryRoll +
          baseElevation +
          noiseVariation;
        ctx.fillStyle = color(shades[2]);
        pixel(ctx, x, ridge, 1, h - ridge);
        // Distant pine tree silhouettes along the hillcrest with varied distribution
        const grove = Math.floor(wx / 8);
        const crown = 3 - Math.abs((((wx % 8) + 8) % 8) - 3);
        const pineH = Math.max(0, crown * (0.75 + noise(grove + 77) * 0.75));
        if (pineH > 0 && noise(grove + 91) > 0.3) {
          ctx.fillStyle = color(shades[2], -7);
          pixel(ctx, x, ridge - pineH, 1, pineH + 1);
        }
      } else {
        // Ground meadow plane with smoother, organic terrain
        const baseTerrain = h * 0.495;
        const primaryWave = Math.sin(wx * 0.015 + 6) * h * 0.028;
        const secondaryWave = Math.sin(wx * 0.032 + 2.3) * h * 0.012;
        const tertiaryWave = Math.sin(wx * 0.058 + 4.7) * h * 0.006;
        // Use continuous noise instead of stepped noise for smoother transitions
        const continuousNoise = (noise(wx * 0.1) - 0.5) * h * 0.012;

        ridge = Math.min(
          h * 0.508,
          baseTerrain +
            primaryWave +
            secondaryWave +
            tertiaryWave +
            continuousNoise,
        );

        ctx.fillStyle = color(shades[3]);
        pixel(ctx, x, ridge, 1, h - ridge);
      }
    }
  }

  const top = Math.ceil(h * 0.505);

  // River and pathway through the meadow
  for (let y = top; y < h; y++) {
    const { depth, center, width, path, pathWidth } = riverAt(y, w, h, camera);

    // Riverbank banks and ochre soil
    ctx.fillStyle = color(p.ground, -12);
    pixel(ctx, center - width / 2 - 2, y, width + 4);

    // Shallow gravel shoals on the inner bend of the river
    const innerBend = Math.sin(depth * 3.5);
    if (innerBend > 0.4 && depth > 0.15) {
      ctx.fillStyle = color(p.path, -16);
      pixel(
        ctx,
        center - width / 2 - 2 - width * 0.06,
        y,
        Math.max(1, width * 0.08),
      );
    }

    // River water channel
    ctx.fillStyle = color(p.water, -14);
    pixel(ctx, center - width / 2, y, width);
    ctx.fillStyle = color(p.water);
    pixel(ctx, center - width * 0.27, y, width * 0.53);

    // Gorge headwater cascade churning at the horizon threshold
    if (y < top + 4) {
      const cascadePhase = Math.sin(time * 6 + y * 2.5);
      if (cascadePhase > 0.1) {
        ctx.fillStyle = color(blend(p.water, [235, 248, 255], 0.6), 18);
        pixel(ctx, center - width * 0.35, y, Math.max(1, width * 0.7), 1);
      }
    }

    // Pathway winding along the right bank
    ctx.fillStyle = color(p.path, -24);
    pixel(ctx, path - 1, y, pathWidth + 2);
    ctx.fillStyle = color(p.path, -4);
    pixel(ctx, path, y, pathWidth);
    if (y % 5 === 0) {
      ctx.fillStyle = color(p.path, 9);
      pixel(ctx, path + pathWidth * 0.35, y, Math.max(1, pathWidth * 0.3));
    }

    // Downstream water currents and light interplay
    if (depth > 0.08) {
      // Multi-tier stream currents
      const flow1 = Math.sin(y * 0.28 - time * 2.0);
      const flow2 = Math.cos(y * 0.42 - time * 2.6);
      if (flow1 > 0.25) {
        ctx.fillStyle = color(p.water, 14);
        const streakW = Math.max(1, width * (0.16 + noise(y) * 0.12));
        const streamOffset = Math.sin(y * 0.1 + time * 0.4) * (width * 0.24);
        pixel(ctx, center + streamOffset - streakW / 2, y, streakW, 1);
      }
      if (flow2 > 0.5 && depth > 0.35) {
        ctx.fillStyle = color(p.water, 8);
        const subW = Math.max(1, width * 0.1);
        pixel(ctx, center - width * 0.2 + Math.cos(y * 0.15) * 2, y, subW, 1);
      }

      // Dancing river specular sparkles catching ambient sky and light
      if (depth > 0.2 && y % 3 === 0) {
        const glintTime = time * 2.8 + y * 0.6 + Math.sin(time + y * 0.2) * 2;
        const glintSparkle = Math.sin(glintTime);
        if (glintSparkle > 0.82) {
          const glintOffset = Math.sin(y * 0.22 + time * 0.5) * (width * 0.2);
          const specBase = blend(p.water, p.light, 0.6);
          ctx.fillStyle = color(specBase, 26);
          pixel(ctx, center + glintOffset, y, depth > 0.5 ? 2 : 1, 1);
        }
      }

      // Shoreline gentle lapping wavelets
      if (depth > 0.18) {
        const lap = Math.sin(time * 1.8 + y * 0.25);
        if (lap > 0.65) {
          ctx.fillStyle = color(blend(p.water, [220, 240, 245], 0.35), 8);
          pixel(ctx, center - width / 2, y, 1, 1);
          pixel(ctx, center + width / 2 - 1, y, 1, 1);
        }
      }
    }
  }

  // Natural water ripples expanding across the river surface with inner ring
  for (let rIdx = 0; rIdx < 3; rIdx++) {
    const rippleAge = (time * 0.75 + rIdx * 2.2) % 4.2;
    if (rippleAge < 1.7) {
      const rxSeed = rIdx * 53;
      const ryNorm = 0.25 + noise(rxSeed) * 0.55;
      const ry = top + ryNorm * (h - top);
      const rAt = riverAt(ry, w, h, camera);
      const rX = rAt.center + (noise(rxSeed + 13) * 2 - 1) * (rAt.width * 0.2);
      const rRadius = Math.max(
        0,
        Math.min(
          Math.round(1 + (rippleAge / 1.7) * (2 + rAt.depth * 3.5)),
          Math.floor(rAt.width / 2 - Math.abs(rX - rAt.center) - 1),
        ),
      );
      const rAlpha = (1 - rippleAge / 1.7) * 0.45;
      ctx.globalAlpha = rAlpha;
      ctx.fillStyle = color(p.water, 24);
      pixel(ctx, rX - rRadius, ry, rRadius * 2 + 1, 1);
      // Secondary concentric ring for water depth
      if (rRadius >= 2) {
        ctx.globalAlpha = rAlpha * 0.5;
        pixel(ctx, rX - (rRadius - 1), ry, (rRadius - 1) * 2 + 1, 1);
      }
      ctx.globalAlpha = 1;
    }
  }

  // Cohesive travelling wind waves sweep across the grass field
  for (let i = 0; i < Math.min(850, Math.round((w * h) / 110)); i++) {
    const y = top + noise(i + 910) * (h - top),
      x = noise(i + 501) * w;
    const { depth } = riverAt(y, w, h, camera);
    if (!clearOfRoutes(x, y - 4, y + 3, 4, w, h, camera, 2)) continue;
    const patch =
      Math.sin(x * 0.04 + Math.sin(y * 0.035) * 2) + Math.sin(y * 0.06);
    if (patch < -0.5 && i % 3) continue;

    const baseColor = i % 7 === 0 ? p.light : p.grass;
    ctx.fillStyle = color(baseColor, i % 3 === 0 ? -8 : 0);
    // Rooted base
    pixel(ctx, x, y, 1 + depth * 2);

    // Traveling wind gust wave front across the valley
    const gust =
      Math.sin(time * 1.5 - x * 0.03 + y * 0.018) * 0.7 +
      Math.sin(time * 0.7 - x * 0.015) * 0.3;
    if (i % 4 === 0 && depth > 0.18) {
      if (gust > 0.22) {
        // Bend tip with wind direction and catch light
        ctx.fillStyle = color(p.light, gust > 0.65 ? 12 : 2);
        const lean = gust > 0.7 ? 2 : 1;
        pixel(ctx, x + lean, y - 1, 1, 1 + depth * 2);
        if (depth > 0.6 && gust > 0.5) {
          pixel(ctx, x + lean + 1, y - 2, 1, 1);
        }
      } else {
        // Upright calm blade
        pixel(ctx, x, y - 1, 1, 1 + depth * 2);
      }
    }

    // Lush wildflower colonies blooming across the meadow
    if (i % 47 === 0) {
      const flowerLean = gust > 0.5 ? 1 : 0;
      const flowerKind = i % 4;
      // 0: Bluebells, 1: Poppies, 2: Buttercups, 3: Meadowfoam
      const flowerColors = [
        [130, 159, 182],
        [179, 111, 87],
        [205, 184, 100],
        [204, 218, 185],
      ] as const;
      ctx.fillStyle = color(
        blend(p.grass, [...flowerColors[flowerKind]], 0.55),
      );
      pixel(ctx, x + flowerLean, y - 2, depth > 0.5 ? 2 : 1, 1);
      if (depth > 0.5 && flowerKind === 0) {
        // Taller bell blossom
        pixel(ctx, x + flowerLean, y - 3, 1, 1);
      }
    }
  }

  // Riverbank reeds have rooted stems and sway in unison with the passing breeze
  for (let i = 0; i < 30; i++) {
    const y = top + (h - top) * noise(i + 130),
      r = riverAt(y, w, h, camera),
      side = i % 2 ? 1 : -1;
    const x = r.center + side * (r.width / 2 + 5),
      tall = 2 + r.depth * 5;
    if (!clearOfRoutes(x, y - tall - 2, y + 1, 2, w, h, camera, 1)) continue;
    ctx.fillStyle = color(p.grass, -10);
    pixel(ctx, x, y - tall, 1, tall);
    // Dark reed catkin tip
    ctx.fillStyle = color(p.trunk, -5);
    pixel(ctx, x, y - tall - 1, 1, 1);
    // Reed tip responds naturally to ambient breeze
    const reedWind = Math.sin(time * 1.3 - x * 0.032 + y * 0.02);
    const tipBend = reedWind > 0.4 ? 1 : reedWind < -0.7 ? -1 : 0;
    ctx.fillStyle = color(p.light, -10);
    pixel(ctx, x + tipBend, y - tall, 1, 2);
  }
}
