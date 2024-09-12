import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    if (value <= 900) {
      return value + ' B';
    } else if (value > 900 && value <= 1024 * 900) {
      return (value / 1024).toFixed(2) + ' KB';
    } else if (value > 1024 * 900 && value <= 1024 * 1024 * 900) {
      return (value / 1024 / 1024).toFixed(2) + ' MB';
    }

    return '';
  }
}
