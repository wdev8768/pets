import { fakeAsync, tick } from '@angular/core/testing';

import { ValidateImagePipe } from './validate-image-url.pipe';

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(_: string) {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
};

describe('ValidateImagePipe', () => {
  let pipe: ValidateImagePipe;

  beforeEach(() => {
    pipe = new ValidateImagePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the placeholder if the imageUrl is empty', (done) => {
    const placeholder = '/assets/placeholder-image.webp';

    pipe.transform('').subscribe((result) => {
      expect(result).toBe(placeholder);
      done();
    });
  });

  it('should return the same imageUrl if the image loads successfully', fakeAsync(() => {
    const imageUrl = 'https://example.com/valid-image.jpg';
  
    pipe.transform(imageUrl).subscribe((result) => {
      expect(result).toBe(imageUrl);
    });
  
    tick();
  }));
  
  it('should return the placeholder if the image fails to load', fakeAsync(() => {
    class MockImageWithError extends MockImage {
      override set src(_: string) {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror();
          }
        }, 0);
      }
    }
  
    (window as any).Image = MockImageWithError;
  
    const imageUrl = 'https://example.com/invalid-image.jpg';
    const placeholder = '/assets/placeholder-image.webp';
  
    pipe.transform(imageUrl).subscribe((result) => {
      expect(result).toBe(placeholder);
    });
  
    tick();
  }));
});
