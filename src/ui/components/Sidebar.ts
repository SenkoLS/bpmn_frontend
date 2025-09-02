import { setState } from "@state/store";
import {
  createModeler,
  createModeler1,
  importXml,
  destroyModeler,
} from "@services/bpmnService";
import { ModelsList } from "@ui/components/ModelsList";
import { getProcesses } from "@api/processes";

import { AppToolbar } from "@ui/components/AppToolbar";

const emptyDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false"/>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"/>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export class Sidebar {
  private element: HTMLElement | null = null;
  private appToolbar: AppToolbar;

  constructor(toolbar: AppToolbar) {
    this.appToolbar = toolbar;
  }

  render(container: HTMLElement) {
    container.insertAdjacentHTML(
      "afterbegin",
      `
      <nav id="sidebar">
        <button id="toggle-menu">☰</button>
        <ul>
          <li id="menu-create"><i>＋</i><span>Создать</span></li>
          <li id="menu-all"><i>📂</i><span>Все модели</span></li>
          <li id="menu-trash"><i>🗑</i><span>Корзина</span></li>
        </ul>
      </nav>
      `
    );

    this.element = document.getElementById("sidebar");
    this.initEvents();
  }

  private initEvents() {
    // сворачивание меню
    document
      .getElementById("toggle-menu")
      ?.addEventListener("click", () =>
        this.element?.classList.toggle("collapsed")
      );

    // "Создать"
    document.getElementById("menu-create")?.addEventListener("click", () => {
      setState({ currentProcessId: null });
      this.loadBpmnEditor(emptyDiagram);
      this.appToolbar.enableSave();
    });

    // "Все модели"
    document.getElementById("menu-all")?.addEventListener("click", async () => {
      const canvas = document.getElementById("canvas") as HTMLDivElement | null;
      if (!canvas) return;

      try {
        const processes = await getProcesses();
        const modelsList = new ModelsList(canvas, this.appToolbar);
        modelsList.render(processes);

        this.appToolbar.disableSave(); // пока ничего не выбрано — сохранять нечего
      } catch (err) {
        console.error("Ошибка загрузки процессов:", err);
        if (canvas) {
          canvas.innerHTML =
            '<div style="padding:20px;color:red;">Ошибка загрузки списка процессов</div>';
        }
      }
    });

    // "Корзина"
    document.getElementById("menu-trash")?.addEventListener("click", () => {
      const canvas = document.getElementById("canvas") as HTMLDivElement | null;
      if (canvas) {
        canvas.innerHTML =
          '<div style="padding:20px;font-size:16px;">Здесь корзина 🗑</div>';
      }
      destroyModeler();
      this.appToolbar.disableSave(); // 👈 выключаем кнопку
    });
  }

  private loadBpmnEditor(xml: string): void {
    const canvas = document.getElementById("canvas") as HTMLDivElement | null;
    if (!canvas) return;
    destroyModeler();
    createModeler("#canvas", "#properties");
    importXml(xml).catch((err) => {
      console.error("Ошибка при загрузке:", err);
    });
  }
}
