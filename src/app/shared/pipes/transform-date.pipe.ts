import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'transformDate',
  pure: true
})
export class TransformDatePipe implements PipeTransform {

  transform(value: any): any {
    if (value instanceof Date) {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(value, 'yyyy'); // 'yyyy' devuelve solo el año
    } else if (typeof value === 'string') {
      // Assuming value is a string representing a year
      const year = parseInt(value, 10);
      if (!isNaN(year)) {
        return year;
      }
    }
    return value;
  }
}
