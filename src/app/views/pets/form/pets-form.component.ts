import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PetStatus } from '../../../enum/pets.enum';
import { ITag } from '../../../interfaces/tags.interface';
import { IPet, IPetNew } from '../../../interfaces/pets.interface';
import { generateID } from '../../../utils/generate-id';
import { PetsFacadeService } from '../../../services/pets-facade.service';

@Component({
  selector: 'app-pets-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './pets-form.component.html',
  styleUrls: ['./pets-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetsFormComponent {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly statuses = [PetStatus.Available, PetStatus.Pending, PetStatus.Sold];

  public form: FormGroup;
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public PET_DATA_EDITED: IPet,
    public dialogRef: MatDialogRef<PetsFormComponent>,
    private fb: FormBuilder,
    private petsFacadeService: PetsFacadeService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      status: [PetStatus.Available, Validators.required],
      photoUrls: this.fb.array([]),
      tags: this.fb.array([]),
      category: [''],
    });
    this.initEditedPet();
  }

  public get photoUrls(): FormArray<FormControl<string>> {
    return this.form.get('photoUrls') as FormArray<FormControl<string>>;
  }

  public get tags(): FormArray<FormControl<ITag>> {
    return this.form.get('tags') as FormArray<FormControl<ITag>>;
  }

  public addPhotoUrl(data: MatChipInputEvent): void {
    if (data.value?.length) {
      data.chipInput?.clear();
      this.photoUrls.push(new FormControl<any>(data.value, Validators.required));
    }
  }

  public removePhotoUrl(index: number): void {
    this.photoUrls.removeAt(index);
  }

  public addTag(data: MatChipInputEvent): void {
    if (data.value?.length) {
      data.chipInput?.clear();
      const body: ITag = {
        id: this.tags.length + 1,
        name: data.value,
      };
      this.tags.push(new FormControl<any>(body, Validators.required));
    }
  }

  public removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  public submit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const pet: IPetNew = {
        ...this.form.value,
        category: { id: generateID(), name: this.form.value.category },
      };
      this.PET_DATA_EDITED ? this.updatePet(pet) : this.addNewPet(pet);
    }
  }

  private addNewPet(pet: IPetNew): void {
    this.petsFacadeService.addPet(pet).subscribe({
      next: (response) => this.onSuccess(response),
      error: () => this.onErrorUpdatePet(),
    });
  }

  private updatePet(pet: IPetNew): void {
    this.petsFacadeService.updatePet({...pet, id: this.PET_DATA_EDITED.id}).subscribe({
      next: (response) => this.onSuccess(response),
      error: () => this.onErrorUpdatePet(),
    });
  }

  private onSuccess(pet: IPet): void {
    this.dialogRef.close(pet);
  }

  private onErrorUpdatePet(): void {
    this.snackBar.open(`Failed to ${ this.PET_DATA_EDITED ? 'update' : 'add' } pet. Please try again.`, 'OK', {
      duration: 5000,
    });
    this.isLoading = false;
  }

  private initEditedPet(): void {
    if (this.PET_DATA_EDITED) {
      this.form.patchValue({
        name: this.PET_DATA_EDITED.name,
        status: this.PET_DATA_EDITED.status,
        category: this.PET_DATA_EDITED.category?.name,
      });
      this.PET_DATA_EDITED.photoUrls.forEach((url) =>
        this.addPhotoUrl({value: url} as MatChipInputEvent)
      );
      this.PET_DATA_EDITED.tags.forEach((tag) =>
        this.addTag({value: tag.name} as MatChipInputEvent)
      );
    }
  }

}
