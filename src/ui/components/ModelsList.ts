import { getProcess } from "@api/processes";
import { setState } from "@state/store";
import { createModeler, importXml } from "@services/bpmnService";
import { AppToolbar } from "@ui/components/AppToolbar";

export class ModelsList {
  private container: HTMLElement;
  private appToolbar: AppToolbar;

  constructor(container: HTMLElement, appToolbar: AppToolbar) {
    this.container = container;
    this.appToolbar = appToolbar;
  }

  render(
    processes: Array<{
      id: string;
      name: string;
      description?: string;
      xml?: string;
    }>
  ) {
    if (processes.length === 0) {
      this.container.innerHTML =
        '<div style="padding:20px;font-size:16px;">Нет сохранённых моделей</div>';
      return;
    }

    let html = `<div style="padding:20px;font-size:16px;">
                  <h3>Список бизнес-процессов</h3>
                  <ul style="list-style:none;padding:0;">`;

    for (const p of processes) {
      html += `<li data-id="${p.id}" 
                   style="margin:8px 0;padding:8px;border:1px solid #ccc;
                          border-radius:6px;background:#fff;cursor:pointer;">
                 <b>${p.name}</b><br/>
                 ${p.description ? `<i>${p.description}</i><br/>` : ""}
                 <code style="font-size:12px;color:#888;">id: ${p.id}</code>
               </li>`;
    }

    html += `</ul></div>`;
    this.container.innerHTML = html;

    this.attachHandlers();
  }

  private attachHandlers() {
    this.container.querySelectorAll("li[data-id]").forEach((li) => {
      li.addEventListener("click", async () => {
        const id = (li as HTMLElement).getAttribute("data-id");
        if (!id) return;

        const process = await getProcess(id);

        setState({ currentProcessId: id });

        this.container.innerHTML = ""; // очищаем
        createModeler("#canvas");
        await importXml(process.xml);

        this.appToolbar.enableSave();
      });
    });
  }
}
