import { Directive, HostListener, ElementRef, Renderer2, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[doubleNumber]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DoubleNumberDirective),
    multi: true
  }]
})

/**
 * The `DoubleNumberDirective` class provides functionality to handle and format double number inputs.
 * It ensures that the input value adheres to specified constraints like `minValue` and `maxValue` 
 * and provides a formatted display for double values, maintaining their floating-point precision.
 * 
 * @property minValue - The minimum permissible value for the input.
 * @property maxValue - The maximum permissible value for the input.
 */
export class DoubleNumberDirective implements ControlValueAccessor {
  private onChange: (value: any) => void;
  private onTouched: () => void;

  @Input() minValue: number;
  @Input() maxValue: number;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  /**
   * This method is triggered every time an input event occurs on the associated element.
   * 
   * The flow of the method is as follows:
   * 1. Retrieves the current value from the element.
   * 2. Formats this value into a number.
   * 3. Checks if the formatted value is outside the boundaries set by `minValue` and `maxValue`.
   *    a. If the value is less than `minValue`, it resets the value to `minValue`.
   *    b. If the value exceeds `maxValue`, the method returns without making further updates.
   * 4. Updates the displayed value on the element to the formatted value.
   * 5. Calculates and adjusts the cursor position to ensure the cursor remains in the correct position 
   *    after formatting.
   * 6. If the `onChange` method is defined (typically by Angular's forms module to update the model), 
   *    the formatted value is passed to it.
   * 
   * The primary goal of this method is to ensure the value entered into the element is always a valid 
   * number and formatted according to the defined rules. Additionally, it handles model updating and 
   * cursor positioning.
   * 
   * @param event The input event fired on the element.
   */
  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const inputValue: string = event.target.value;
    let numberValue = this.convertFormattedValueToNumber(inputValue);

    // Verifique se o valor está fora dos limites
    if (this.minValue !== undefined && numberValue < this.minValue) {
      numberValue = this.minValue;
    } else if (this.maxValue !== undefined && numberValue > this.maxValue) {
      // Se o valor exceder o máximo, reverta para o valor anterior e pare a execução
      this.renderer.setProperty(this.el.nativeElement, 'value', this.formatNumber(this.el.nativeElement.value));
      return;
    }

    const formattedValue: string = this.formatNumber(inputValue);
    const cursorPosition: number = event.target.selectionStart;
    // Atualiza o valor do elemento com o valor formatado
    this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);

    // Calcule a nova posição do cursor
    const newCursorPosition = this.calculateCursorPosition(cursorPosition, inputValue, formattedValue);

    // Defina a nova posição do cursor
    event.target.setSelectionRange(newCursorPosition, newCursorPosition);

    // Atualiza o valor do modelo
    if (this.onChange) {
      this.onChange(numberValue);
    }
  }


  /**
   * Calculate the new cursor position after number formatting.
   *
   * This function determines the appropriate cursor position after the number has been formatted.
   * The basic approach considers the length difference between the original and the formatted values,
   * adjusting the cursor accordingly. Depending on specific formatting logic, adjustments to this 
   * calculation may be needed.
   *
   * @param originalPosition - The cursor position in the original input value before formatting.
   * @param originalValue - The original input value before formatting.
   * @param formattedValue - The value after it has been formatted.
   * 
   * @returns The new cursor position adjusted for the formatting.
   */
  private calculateCursorPosition(originalPosition: number, originalValue: string, formattedValue: string): number {
    const lengthDifference = formattedValue.length - originalValue.length;
    return originalPosition + lengthDifference;
  }

  /**
   * Updates the displayed value on the element, formatting it correctly 
   * based on its type.
   *
   * @param value The value that needs to be formatted and set on the element.
   */
  writeValue(value: any): void {
    let formattedValue = '';

    // Verifique o tipo de valor
    if (typeof value === 'number') {
      // Converta o número decimal em uma string formatada
      formattedValue = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
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
   * Formats the given string input into a decimal string representation.
   * This method cleans the input by removing any non-numeric characters,
   * and then formats it to display as a decimal number.
   *
   * @param inputValue The string that needs to be formatted into a decimal representation.
   * @returns A string representing the formatted decimal value.
   */
  private formatNumber(inputValue: string): string {
    let cleanedValue = inputValue.replace(/\D/g, ""); // Remove tudo exceto números

    // Garantindo que haja pelo menos dois dígitos para formar um valor decimal correto
    cleanedValue = cleanedValue.padStart(2, '0');

    // Posicionando corretamente os centavos
    const mainValue = cleanedValue.substring(0, cleanedValue.length - 2);
    const centavos = cleanedValue.substring(cleanedValue.length - 2);

    // Juntando o valor principal com os centavos
    const fullValue = mainValue + "." + centavos;

    // Convertendo o valor limpo em um número decimal
    let decimalValue = parseFloat(fullValue);

    // Checar os limites de minValue e maxValue
    if (this.minValue !== undefined && decimalValue < this.minValue) {
      decimalValue = this.minValue;
    }
    if (this.maxValue !== undefined && decimalValue > this.maxValue) {
      decimalValue = this.maxValue;
    }

    // Formatando o valor para exibir no input
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(decimalValue);
  }

  /**
   * Converts a formatted string (e.g., with commas as decimal separators) 
   * into its numeric representation.
   * This method is useful for parsing values formatted according to the Brazilian locale (pt-BR).
   *
   * @param formattedValue The formatted string to be converted.
   * @returns A number representing the parsed value.
   */
  convertFormattedValueToNumber(formattedValue: string): number {
    return parseFloat(formattedValue.replace(/\./g, '').replace(',', '.'));
  }
}
