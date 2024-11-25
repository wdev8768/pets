import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsPreviewComponent } from './pets-preview.component';

describe('PetsPreviewComponent', () => {
  let component: PetsPreviewComponent;
  let fixture: ComponentFixture<PetsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
