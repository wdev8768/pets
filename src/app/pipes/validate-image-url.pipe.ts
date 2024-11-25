import { Pipe, PipeTransform } from '@angular/core';

import { Observable } from 'rxjs';

@Pipe({
  name: 'validateImage',
  standalone: true,
})
export class ValidateImagePipe implements PipeTransform {
  private readonly placeholder = '/assets/placeholder-image.webp';

  transform(imageUrl: string): Observable<string> {
    return new Observable(observer => {
      if (!imageUrl) {
        observer.next(this.placeholder);
        observer.complete();
        return;
      }

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        observer.next(imageUrl);
        observer.complete();
      };
      img.onerror = () => {
        observer.next(this.placeholder);
        observer.complete();
      };
    });
  }
}
