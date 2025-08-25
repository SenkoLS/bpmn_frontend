export class Header {
  private element: HTMLElement | null = null;

  render(container: HTMLElement) {
    container.insertAdjacentHTML(
      "afterbegin",
      `
      <header>
        <div class="logo">Бизнес-архитектура</div>
        <div class="account">Моя учётка</div>
      </header>
      `
    );

    this.element = container.querySelector("header");
    this.initEvents();
  }

  private initEvents() {
    const account = this.element?.querySelector(".account");
    account?.addEventListener("click", () => {
      console.log("Открыть меню пользователя (в будущем)");
      // здесь можно будет добавить выпадающий список
    });
  }
}
