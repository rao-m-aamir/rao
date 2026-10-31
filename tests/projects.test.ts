import test from "node:test";
import assert from "node:assert/strict";
import { getProject, projectParams } from "../lib/projects.ts";
test("unknown project URLs do not silently display another project", () =>
  assert.equal(getProject("missing"), undefined));
test("a new content record generates a route without a UI change", () => {
  const records = [{ slug: "first" }, { slug: "another-quest" }];
  assert.deepEqual(projectParams(records), [
    { slug: "first" },
    { slug: "another-quest" },
  ]);
});
test("known project resolves with its own case study", () =>
  assert.equal(getProject("ustad-e-karigar")?.title, "Ustad-e-Karigar"));
