// --- стили bpmn-js ---
import "bpmn-js/dist/assets/diagram-js.css"; // базовые стили
import "bpmn-js/dist/assets/bpmn-js.css"; // стили bpmn
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css"; // иконки
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// --- компоненты UI ---
import { SaveProcessModal } from "@app/ui/components/SaveProcessModal";
import { Sidebar } from "@app/ui/components/Sidebar";

// --- сервисы ---
import { initModelsList } from "@ui/modelsList";
import { saveXml, saveSvg } from "@services/bpmnService";

// кнопка "Сохранить" по умолчанию выключена
const btnSave = document.getElementById("save-db") as HTMLButtonElement;
if (btnSave) btnSave.disabled = true;

// --- функции экспорта ---
async function saveAsXML(): Promise<void> {
  try {
    const xml = await saveXml();
    downloadFile(xml, "diagram.bpmn", "application/xml");
  } catch (err) {
    console.error("Ошибка экспорта XML:", err);
  }
}

async function saveAsSVG(): Promise<void> {
  try {
    const svg = await saveSvg();
    downloadFile(svg, "diagram.svg", "image/svg+xml");
  } catch (err) {
    console.error("Ошибка экспорта SVG:", err);
  }
}

// --- утилита для скачивания файла ---
function downloadFile(data: string, filename: string, type: string): void {
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

// при старте – пустой экран
const startCanvas = document.getElementById("canvas") as HTMLDivElement | null;
if (startCanvas) {
  startCanvas.innerHTML =
    '<div style="padding:20px;font-size:16px;">Выберите пункт меню слева</div>';
}

// --- инициализация UI ---
initModelsList();

const sidebar = new Sidebar();
sidebar.render(document.querySelector("main")!);

const saveModal = new SaveProcessModal();
saveModal.render(document.body);

// --- кнопки сохранения --- //
document.getElementById("save-xml")?.addEventListener("click", saveAsXML);
document.getElementById("save-svg")?.addEventListener("click", saveAsSVG);
document.getElementById("save-db")?.addEventListener("click", () => {
  saveModal.show();
});
