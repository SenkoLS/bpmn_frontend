import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: "http://localhost:8080", // теперь можно писать page.goto("/")
    headless: true, // браузер без UI
    screenshot: "only-on-failure", // скрин при падении
    video: "retain-on-failure", // запись видео при падении
  },
});
