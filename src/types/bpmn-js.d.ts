declare module "bpmn-js/lib/Modeler" {
  export default class BpmnModeler {
    constructor(options?: any);
    importXML(xml: string, done?: any): Promise<any>;
    saveXML(options?: any): Promise<{ xml?: string }>;
    saveSVG(): Promise<{ svg?: string }>;
    get(service: string): any;
  }
}

declare module "diagram-js/lib/model" {
  const model: any;
  export default model;
}

declare module "diagram-js/lib/model" {
  export default any;
  export interface Connection {}
  export interface Element {}
  export interface Label {}
  export interface Root {}
  export interface Shape {}
}
