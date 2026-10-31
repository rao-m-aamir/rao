import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("map supports destinations, Escape, and returning focus", async ({
  page,
}) => {
  await page.goto("/rao/");
  const open = page.getByRole("button", { name: "Open world map" });
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole("link", { name: /Quest Board/ }).click();
  await expect(page).toHaveURL(/#quests$/);
  await expect(dialog).not.toBeVisible();
});
test("motion starts by default and pause preference persists", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/rao/");
  await expect(
    page.getByRole("button", { name: "Pause animation" }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(
    page.getByRole("button", { name: "Pause animation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause animation" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume animation" }),
  ).toBeVisible();
});
test("project navigation and direct URLs work", async ({ page }) => {
  await page.goto("/rao/");
  await page.getByRole("link", { name: "Explore Ustad-e-Karigar" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ustad-e-Karigar",
  );
  await page.goto("/rao/quests/meadow-and-wood");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Meadow & Wood",
  );
  const response = await page.goto("/rao/quests/missing-quest");
  expect(response?.status()).toBe(404);
});
test("content and links remain useful without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/rao/");
  await expect(
    page.getByRole("heading", { name: "The quest board." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore Meadow & Wood" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Meadow & Wood",
  );
  await context.close();
});
test("homepage and map have no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/rao/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Open world map" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
for (const width of [320, 768, 1024, 1440])
  test(`layout stays inside ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/rao/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
