import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { takeUntil } from 'rxjs';

import { IPet } from '../../../interfaces/pets.interface';
import { ValidateImagePipe } from '../../../pipes/validate-image-url.pipe';
import { PetsFacadeService } from '../../../services/pets-facade.service';
import { Destroyable } from '../../../utils/destroyable';

@Component({
  selector: 'app-pets-preview',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatChipsModule, ValidateImagePipe],
  templateUrl: './pets-preview.component.html',
  styleUrl: './pets-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetsPreviewComponent extends Destroyable implements OnInit {

  public isLoading: boolean = true;
  public recordData?: IPet;

  public get id(): number {
    return Number(this.activeRoute.snapshot.params['id']);
  }
  
  constructor(
    private activeRoute: ActivatedRoute,
    private petsFacadeService: PetsFacadeService,
    private router: Router,
    private changeDetRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getRecordData();
  }

  private getRecordData(): void {
    this.petsFacadeService.getPetById(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.recordData = response;
        this.isLoading = false;
        this.changeDetRef.markForCheck();
      },
      error: () => {
        alert('No record with this id found');
        this.router.navigate(['/']);
      }
    });
  }

}
