import { Directive, HostListener, ElementRef, Renderer2, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[integerNumber]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IntegerNumberDirective),
    multi: true
  }]
})

/**
 * The `IntegerNumberDirective` class provides functionality to handle and format integer number inputs.
 * It ensures that the input value adheres to specified constraints like `minValue` and `maxValue` 
 * and provides a formatted display for integer values.
 * 
 * @property minValue - The minimum permissible value for the input.
 * @property maxValue - The maximum permissible value for the input.
 */
export class IntegerNumberDirective implements ControlValueAccessor {
  private onChange: (value: any) => void;
  private onTouched: () => void;

  @Input() minValue: number;
  @Input() maxValue: number;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  /**
   * This method gets triggered every time an input event occurs on the associated element.
   * 
   * - Retrieves the current value from the element.
   * - Checks and sets default value if input is empty.
   * - Formats the input value into a valid integer number.
   * - Sets boundaries based on `minValue` and `maxValue`.
   * - Updates the displayed value on the element to the formatted value.
   * - Adjusts the cursor position after formatting.
   * - Updates the model with the formatted value if `onChange` is defined.
   * 
   * @param event The input event fired on the element.
   */
  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let inputValue: string = event.target.value;
    const cursorPosition: number = event.target.selectionStart;

    if (!inputValue || inputValue.trim() === '') {
      this.renderer.setProperty(this.el.nativeElement, 'value', '0');
      if (this.onChange) {
        this.onChange(0);
      }
      return;
    }

    const formattedValue: string = this.formatNumber(inputValue);
    const numberValue = this.convertFormattedValueToNumber(formattedValue);

    if (this.minValue !== undefined && numberValue < this.minValue) {
      inputValue = this.minValue.toString();
    }
    if (this.maxValue !== undefined && numberValue > this.maxValue) {
      inputValue = this.maxValue.toString();
    }

    this.renderer.setProperty(this.el.nativeElement, 'value', this.formatNumber(inputValue));

    const newCursorPosition = this.calculateCursorPosition(cursorPosition, inputValue, formattedValue);
    event.target.setSelectionRange(newCursorPosition, newCursorPosition);

    if (this.onChange) {
      this.onChange(this.convertFormattedValueToNumber(this.formatNumber(inputValue)));
    }
  }

  /**
   * Calculates the new cursor position based on the difference in length 
   * between the original and formatted input values.
   * 
   * @param originalPosition The original cursor position.
   * @param originalValue The original value of the input.
   * @param formattedValue The formatted value of the input.
   * @returns The new cursor position.
   */
  private calculateCursorPosition(originalPosition: number, originalValue: string, formattedValue: string): number {
    const lengthDifference = formattedValue.length - originalValue.length;
    return originalPosition + lengthDifference;
  }

  /**
   * Updates the displayed value of the element with the provided value.
   * It handles both numeric and string input values, ensuring the display 
   * is formatted correctly.
   * 
   * @param value The value to be displayed.
   */
  writeValue(value: any): void {
    let formattedValue = '';

    if (typeof value === 'number') {
      formattedValue = new Intl.NumberFormat('pt-BR').format(value);
    } else if (typeof value === 'string') {
      formattedValue = this.formatNumber(value);
    }

    this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Formats the input value to a displayable integer format. Any non-numeric 
   * characters are removed and then the value is formatted using `Intl.NumberFormat`.
   * 
   * @param inputValue The raw input value.
   * @returns The formatted value as a string.
   */
  private formatNumber(inputValue: string): string {
    let cleanedValue = inputValue.replace(/\D/g, ""); // Remove tudo exceto números

    if (!cleanedValue) {
      return '0';
    }

    let integerValue = parseInt(cleanedValue);
    return new Intl.NumberFormat('pt-BR', { useGrouping: true }).format(integerValue);
  }

  /**
   * Converts a formatted string value into its integer representation.
   * Removes any formatting characters and parses the remaining value into an integer.
   * 
   * @param formattedValue The formatted string value.
   * @returns The integer representation of the input value.
   */
  convertFormattedValueToNumber(formattedValue: string): number {
    return parseInt(formattedValue.replace(/\./g, ''));
  }
}
