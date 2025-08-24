import BpmnModeler from "bpmn-js/lib/Modeler";

let modeler: BpmnModeler | null = null;

export function createModeler(container: string): BpmnModeler {
  modeler = new BpmnModeler({ container });
  return modeler;
}

export function getModeler(): BpmnModeler | null {
  return modeler;
}

export async function importXml(xml: string): Promise<void> {
  if (!modeler) throw new Error("Modeler не инициализирован");
  await modeler.importXML(xml);
  (modeler as any).get("canvas").zoom("fit-viewport");
}

export async function saveXml(): Promise<string> {
  if (!modeler) throw new Error("Modeler не инициализирован");
  const { xml } = await modeler.saveXML({ format: true });
  if (!xml) throw new Error("Ошибка экспорта XML");
  return xml;
}

export async function saveSvg(): Promise<string> {
  if (!modeler) throw new Error("Modeler не инициализирован");
  const { svg } = await modeler.saveSVG();
  if (!svg) throw new Error("Ошибка экспорта SVG");
  return svg;
}

export function destroyModeler(): void {
  modeler = null;
}
