import { test, expect } from "@playwright/test";
test("one full-viewport world replaces all illustration and mascot images", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("canvas[data-world]")).toHaveCount(1);
  await expect(page.locator("main img")).toHaveCount(0);
  const canvas = page.locator("canvas[data-world]");
  const box = await canvas.boundingBox();
  expect(box?.width).toBeGreaterThan(1000);
  expect(await canvas.evaluate((e) => getComputedStyle(e).position)).toBe(
    "fixed",
  );
});
test("scrolling advances the world and paused motion stops its clock", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const canvas = page.locator("canvas[data-world]");
  await expect(canvas).toHaveAttribute("data-progress", "0.000");
  await page.locator("#campfire").scrollIntoViewIfNeeded();
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-progress")))
    .toBeGreaterThan(0.85);
  await page.getByRole("button", { name: "Pause animation" }).click();
  await expect(canvas).toHaveAttribute("data-animated", "false");
  const snapshot = await canvas.evaluate((e) =>
    (e as HTMLCanvasElement).toDataURL(),
  );
  await page.waitForTimeout(150);
  expect(
    await canvas.evaluate((e) => (e as HTMLCanvasElement).toDataURL()),
  ).toEqual(snapshot);
});

test("ambient pixels animate by default and can be paused and resumed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const canvas = page.locator("canvas[data-world]");
  await expect(canvas).toHaveAttribute("data-animated", "true");
  await page.getByRole("button", { name: "Pause animation" }).click();
  await expect(canvas).toHaveAttribute("data-animated", "false");
  await page.getByRole("button", { name: "Resume animation" }).click();
  await expect(canvas).toHaveAttribute("data-animated", "true");
});
