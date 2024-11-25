import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { Subscription } from 'rxjs';

import { IPet } from '../../../interfaces/pets.interface';
import { ValidateImagePipe } from '../../../pipes/validate-image-url.pipe';
import { PetsFacadeService } from '../../../services/pets-facade.service';

@Component({
  selector: 'app-pets-preview',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatChipsModule, ValidateImagePipe],
  templateUrl: './pets-preview.component.html',
  styleUrl: './pets-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetsPreviewComponent implements OnInit, OnDestroy {

  public isLoading: boolean = true;
  public recordData?: IPet;

  public get id(): number {
    return Number(this.activeRoute.snapshot.params['id']);
  }
  
  private readonly ComponentSubsc = new Subscription();

  constructor(
    private activeRoute: ActivatedRoute,
    private petsFacadeService: PetsFacadeService,
    private router: Router,
    private changeDetRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getRecordData();
  }

  ngOnDestroy(): void {
    this.ComponentSubsc.unsubscribe();
  }

  private getRecordData(): void {
    const sub = this.petsFacadeService.getPetById(this.id).subscribe({
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
    this.ComponentSubsc.add(sub);
  }

}
