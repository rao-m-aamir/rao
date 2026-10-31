import test from "node:test";
import assert from "node:assert/strict";
import {
  journeyProgress,
  worldPalette,
  terrainPath,
} from "../components/world/world-model.ts";
test("short pages and overscroll keep world progress bounded", () => {
  assert.equal(journeyProgress(100, 500, 800), 0);
  assert.equal(journeyProgress(-40, 2000, 800), 0);
  assert.equal(journeyProgress(1800, 2000, 800), 1);
});
test("journey lighting changes continuously and reaches night", () => {
  const day = worldPalette(0),
    night = worldPalette(1);
  assert.notDeepEqual(day.sky, night.sky);
  assert.ok(
    night.sky.reduce((a, b) => a + b, 0) < day.sky.reduce((a, b) => a + b, 0),
  );
  const before = worldPalette(0.4999),
    after = worldPalette(0.5001);
  assert.ok(before.sky.every((c, i) => Math.abs(c - after.sky[i]) < 2));
});
test("the path remains inside narrow and wide worlds", () => {
  for (const width of [107, 480])
    for (let y = 0; y < 3000; y += 37) {
      const x = terrainPath(y, width);
      assert.ok(x > width * 0.2 && x < width * 0.8);
    }
});
