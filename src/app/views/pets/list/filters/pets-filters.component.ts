import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { PetStatus } from '../../../../enum/pets.enum';

@Component({
  selector: 'app-pets-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './pets-filters.component.html',
  styleUrl: './pets-filters.component.scss'
})
export class PetsFiltersComponent {
  @Input() status!: PetStatus;
  @Input() name: string = '';
  @Output() onFilterStatusChanged = new EventEmitter<PetStatus>();
  @Output() onFilterNameChanged = new EventEmitter<string>();

  public readonly PETS_FILTER_STATUS = PetStatus;

  public onStatusChange(status: PetStatus): void {
    this.onFilterStatusChanged.emit(status);
  }

  public onNameChange(name: string): void {
    this.onFilterNameChanged.emit(name);
  }
}
