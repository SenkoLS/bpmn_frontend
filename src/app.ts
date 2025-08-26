// --- стили bpmn-js ---
import "bpmn-js/dist/assets/diagram-js.css"; // базовые стили
import "bpmn-js/dist/assets/bpmn-js.css"; // стили bpmn
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css"; // иконки
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// --- компоненты UI ---
import { SaveProcessModal } from "@app/ui/components/SaveProcessModal";
import { Sidebar } from "@app/ui/components/Sidebar";
import { Toolbar } from "@ui/components/Toolbar";
import { Header } from "@ui/components/header";
import { Footer } from "@ui/components/Footer";
import { Canvas } from "@ui/components/Canvas";

// --- сервисы ---
import { initModelsList } from "@ui/modelsList";

// --- инициализация UI ---
initModelsList();

const header = new Header();
header.render(document.getElementById("app")!);

const saveModal = new SaveProcessModal();
saveModal.render(document.body);

const toolbar = new Toolbar(saveModal);
toolbar.render(document.getElementById("content")!);

const sidebar = new Sidebar(toolbar);
sidebar.render(document.querySelector("main")!);

const canvas = new Canvas();
canvas.render(document.getElementById("content")!);

const footer = new Footer();
footer.render(document.getElementById("app")!);
