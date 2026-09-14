export class MemoryButton {
  constructor(orderNumber, parentElement, clickHandler) {
    this.orderNumber = orderNumber;
    this.parentElement = parentElement;
    this.clickHandler = clickHandler;

    this.element = document.createElement("button");

    this.create();
  }

  create() {
    this.element.type = "button";

    this.element.classList.add("memory-button");

    this.element.textContent = this.orderNumber;

    this.element.style.backgroundColor = this.createRandomColor();

    this.element.disabled = true;

    this.element.addEventListener("click", () => {
      this.clickHandler(this);
    });

    this.parentElement.appendChild(this.element);
  }

  createRandomColor() {
    const hue = Math.floor(Math.random() * 360);

    return `hsl(${hue}, 70%, 65%)`;
  }

  moveToRandomPosition(viewportWidth, viewportHeight) {
    const buttonWidth = this.element.offsetWidth;

    const buttonHeight = this.element.offsetHeight;

    const maximumX = Math.max(0, viewportWidth - buttonWidth);

    const maximumY = Math.max(0, viewportHeight - buttonHeight);

    const randomX = Math.floor(Math.random() * maximumX);

    const randomY = Math.floor(Math.random() * maximumY);

    this.element.style.position = "fixed";

    this.element.style.left = `${randomX}px`;

    this.element.style.top = `${randomY}px`;
  }

  hideNumber() {
    this.element.textContent = "";
  }

  showNumber() {
    this.element.textContent = this.orderNumber;
  }

  enable() {
    this.element.disabled = false;

    this.element.classList.add("ready");
  }

  disable() {
    this.element.disabled = true;

    this.element.classList.remove("ready");
  }

  remove() {
    this.element.remove();
  }
}
