import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'transformToHtmlPipe'
})
export class TransformToHtmlPipePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeHtml {
    if (value) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    } else {
      return ''; //instead of pasiing null to ui pass empty string
    }
  }

}
