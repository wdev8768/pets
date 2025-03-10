
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IPet, IPetNew } from '../../interfaces/pets.interface';
import { generateID } from '../../utils/generate-id';
import { PetStatus } from '../../enum/pets.enum';

@Injectable({
  providedIn: 'root',
})
export class PetsService {

  private readonly apiUrl = 'https://petstore.swagger.io/v2/pet'; // env

  constructor(private http: HttpClient) {}

  public getPetsByStatus(status: PetStatus): Observable<IPet[]> {
    return this.http.get<IPet[]>(`${this.apiUrl}/findByStatus?status=${status}`);
  }

  public getPetById(id: number): Observable<IPet> {
    return this.http.get<IPet>(`${this.apiUrl}/${id}`);
  }

  public addPet(pet: IPetNew): Observable<IPet> {
    const body = { 
      ...pet,
      id: generateID(),
    };
    return this.http.post<IPet>(this.apiUrl, body);
  }

  public updatePet(pet: IPet): Observable<IPet> {
    return this.http.put<IPet>(this.apiUrl, pet);
  }

  public deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
