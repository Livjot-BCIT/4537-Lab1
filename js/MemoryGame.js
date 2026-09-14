import { InputValidator } from "./InputValidator.js";

import { MemoryButton } from "./MemoryButton.js";

/* GPT assisted with a portion of the code. */

export class MemoryGame {
  constructor(messages) {
    this.messages = messages;

    this.minimumButtons = 3;
    this.maximumButtons = 7;

    this.oneSecond = 1000;
    this.scrambleInterval = 2000;

    this.buttons = [];

    this.expectedOrder = 1;

    this.gameNumber = 0;

    this.form = document.getElementById("gameForm");

    this.input = document.getElementById("buttonCount");

    this.label = document.getElementById("buttonCountLabel");

    this.goButton = document.getElementById("goButton");

    this.message = document.getElementById("message");

    this.gameArea = document.getElementById("gameArea");

    this.validator = new InputValidator(
      this.minimumButtons,
      this.maximumButtons,
    );
  }

  start() {
    this.loadMessages();

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.startNewGame();
    });
  }

  loadMessages() {
    document.title = this.messages.PAGE_TITLE;

    this.label.textContent = this.messages.BUTTON_COUNT_LABEL;

    this.goButton.textContent = this.messages.GO_BUTTON;
  }

  async startNewGame() {
    const validation = this.validator.validate(this.input.value);

    if (!validation.isValid) {
      this.showMessage(this.messages.INVALID_INPUT);

      return;
    }

    this.gameNumber++;

    const currentGameNumber = this.gameNumber;

    this.resetGame();

    const buttonCount = validation.value;

    this.createButtons(buttonCount);

    await this.delay(buttonCount * this.oneSecond);

    if (currentGameNumber !== this.gameNumber) {
      return;
    }

    await this.scrambleButtons(buttonCount, currentGameNumber);

    if (currentGameNumber !== this.gameNumber) {
      return;
    }

    this.prepareForGuessing();
  }

  createButtons(buttonCount) {
    for (let number = 1; number <= buttonCount; number++) {
      const memoryButton = new MemoryButton(number, this.gameArea, (button) => {
        this.checkButton(button);
      });

      this.buttons.push(memoryButton);
    }
  }

  async scrambleButtons(buttonCount, currentGameNumber) {
    for (let scramble = 0; scramble < buttonCount; scramble++) {
      if (currentGameNumber !== this.gameNumber) {
        return;
      }

      const viewportWidth = window.innerWidth;

      const viewportHeight = window.innerHeight;

      this.buttons.forEach((button) => {
        button.moveToRandomPosition(viewportWidth, viewportHeight);
      });

      if (scramble < buttonCount - 1) {
        await this.delay(this.scrambleInterval);
      }
    }
  }

  prepareForGuessing() {
    this.expectedOrder = 1;

    this.buttons.forEach((button) => {
      button.hideNumber();

      button.enable();
    });
  }

  checkButton(button) {
    if (button.orderNumber === this.expectedOrder) {
      this.handleCorrectButton(button);
    } else {
      this.handleWrongButton();
    }
  }

  handleCorrectButton(button) {
    button.showNumber();

    button.disable();

    this.expectedOrder++;

    if (this.expectedOrder > this.buttons.length) {
      this.showMessage(this.messages.EXCELLENT_MEMORY);

      this.disableAllButtons();
    }
  }

  handleWrongButton() {
    this.showMessage(this.messages.WRONG_ORDER);

    this.buttons.forEach((button) => {
      button.showNumber();

      button.disable();
    });
  }

  disableAllButtons() {
    this.buttons.forEach((button) => {
      button.disable();
    });
  }

  resetGame() {
    this.buttons.forEach((button) => {
      button.remove();
    });

    this.buttons = [];

    this.expectedOrder = 1;

    this.clearMessage();
  }

  showMessage(message) {
    this.message.textContent = message;
  }

  clearMessage() {
    this.message.textContent = "";
  }

  delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}
