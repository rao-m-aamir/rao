export type RGB = [number, number, number];
export type Palette = {
  sky: RGB;
  haze: RGB;
  far: RGB;
  mountain: RGB;
  hill: RGB;
  ground: RGB;
  grass: RGB;
  light: RGB;
  water: RGB;
  path: RGB;
  trunk: RGB;
  leaf: RGB;
  leafLight: RGB;
};
const stops: { at: number; palette: Palette }[] = [
  {
    at: 0,
    palette: {
      sky: [95, 155, 170],
      haze: [205, 218, 167],
      far: [114, 163, 155],
      mountain: [78, 127, 121],
      hill: [69, 120, 87],
      ground: [58, 97, 64],
      grass: [95, 133, 71],
      light: [165, 178, 94],
      water: [118, 177, 167],
      path: [186, 163, 115],
      trunk: [68, 64, 48],
      leaf: [49, 89, 57],
      leafLight: [104, 139, 70],
    },
  },
  {
    at: 0.25,
    palette: {
      sky: [135, 175, 185],
      haze: [235, 235, 180],
      far: [145, 175, 165],
      mountain: [115, 155, 145],
      hill: [105, 140, 115],
      ground: [95, 125, 95],
      grass: [125, 155, 105],
      light: [195, 205, 135],
      water: [155, 195, 185],
      path: [210, 195, 155],
      trunk: [85, 80, 65],
      leaf: [75, 105, 85],
      leafLight: [135, 165, 115],
    },
  },
  {
    at: 0.38,
    palette: {
      sky: [185, 165, 145],
      haze: [245, 215, 175],
      far: [195, 180, 165],
      mountain: [165, 150, 135],
      hill: [155, 140, 125],
      ground: [145, 130, 115],
      grass: [175, 160, 145],
      light: [235, 220, 185],
      water: [195, 205, 195],
      path: [225, 210, 175],
      trunk: [105, 95, 85],
      leaf: [135, 155, 145],
      leafLight: [195, 210, 185],
    },
  },
  {
    at: 0.55,
    palette: {
      sky: [145, 130, 160],
      haze: [235, 195, 155],
      far: [155, 150, 165],
      mountain: [135, 145, 155],
      hill: [125, 135, 140],
      ground: [115, 125, 130],
      grass: [145, 155, 145],
      light: [200, 175, 140],
      water: [175, 185, 175],
      path: [185, 175, 150],
      trunk: [95, 85, 80],
      leaf: [95, 125, 115],
      leafLight: [155, 170, 145],
    },
  },
  {
    at: 0.68,
    palette: {
      sky: [128, 115, 150],
      haze: [228, 175, 128],
      far: [129, 131, 151],
      mountain: [86, 104, 125],
      hill: [66, 89, 94],
      ground: [51, 74, 74],
      grass: [79, 93, 77],
      light: [168, 135, 90],
      water: [145, 152, 153],
      path: [155, 133, 106],
      trunk: [57, 51, 48],
      leaf: [44, 68, 68],
      leafLight: [99, 108, 81],
    },
  },
  {
    at: 0.82,
    palette: {
      sky: [45, 55, 85],
      haze: [95, 105, 120],
      far: [65, 80, 100],
      mountain: [55, 70, 90],
      hill: [45, 65, 75],
      ground: [40, 55, 65],
      grass: [55, 75, 70],
      light: [110, 125, 90],
      water: [75, 105, 115],
      path: [95, 90, 80],
      trunk: [45, 45, 45],
      leaf: [35, 55, 60],
      leafLight: [65, 85, 75],
    },
  },
  {
    at: 1,
    palette: {
      sky: [20, 35, 60],
      haze: [55, 75, 95],
      far: [40, 65, 85],
      mountain: [30, 55, 75],
      hill: [25, 50, 60],
      ground: [22, 42, 45],
      grass: [38, 62, 55],
      light: [95, 115, 80],
      water: [55, 95, 110],
      path: [80, 80, 70],
      trunk: [35, 35, 35],
      leaf: [25, 50, 45],
      leafLight: [50, 75, 60],
    },
  },
];
export function journeyProgress(
  scroll: number,
  height: number,
  viewport: number,
) {
  return height <= viewport
    ? 0
    : Math.max(0, Math.min(1, scroll / (height - viewport)));
}
export function worldPalette(progress: number): Palette {
  const p = Math.max(0, Math.min(1, progress));
  const end = stops.findIndex((s) => s.at >= p);
  if (end <= 0) return stops[0].palette;
  const a = stops[end - 1],
    b = stops[end];
  const t = (p - a.at) / (b.at - a.at);
  return Object.fromEntries(
    Object.keys(a.palette).map((key) => {
      const k = key as keyof Palette;
      return [
        k,
        a.palette[k].map((v, i) => Math.round(v + (b.palette[k][i] - v) * t)),
      ];
    }),
  ) as Palette;
}
export function terrainPath(y: number, width: number) {
  return (
    width * (0.5 + Math.sin(y * 0.008) * 0.16 + Math.sin(y * 0.0031) * 0.035)
  );
}
export function noise(seed: number) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}
export function color(rgb: RGB, offset = 0) {
  return `rgb(${rgb.map((v) => Math.max(0, Math.min(255, v + offset))).join(",")})`;
}
