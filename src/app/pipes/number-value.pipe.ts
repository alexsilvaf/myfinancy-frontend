import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberValue'
})
export class NumberValuePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      value = 0;
    }
    
    // Formatando o valor como reais (BRL) e adicionando espaço após o "R$".
    let formattedValue =  new Intl.NumberFormat('pt-BR', { useGrouping: true }).format(value);
    return formattedValue;
  }
}
