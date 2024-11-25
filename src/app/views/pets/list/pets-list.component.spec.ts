import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsListComponent } from './pets-list.component';

describe('PetsListComponent', () => {
  let component: PetsListComponent;
  let fixture: ComponentFixture<PetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
