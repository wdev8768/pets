import { ValidateImageUrlPipe } from './validate-image-url.pipe';

describe('ValidateImageUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new ValidateImageUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
