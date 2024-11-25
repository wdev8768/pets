import { TestBed } from '@angular/core/testing';

import { PetsFacadeService } from './pets-facade.service';

describe('PetsFacadeService', () => {
  let service: PetsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
