import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should display hero section", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Build Your SaaS Faster/i })
    ).toBeVisible();
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: /Login/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Get Started/i })).toBeVisible();
  });

  test("should display features section", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/Everything You Need/i)).toBeVisible();
  });
});

test.describe("Authentication", () => {
  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Login/i }).click();

    await expect(page).toHaveURL("/login");
    await expect(
      page.getByRole("heading", { name: /Welcome back/i })
    ).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: /Sign up/i }).click();

    await expect(page).toHaveURL("/register");
    await expect(
      page.getByRole("heading", { name: /Create an account/i })
    ).toBeVisible();
  });

  test("should show validation errors", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /Sign in/i }).click();

    await expect(page.getByText(/Invalid credentials/i)).not.toBeVisible();
  });
});

test.describe("Dashboard", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login/);
  });
});
