export class Canvas {
  private element: HTMLDivElement | null = null;

  render(container: HTMLElement) {
    container.insertAdjacentHTML(
      "beforeend",
      `<div id="canvas" class="canvas"></div>`
    );
    this.element = document.getElementById("canvas") as HTMLDivElement;
    this.showPlaceholder();
  }

  /** Показать заглушку при старте */
  showPlaceholder() {
    if (this.element) {
      this.element.innerHTML =
        '<div style="padding:20px;font-size:16px;">Выберите пункт меню слева</div>';
    }
  }

  /** Очистить канвас */
  clear() {
    if (this.element) {
      this.element.innerHTML = "";
    }
  }

  /** Получить DOM-элемент */
  getElement(): HTMLDivElement | null {
    return this.element;
  }
}
