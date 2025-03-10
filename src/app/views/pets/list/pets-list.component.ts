import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { takeUntil } from 'rxjs';

import { IPet } from '../../../interfaces/pets.interface';
import { PetStatus } from '../../../enum/pets.enum';
import { PetsFiltersComponent } from './filters/pets-filters.component';
import { PetsFormComponent } from '../form/pets-form.component';
import { PetsFacadeService } from '../../../services/pets-facade.service';
import { Destroyable } from '../../../utils/destroyable';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetsListComponent extends Destroyable {
  public readonly displayedColumns: string[] = ['id', 'name', 'category', 'status', 'actions'];

  public dataSource = new MatTableDataSource<IPet>([]);

  public filterStatus = PetStatus.Available;
  public filterName = '';
  public isLoading = false;
  public isErrorGetPetsList?: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private petsFacadeService: PetsFacadeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.onChangePetsList();
    this.initFiltersTable();
    this.loadPets();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public showAddForm(editedPet?: IPet): void {
    this.dialog.open(PetsFormComponent, { width: '450px', data: editedPet })
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
    this.petsFacadeService.getPets(this.filterStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.isErrorGetPetsList = false;
        },
        error: () => {
          this.onErrorGetPetsList();
        }
      });
  }

  public editPet(pet: IPet): void {
    this.showAddForm(pet);
  }

  public deletePet(id: number): void {
    const confirmAction = confirm('Are you sure you want to delete this pet?');
    if (confirmAction) {
      this.petsFacadeService.deletePet(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
        {
          next: () => this.showSnackBar('Pet deleted successfully.'),
          error: () => this.showSnackBar('Failed to delete pet.'),
        }
      );
    }
  }

  public viewDetails(pet: IPet): void {
    this.router.navigate([`/pet/${pet.id}`]);
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

  private onChangePetsList(): void {
    this.petsFacadeService.pets$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.dataSource.data = data);
  }
}
