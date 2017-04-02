import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyjson'
})
export class PrettyjsonPipe implements PipeTransform {

  transform(val) {
      return JSON.stringify(val, null, 2)
      .replace(' ', ' ')
      .replace('\n', '\n');
  }

}
