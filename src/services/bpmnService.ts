import BpmnModeler from "bpmn-js/lib/Modeler";
import { getState, setState } from "@state/store";

// --- подключаем панель свойств ---
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from "bpmn-js-properties-panel";

//let modeler: BpmnModeler | null = null;

export function createModeler1(container: string): BpmnModeler {
  let modeler: BpmnModeler | null = null;
  modeler = new BpmnModeler({ container });
  return modeler;
}

export function createModeler(
  container: string,
  propertiesContainer: string
): BpmnModeler {
  const { modeler } = getState();
  if (modeler) return modeler;

  const newModeler = new BpmnModeler({
    container,
    propertiesPanel: {
      parent: propertiesContainer,
    },
    additionalModules: [
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
    ],
  });

  setState({ modeler: newModeler });
  return newModeler;
}

export function getModeler(): BpmnModeler | null {
  return getState().modeler;
}

export function onElementClick(callback: (element: any) => void) {
  const modeler = getModeler();
  if (modeler) return;
  const eventBus = (modeler as any).get("eventBus");
  eventBus.on("element.click", (e: any) => {
    callback(e.element);
  });
}

export async function importXml(xml: string): Promise<void> {
  const modeler = getModeler();
  if (!modeler) throw new Error("Modeler не инициализирован");
  await modeler.importXML(xml);
  (modeler as any).get("canvas").zoom("fit-viewport");
}

export async function saveXml(): Promise<string> {
  const modeler = getModeler();
  if (!modeler) throw new Error("Modeler не инициализирован");
  const { xml } = await modeler.saveXML({ format: true });
  if (!xml) throw new Error("Ошибка экспорта XML");
  return xml;
}

export async function saveSvg(): Promise<string> {
  const modeler = getModeler();
  if (!modeler) throw new Error("Modeler не инициализирован");
  const { svg } = await modeler.saveSVG();
  if (!svg) throw new Error("Ошибка экспорта SVG");
  return svg;
}

export function destroyModeler(): void {
  const modeler = getModeler();
  if (modeler) {
    (modeler as any).destroy(); // важный вызов: снимает все слушатели, чистит DOM
  }
  const container = document.querySelector("#canvas");
  if (container) container.innerHTML = "";
  setState({ modeler: null });
}
