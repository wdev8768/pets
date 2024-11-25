import { Injectable } from '@angular/core';

import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

import { PetsService } from './api/pets.service';
import { IPet, IPetNew } from '../interfaces/pets.interface';
import { PetStatus } from '../enum/pets.enum';

@Injectable({
  providedIn: 'root'
})
export class PetsFacadeService {

  private readonly _pets$ = new BehaviorSubject<IPet[]>([]);
  public readonly pets$ = this._pets$.asObservable();

  constructor(private petsService: PetsService) { }

  public getPets(filterStatus: PetStatus): Observable<IPet[]> {
    return this.petsService.getPetsByStatus(filterStatus)
      .pipe(
        tap((value) => this._pets$.next(value)),
      );
  }

  public addPet(pet: IPetNew): Observable<IPet> {
    return this.petsService.addPet(pet)
      .pipe(
        tap((value) => {
          this.onAddNewPet(value);
        }),
      );
  }

  public updatePet(pet: IPet): Observable<IPet> {
    return this.petsService.updatePet(pet)
      .pipe(
        tap((value) => {
          this.onUpdatePet(value);
        }),
      );
  }

  public deletePet(id: number): Observable<void> {
    return this.petsService.deletePet(id)
      .pipe(
        tap(() => {
          this.onDeletePet(id);
        }),
      );
  }

  public getPetById(id: number): Observable<IPet> {
    return this.petsService.getPetById(id);
  }

  private onAddNewPet(pet: IPet): void {
    this._pets$.next([pet, ...this._pets$.value]);
  }

  private onUpdatePet(pet: IPet): void {
    const list = [...this._pets$.value];
    const index = list.findIndex(item => item.id === pet.id);
    list[index] = {...pet};
    this._pets$.next(list);
  }

  private onDeletePet(id: number): void {
    const list = [...this._pets$.value];
    const index = list.findIndex(item => item.id === id);
    list.splice(index, 1);
    this._pets$.next(list);
  }

}
