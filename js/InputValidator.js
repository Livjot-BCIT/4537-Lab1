export class InputValidator {
  constructor(minimum, maximum) {
    this.minimum = minimum;
    this.maximum = maximum;
  }

  validate(input) {
    const number = Number(input);

    const isValid =
      input.trim() !== "" &&
      Number.isInteger(number) &&
      number >= this.minimum &&
      number <= this.maximum;

    return {
      isValid: isValid,
      value: number,
    };
  }
}
