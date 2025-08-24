import { getState, setState } from "@state/store";
import { getProcess, createProcess, updateProcess } from "@api/processes";
import { saveXml } from "@services/bpmnService";

export class SaveProcessModal {
  private modal: HTMLElement | null = null;
  private nameInput: HTMLInputElement | null = null;
  private descInput: HTMLTextAreaElement | null = null;
  private btnClose: HTMLElement | null = null;
  private btnConfirm: HTMLButtonElement | null = null;

  render(container: HTMLElement) {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div id="save-process-modal" class="modal">
        <div class="modal-content">
          <span id="modal-close">&times;</span>
          <h3>Сохранение процесса</h3>
          <label>Название</label>
          <input id="process-name" type="text" value="Новый процесс" />
          <label>Описание</label>
          <textarea id="process-desc"></textarea>
          <button id="save-confirm">Сохранить</button>
        </div>
      </div>
      `
    );

    this.modal = document.getElementById("save-process-modal");
    this.nameInput = document.getElementById(
      "process-name"
    ) as HTMLInputElement;
    this.descInput = document.getElementById(
      "process-desc"
    ) as HTMLTextAreaElement;
    this.btnClose = document.getElementById("modal-close");
    this.btnConfirm = document.getElementById(
      "save-confirm"
    ) as HTMLButtonElement;

    this.initEvents();
  }

  private initEvents() {
    this.btnClose?.addEventListener("click", () => this.hide());
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) this.hide();
    });

    this.btnConfirm?.addEventListener("click", async () => {
      if (!this.nameInput || !this.descInput) return;

      const currentProcessId = getState().currentProcessId;
      let xml: string;
      try {
        xml = await saveXml();
      } catch (e) {
        console.error("Ошибка экспорта XML:", e);
        return;
      }

      if (currentProcessId) {
        // обновляем существующий процесс
        await updateProcess(currentProcessId, {
          name: this.nameInput.value,
          description: this.descInput.value,
          xml,
        });
      } else {
        // создаем новый процесс
        const created = await createProcess({
          name: this.nameInput.value,
          description: this.descInput.value,
          xml,
        });
        setState({ currentProcessId: created.id });
        console.log("Создан новый процесс:", created);
      }

      this.hide();
    });
  }

  async show() {
    const currentProcessId = getState().currentProcessId;

    if (currentProcessId) {
      try {
        const process = await getProcess(currentProcessId);
        if (this.nameInput) this.nameInput.value = process.name || "";
        if (this.descInput) this.descInput.value = process.description || "";
      } catch (e) {
        console.error("Ошибка загрузки процесса:", e);
      }
    } else {
      if (this.nameInput) this.nameInput.value = "Новый процесс";
      if (this.descInput) this.descInput.value = "";
    }

    if (this.modal) this.modal.style.display = "block";
  }

  hide() {
    if (this.modal) this.modal.style.display = "none";
  }
}
