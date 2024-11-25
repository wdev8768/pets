import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PetsFacadeService } from './pets-facade.service';
import { PetsService } from './api/pets.service';
import { IPet, IPetNew } from '../interfaces/pets.interface';
import { PetStatus } from '../enum/pets.enum';

describe('PetsFacadeService', () => {
  let service: PetsFacadeService;
  let petsServiceSpy: jasmine.SpyObj<PetsService>;

  beforeEach(() => {
    const petsServiceMock = jasmine.createSpyObj('PetsService', [
      'getPetsByStatus',
      'addPet',
      'updatePet',
      'deletePet'
    ]);

    TestBed.configureTestingModule({
      providers: [
        PetsFacadeService,
        { provide: PetsService, useValue: petsServiceMock }
      ]
    });

    service = TestBed.inject(PetsFacadeService);
    petsServiceSpy = TestBed.inject(PetsService) as jasmine.SpyObj<PetsService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPets', () => {
    it('should fetch pets by status and update the pets$ observable', (done) => {
      const petsMock: IPet[] = [{ id: 1, name: 'Dog', status: PetStatus.Available }] as IPet[];
      petsServiceSpy.getPetsByStatus.and.returnValue(of(petsMock));

      service.getPets(PetStatus.Available).subscribe((pets) => {
        expect(pets).toEqual(petsMock);
        expect(petsServiceSpy.getPetsByStatus).toHaveBeenCalledWith(PetStatus.Available);
        service.pets$.subscribe((state) => {
          expect(state).toEqual(petsMock);
          done();
        });
      });
    });
  });

  describe('addPet', () => {
    it('should add a new pet and update the pets$ observable', (done) => {
      const newPet: IPetNew = { name: 'Cat', status: PetStatus.Available } as IPetNew;
      const addedPet: IPet = { id: 2, ...newPet };
      const initialPets: IPet[] = [{ id: 1, name: 'Dog', status: PetStatus.Available } as IPet];
      petsServiceSpy.addPet.and.returnValue(of(addedPet));

      (service as any)._pets$.next(initialPets);

      service.addPet(newPet).subscribe((pet) => {
        expect(pet).toEqual(addedPet);
        expect(petsServiceSpy.addPet).toHaveBeenCalledWith(newPet);
        service.pets$.subscribe((state) => {
          expect(state).toEqual([addedPet, ...initialPets]);
          done();
        });
      });
    });
  });

  describe('updatePet', () => {
    it('should update an existing pet and update the pets$ observable', (done) => {
      const updatedPet: IPet = { id: 1, name: 'Dog Updated', status: PetStatus.Sold } as IPet;
      const initialPets: IPet[] = [{ id: 1, name: 'Dog', status: PetStatus.Available } as IPet];
      petsServiceSpy.updatePet.and.returnValue(of(updatedPet));

      (service as any)._pets$.next(initialPets);

      service.updatePet(updatedPet).subscribe((pet) => {
        expect(pet).toEqual(updatedPet);
        expect(petsServiceSpy.updatePet).toHaveBeenCalledWith(updatedPet);
        service.pets$.subscribe((state) => {
          expect(state).toEqual([updatedPet]);
          done();
        });
      });
    });
  });

  describe('deletePet', () => {
    it('should delete a pet and update the pets$ observable', (done) => {
      const initialPets: IPet[] = [
        { id: 1, name: 'Dog', status: PetStatus.Available },
        { id: 2, name: 'Cat', status: PetStatus.Available }
      ] as IPet[];
      const deletedPetId = 1;
      petsServiceSpy.deletePet.and.returnValue(of(undefined));

      (service as any)._pets$.next(initialPets);

      service.deletePet(deletedPetId).subscribe(() => {
        expect(petsServiceSpy.deletePet).toHaveBeenCalledWith(deletedPetId);
        service.pets$.subscribe((state) => {
          expect(state).toEqual([{ id: 2, name: 'Cat', status: PetStatus.Available } as IPet]);
          done();
        });
      });
    });
  });
});
