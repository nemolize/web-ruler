import { expect, test } from "@playwright/test";

test.describe("Index Page", () => {
  test("should load the ruler grid page", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle("Next.js with Mantine");

    // Check that the ruler grid SVG is present
    const gridSvg = page.locator('svg[role="img"][aria-label="Ruler grid overlay"]');
    await expect(gridSvg).toBeVisible();

    // Check that the grid has the "cm" unit label
    await expect(page.getByText("cm")).toBeVisible();
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

  test("should have display info button and modal", async ({ page }) => {
    await page.goto("/");

    // Check that Display Info button is visible
    const displayInfoButton = page.getByRole("button", { name: "Display Info" });
    await expect(displayInfoButton).toBeVisible();
    await expect(displayInfoButton).toBeEnabled();

    // Click the button to open the modal
    await displayInfoButton.click();

    // Check that modal opened with display metrics
    await expect(page.getByText("Display Information")).toBeVisible();
    await expect(page.getByText("Device Pixel Ratio")).toBeVisible();
    await expect(page.getByText("Screen Resolution")).toBeVisible();

    // Close the modal by pressing Escape key (more reliable than clicking X)
    await page.keyboard.press('Escape');
    
    // Verify modal is closed by checking that Display Information is no longer visible
    await expect(page.getByText("Display Information")).not.toBeVisible();
  });
});