import { expect, test } from "@playwright/test";

test.describe("Index Page", () => {
  test("should load the ruler grid page", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle("Web Ruler - Digital Measurement Tool");

    // Check that the ruler grid SVG is present
    const gridSvg = page.locator(
      'svg[role="img"][aria-label="Ruler grid overlay"]',
    );
    await expect(gridSvg).toBeVisible();

    // Check that the grid has the "cm" unit label in the SVG
    const svgUnitLabel = gridSvg.getByText("cm");
    await expect(svgUnitLabel).toBeVisible();
  });

  test("should have correct meta description", async ({ page }) => {
    await page.goto("/");

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      "content",
      "Browser-based screen ruler with centimeter, millimeter, and inch grids, display metrics, zoom detection, and a digital level.",
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
    const displayInfoButton = page.getByRole("button", {
      name: "Display Info",
    });
    await expect(displayInfoButton).toBeVisible();
    await expect(displayInfoButton).toBeEnabled();

    // Click the button to open the modal
    await displayInfoButton.click();

    // Check that modal opened with display metrics
    await expect(page.getByText("Display Information")).toBeVisible();
    await expect(page.getByText("Device Pixel Ratio")).toBeVisible();
    await expect(page.getByText("Screen Resolution")).toBeVisible();

    // Close the modal by pressing Escape key (more reliable than clicking X)
    await page.keyboard.press("Escape");

    // Verify modal is closed by checking that Display Information is no longer visible
    await expect(page.getByText("Display Information")).not.toBeVisible();
  });

  test("should have unit selector with default cm unit", async ({ page }) => {
    await page.goto("/");

    // Check that unit selector is visible (using a more specific selector)
    const unitSelector = page
      .locator('[data-testid="unit-selector"] input, .mantine-Select-input')
      .first();
    await expect(unitSelector).toBeVisible();

    // Check that default unit is cm (should show in the ruler SVG)
    const gridSvg = page.locator(
      'svg[role="img"][aria-label="Ruler grid overlay"]',
    );
    const svgUnitLabel = gridSvg.getByText("cm");
    await expect(svgUnitLabel).toBeVisible();
  });

  test("should change units when selecting different options", async ({
    page,
  }) => {
    await page.goto("/");

    // Find and click the unit selector
    const unitSelector = page.locator(".mantine-Select-input").first();
    await unitSelector.click();

    // Select millimeters
    await page.getByText("Millimeters (mm)").click();

    // Check that the ruler now shows mm in the SVG
    const gridSvg = page.locator(
      'svg[role="img"][aria-label="Ruler grid overlay"]',
    );
    await expect(gridSvg.getByText("mm")).toBeVisible();

    // Click selector again to change to inches
    await unitSelector.click();
    await page.getByText("Inches (in)").click();

    // Check that the ruler now shows in
    await expect(gridSvg.getByText("in")).toBeVisible();

    // Change back to centimeters
    await unitSelector.click();
    await page.getByText("Centimeters (cm)").click();

    // Check that the ruler shows cm again
    await expect(gridSvg.getByText("cm")).toBeVisible();
  });

  test("should persist unit selection across page reloads", async ({
    page,
  }) => {
    await page.goto("/");

    // Change to millimeters
    const unitSelector = page.locator(".mantine-Select-input").first();
    await unitSelector.click();
    await page.getByText("Millimeters (mm)").click();

    // Verify mm is selected in the SVG
    const gridSvg = page.locator(
      'svg[role="img"][aria-label="Ruler grid overlay"]',
    );
    await expect(gridSvg.getByText("mm")).toBeVisible();

    // Reload the page
    await page.reload();

    // Check that mm is still selected after reload
    await expect(gridSvg.getByText("mm")).toBeVisible();
  });

  test("should show all three unit options", async ({ page }) => {
    await page.goto("/");

    // Open the unit selector dropdown
    const unitSelector = page.locator(".mantine-Select-input").first();
    await unitSelector.click();

    // Check that all three options are available
    await expect(page.getByText("Centimeters (cm)")).toBeVisible();
    await expect(page.getByText("Millimeters (mm)")).toBeVisible();
    await expect(page.getByText("Inches (in)")).toBeVisible();

    // Close dropdown by pressing Escape
    await page.keyboard.press("Escape");
  });
});
