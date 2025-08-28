import { test, expect } from "@playwright/test";

let createdProcessId: string;

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/processes", {
    data: {
      name: "TEST_List_Process",
      description: "Для теста списка",
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
  createdProcessId = body.id.id;
});

test("Получение списка процессов во фронте", async ({ page }) => {
  await page.goto("http://localhost:8080");

  await page.click("#menu-all");

  const processItem = page
    .getByRole("listitem")
    .filter({ hasText: `id: ${createdProcessId}` });

  await expect(processItem).toBeVisible({ timeout: 10000 });
  await expect(processItem).toContainText("TEST_List_Process");
});

test.afterEach("Удаление тестовых данных", async ({ request }) => {
  await request.delete(`/api/processes/${createdProcessId}`);
});
