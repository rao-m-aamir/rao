import test from "node:test";
import assert from "node:assert/strict";
import {
  landscapeLayout,
  clearOfRoutes,
  riverAt,
} from "../components/world/landscape-layout.ts";
test("all scenery silhouettes keep clear of river and trail throughout the journey", () => {
  for (const [w, h] of [
    [107, 300],
    [130, 282],
    [256, 192],
    [360, 225],
    [480, 270],
    [200, 350],
  ]) {
    const scene = landscapeLayout(w, h);
    assert.ok(scene.some((s) => s.kind === "tree"));
    assert.ok(scene.some((s) => s.kind === "rock"));
    for (let camera = 0; camera <= 700; camera += 7) {
      for (const s of scene)
        assert.ok(
          clearOfRoutes(s.x, s.top, s.bottom, s.halfWidth, w, h, camera),
          `${s.kind} crosses route at ${w}x${h}, camera ${camera}`,
        );
    }
    assert.deepEqual(scene, landscapeLayout(w, h));
    assert.ok(scene.every((s, i) => i === 0 || scene[i - 1].y <= s.y));
  }
});
test("river and trail remain separated and inside the viewport", () => {
  for (const w of [107, 130, 256, 480])
    for (let c = 0; c <= 700; c += 13)
      for (let y = 114; y <= 225; y += 3) {
        const r = riverAt(y, w, 225, c);
        assert.ok(r.center - r.width / 2 > 0);
        assert.ok(r.path > r.center + r.width / 2 + 3);
        assert.ok(r.path + r.pathWidth < w);
      }
});
