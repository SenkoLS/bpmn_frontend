import {
  createModeler,
  importXml,
  destroyModeler,
} from "@services/bpmnService";
import { getProcesses, getProcess } from "@api/processes";
import { setState } from "@state/store";

export async function initModelsList() {
  const menuAll = document.getElementById("menu-all");
  if (!menuAll) return;

  menuAll.addEventListener("click", async () => {
    const btnSave = document.getElementById("save-db") as HTMLButtonElement;
    if (btnSave) btnSave.disabled = true; // деактивируем кнопку

    const canvas = document.getElementById("canvas") as HTMLDivElement | null;
    if (!canvas) return;

    try {
      const processes = await getProcesses();

      if (processes.length === 0) {
        canvas.innerHTML =
          '<div style="padding:20px;font-size:16px;">Нет сохранённых моделей</div>';
        return;
      }

      // строим HTML-список
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
      canvas.innerHTML = html;

      // обработчик клика на процесс
      canvas.querySelectorAll("li[data-id]").forEach((li) => {
        li.addEventListener("click", async () => {
          const id = (li as HTMLElement).getAttribute("data-id");
          if (!id) return;

          const process = await getProcess(id);

          setState({ currentProcessId: id });

          if (btnSave) btnSave.disabled = false; // активируем кнопку

          canvas.innerHTML = ""; // очищаем
          createModeler("#canvas");
          await importXml(process.xml);
        });
      });
    } catch (err) {
      console.error("Ошибка загрузки процессов:", err);
      canvas.innerHTML =
        '<div style="padding:20px;color:red;">Ошибка загрузки списка процессов</div>';
    }

    // отключаем редактор
    //destroyModeler();
  });
}
