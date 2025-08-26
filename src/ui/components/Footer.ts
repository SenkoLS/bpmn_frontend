export class Footer {
  private element: HTMLElement | null = null;

  render(container: HTMLElement) {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <footer>
        © 2025 Бизнес-архитектура
      </footer>
      `
    );
    this.element = document.querySelector("footer");
  }
}
