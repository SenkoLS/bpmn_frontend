import keycloak from "@app/keycloak";

export class Header {
  private element: HTMLElement | null = null;

  render(container: HTMLElement) {
    container.insertAdjacentHTML(
      "afterbegin",
      `
      <header>
        <div class="logo">Бизнес-архитектура</div>
        <div class="account">
          <span class="username"></span>
          <button class="logout-btn">Выйти</button>
        </div>
      </header>
      `
    );

    this.element = container.querySelector("header");
    this.initEvents();
  }

  private initEvents() {
    // показать имя пользователя из токена Keycloak
    const usernameEl = this.element?.querySelector(".username");
    if (usernameEl) {
      usernameEl.textContent =
        keycloak.tokenParsed?.preferred_username || "Гость";
    }

    // обработчик для кнопки выхода
    const logoutBtn = this.element?.querySelector(".logout-btn");
    logoutBtn?.addEventListener("click", () => {
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    });
  }
}
