import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAutocomplete',
  standalone: true,
})
export class FilterAutocompletePipe implements PipeTransform {
  transform<T extends { name: string }>(items: T[], searchText: string | undefined): T[] {
    if (!searchText) {
      return items;
    }
    const lowerSearch = searchText.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(lowerSearch));
  }
}
