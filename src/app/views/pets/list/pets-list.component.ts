import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

import { filter, Subscription } from 'rxjs';

import { PetsService } from '../../../services/api/pets.service';
import { IPet } from '../../../interfaces/pets.interface';
import { PetStatus } from '../../../enum/pets.enum';
import { PetsFiltersComponent } from './filters/pets-filters.component';
import { PetsFormComponent } from '../form/pets-form.component';

@Component({
  selector: 'app-pets-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    PetsFiltersComponent,
  ],
  templateUrl: './pets-list.component.html',
  styleUrl: './pets-list.component.scss',
})
export class PetsListComponent implements OnDestroy {
  public readonly displayedColumns: string[] = ['id', 'name', 'category', 'status', 'actions'];
  private readonly ComponentSubsc = new Subscription();

  public dataSource = new MatTableDataSource<IPet>([]);

  public filterStatus = PetStatus.Available;
  public filterName = '';
  public isLoading = false;
  public isErrorGetPetsList?: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private petsService: PetsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initFiltersTable();
    this.loadPets();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.ComponentSubsc.unsubscribe();
  }

  public showAddForm(editedPet?: IPet): void {
    const modalRef = this.dialog.open(PetsFormComponent, { width: '450px', data: editedPet });
    const sub = modalRef.afterClosed().pipe(filter(val => val)).subscribe(
      (data) => {
        if (editedPet) {
          this.updatePetInList(data);
          return;
        }
        this.addNewPetToList(data);
      },
    );
    this.ComponentSubsc.add(sub);
  }

  public onFilterStatusChange(status: PetStatus): void {
    this.filterStatus = status;
    this.loadPets();
  }

  public onFilterNameChange(value: string): void {
    this.filterName = value;
    this.applyFilters();
  }
  
  private applyFilters(): void {
    this.dataSource.filter = JSON.stringify({
      name: this.filterName,
    });
  }

  public loadPets(): void {
    this.isLoading = true;
    const sub = this.petsService.getPetsByStatus(this.filterStatus).subscribe({
      next: (pets) => {
        this.dataSource.data = pets;
        this.isLoading = false;
        this.isErrorGetPetsList = false;
      },
      error: () => this.onErrorGetPetsList(),
    });
    this.ComponentSubsc.add(sub);
  }

  public editPet(pet: IPet): void {
    this.showAddForm(pet);
  }

  public deletePet(id: number): void {
    const confirmAction = confirm('Are you sure you want to delete this pet?');
    if (confirmAction) {
      const sub = this.petsService.deletePet(id).subscribe({
        next: () => {
          this.showSnackBar('Pet deleted successfully.');
          this.loadPets();
        },
        error: () => {
          this.showSnackBar('Failed to delete pet.');
        },
      });
      this.ComponentSubsc.add(sub);
    }
  }

  public viewDetails(pet: IPet): void {
    this.router.navigate([`/pet/${pet.id}`]);
  }

  private addNewPetToList(pet: IPet): void {
    const currentData = this.dataSource.data;
    currentData.unshift({ ...pet });
    this.dataSource.data = currentData;
    this.showSnackBar('Successfully added.');
  }

  private updatePetInList(pet: IPet): void {
    const currentData = this.dataSource.data;
    const index = currentData.findIndex(item => item.id === pet.id);
    if (index !== -1) {
      currentData[index] = { ...currentData[index], ...pet };
      this.dataSource.data = [...currentData];
      this.showSnackBar('Successfully edited.');
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    });
  }

  private initFiltersTable(): void {
    this.dataSource.filterPredicate = (data: IPet, filter: string) => {
      const filters = JSON.parse(filter);
      return (
        (!filters.name || (data.name || '').toLowerCase().includes(filters.name.toLowerCase()))
      );
    };
  }

  private onErrorGetPetsList(): void {
    this.showSnackBar('Failed to load pets. Please try again.');
    this.isLoading = false;
    this.isErrorGetPetsList = true;
    this.dataSource.data = [];
  }

}
