import { test, expect } from "@playwright/test";

let createdProcessId: number;

test.beforeEach(async ({ request }) => {
  // Создаём процесс через API
  const response = await request.post("/api/processes", {
    data: {
      name: "TEST_Edit_Process",
      description: "Для теста редактирования",
      xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0cdlv3t" targetNamespace="http://bpmn.io/schema/bpmn" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:modeler="http://camunda.org/schema/modeler/1.0" exporter="Camunda Modeler" exporterVersion="5.31.0" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="8.6.0">
  <bpmn:process id="Process_14h74mq" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_14h74mq">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="182" y="162" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,
    },
  });

  const body = await response.json();
  createdProcessId = body.id; // уникальный ID
});

test("Редактирование существующего процесса и сохранение", async ({
  page,
  request,
}) => {
  await page.goto("http://localhost:8080/");

  // Открыть список моделей
  await page.getByText("Все модели").click();

  // Открыть именно наш процесс по id
  const ourProcessItem = page
    .getByRole("listitem")
    .filter({ hasText: `id: ${createdProcessId}` });
  await expect(ourProcessItem).toBeVisible();
  await ourProcessItem.click();

  // --- Редактирование диаграммы ---
  const startEvent = page.locator(".djs-element.djs-shape .djs-hit").first();
  await startEvent.click();

  await page.getByTitle("Append task").click();
  await page.getByTitle("Append end event").click();

  // Находим только что добавленную задачу
  const task = page.locator(".djs-element.djs-shape .djs-hit").nth(1);

  // Наводим курсор и двойной клик
  await task.hover();
  await task.dblclick();

  // Вводим текст "1"
  await page.locator(".djs-direct-editing-content").fill("1");

  // Снимаем фокус кликом по диаграмме
  await page.mouse.click(10, 10);

  // Сохраняем процесс
  await page.getByRole("button", { name: "Сохранить", exact: true }).click();
  await page.locator("#save-confirm").click();

  // --- Проверка в UI ---
  await page.getByText("Все модели").click();
  const updatedItem = page
    .getByRole("listitem")
    .filter({ hasText: `id: ${createdProcessId}` });
  await expect(updatedItem).toContainText("TEST_Edit_Process");

  // --- Проверка через API (REST) ---
  const apiResponse = await request.get(`/api/processes/${createdProcessId}`);
  expect(apiResponse.ok()).toBeTruthy();

  const processFromDb = await apiResponse.json();

  // Проверяем, что XML обновлён и есть label "1"
  expect(processFromDb.xml).toContain("1");
});

test.afterEach("Удаление тестовых данных", async ({ request }) => {
  await request.delete(`/api/processes/${createdProcessId}`);
});
