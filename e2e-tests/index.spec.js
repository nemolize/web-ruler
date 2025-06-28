import { expect, test } from "@playwright/test";

test.describe("Index Page", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle("Next.js with Mantine");

    // Check main heading
    await expect(
      page.getByRole("heading", {
        name: "Welcome to Next.js with Mantine!",
        level: 1,
      }),
    ).toBeVisible();

    // Check welcome text
    await expect(
      page.getByText(
        "Mantine has been successfully set up in your Next.js project.",
      ),
    ).toBeVisible();
  });

  test("should have correct meta description", async ({ page }) => {
    await page.goto("/");

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      "content",
      "Next.js app with Mantine UI",
    );
  });

  test("should have favicon", async ({ page }) => {
    await page.goto("/");

    // Check favicon link
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute("href", "/favicon.ico");
  });

  test("should have interactive buttons", async ({ page }) => {
    await page.goto("/");

    // Check that both buttons are visible
    await expect(
      page.getByRole("button", { name: "Primary Button" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Outline Button" }),
    ).toBeVisible();

    // Verify buttons are clickable
    const primaryButton = page.getByRole("button", { name: "Primary Button" });
    const outlineButton = page.getByRole("button", { name: "Outline Button" });

    await expect(primaryButton).toBeEnabled();
    await expect(outlineButton).toBeEnabled();
  });
});
