import { SaveProcessModal } from "@ui/components/SaveProcessModal";
import { saveXml, saveSvg } from "@services/bpmnService";

export class AppToolbar {
  private element: HTMLElement | null = null;
  private saveModal: SaveProcessModal;
  private btnSave: HTMLButtonElement | null = null;

  constructor(saveModal: SaveProcessModal) {
    this.saveModal = saveModal;
  }

  render(container: HTMLElement) {
    container.insertAdjacentHTML(
      "afterbegin",
      `
      <div id="buttons">
        <button id="save-xml">Сохранить как XML</button>
        <button id="save-svg">Сохранить как SVG</button>
        <button id="save-db">Сохранить</button>
      </div>
      `
    );

    this.element = document.getElementById("buttons");
    this.btnSave = document.getElementById("save-db") as HTMLButtonElement;

    // кнопка "Сохранить" по умолчанию выключена
    if (this.btnSave) this.btnSave.disabled = true;

    this.initEvents();
  }

  /** Включить кнопку "Сохранить" */
  enableSave() {
    if (this.btnSave) this.btnSave.disabled = false;
  }

  /** Выключить кнопку "Сохранить" */
  disableSave() {
    if (this.btnSave) this.btnSave.disabled = true;
  }

  private initEvents() {
    document.getElementById("save-xml")?.addEventListener("click", async () => {
      try {
        const xml = await saveXml();
        this.downloadFile(xml, "diagram.bpmn", "application/xml");
      } catch (err) {
        console.error("Ошибка экспорта XML:", err);
      }
    });

    document.getElementById("save-svg")?.addEventListener("click", async () => {
      try {
        const svg = await saveSvg();
        this.downloadFile(svg, "diagram.svg", "image/svg+xml");
      } catch (err) {
        console.error("Ошибка экспорта SVG:", err);
      }
    });

    document.getElementById("save-db")?.addEventListener("click", () => {
      this.saveModal.show();
    });
  }

  private downloadFile(data: string, filename: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }
}
