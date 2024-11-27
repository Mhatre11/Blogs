import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(value: any, searchTerm: string): any {
    if (searchTerm) {
      return value.filter(() => {
        const blogData = Object.values(value).join(' ').toLowerCase();
        return blogData.includes(searchTerm.toLowerCase());
      });
    } else {
      return value;
    }
  }
}
