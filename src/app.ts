// --- стили bpmn-js ---
import "bpmn-js/dist/assets/diagram-js.css"; // базовые стили
import "bpmn-js/dist/assets/bpmn-js.css"; // стили bpmn
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css"; // иконки
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// --- компоненты UI ---
import { SaveProcessModal } from "@ui/components/SaveProcessModal";
import { Sidebar } from "@ui/components/Sidebar";
import { AppToolbar } from "@ui/components/AppToolbar";
import { Header } from "@ui/components/header";
import { Footer } from "@ui/components/Footer";
import { Canvas } from "@ui/components/Canvas";
//Убираем кастомную панель - идем в сторону стандартной
//import { PropertiesPanel } from "@ui/components/PropertiesPanel";

import keycloak from "@app/keycloak";
import { config } from "@app/config";

// Определяем интерфейс для токена
interface KeycloakTokenParsed {
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles: string[] };
}

function startApp() {
  const header = new Header();
  header.render(document.getElementById("app")!);

  const saveModal = new SaveProcessModal();
  saveModal.render(document.body);

  const toolbar = new AppToolbar(saveModal);
  toolbar.render(document.getElementById("content")!);

  const sidebar = new Sidebar(toolbar);
  sidebar.render(document.querySelector("main")!);

  const canvas = new Canvas();
  canvas.render(document.getElementById("content")!);

  //Стандартная панель должна отрисовать панель свойств для диаграммы, кастомную заглушим
  //const properties = new PropertiesPanel();
  //properties.render(document.getElementById("properties")!);

  const footer = new Footer();
  footer.render(document.getElementById("app")!);
}

async function initKeycloak() {
  try {
    const authenticated = await keycloak.init({
      onLoad: "login-required",
    });

    if (authenticated) {
      const user = keycloak.tokenParsed as KeycloakTokenParsed;
      console.log("✅ Authenticated as", user?.preferred_username || "unknown");
      startApp();
    } else {
      console.warn("❌ Not authenticated!");
      keycloak.login();
    }
  } catch (err) {
    console.error("Keycloak init error", err);
  }
}

initKeycloak();

//startApp();
