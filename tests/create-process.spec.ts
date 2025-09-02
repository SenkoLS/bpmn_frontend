import { test, expect } from "@playwright/test";

let createdProcessId: number;

test("Создание нового процесса и сохранение в БД", async ({
  page,
  request,
}) => {
  await page.goto("http://localhost:8080/");

  // --- Создание процесса в UI ---
  await page.getByText("＋Создать").click();
  await page.getByTitle("Create start event").click();
  await page.getByRole("img").first().click();
  await page.getByTitle("Append task").click();
  await page.getByTitle("Append end event").click();

  // Явно ждём появления задачи
  const task = page.locator(".djs-element.djs-shape .djs-hit").nth(1);
  await expect(task).toBeVisible({ timeout: 5000 });

  // Двойной клик по задаче → вводим текст
  await task.click();
  await task.dblclick();
  await page.locator(".djs-direct-editing-content").fill("2");
  await page.mouse.click(10, 10); // снять фокус

  // --- Сохраняем процесс ---
  const responsePromise = page.waitForResponse("**/api/processes");

  await page.getByRole("button", { name: "Сохранить", exact: true }).click();
  await page.locator("#process-name").fill("TEST_Create_Process");
  await page.locator("#process-desc").fill("Описание TEST_Create_Process");
  await page.locator("#save-confirm").click();

  // --- Получаем id созданного процесса ---
  const response = await responsePromise;
  const body = await response.json();
  createdProcessId = body.id;

  // --- Проверка в UI ---
  await page.getByText("Все модели").click();
  const createdItem = page
    .getByRole("listitem")
    .filter({ hasText: `id: ${createdProcessId}` });
  await expect(createdItem).toContainText("TEST_Create_Process");

  // --- Проверка через API ---
  const apiResponse = await request.get(`/api/processes/${createdProcessId}`);
  expect(apiResponse.ok()).toBeTruthy();

  const processFromDb = await apiResponse.json();
  expect(processFromDb.id).toBe(createdProcessId);
  expect(processFromDb.name).toBe("TEST_Create_Process");
});

test.afterEach(async ({ request }) => {
  if (createdProcessId) {
    await request.delete(`/api/processes/${createdProcessId}`);
  }
});
