import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetsFiltersComponent } from './pets-filters.component';
import { PetStatus } from '../../../../enum/pets.enum';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PetsFiltersComponent', () => {
  let component: PetsFiltersComponent;
  let fixture: ComponentFixture<PetsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PetsFiltersComponent,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit status change event', () => {
    spyOn(component.onFilterStatusChanged, 'emit');

    const status = PetStatus.Available;
    component.onStatusChange(status);

    expect(component.onFilterStatusChanged.emit).toHaveBeenCalledWith(status);
  });

  it('should emit name change event', () => {
    spyOn(component.onFilterNameChanged, 'emit');

    const name = 'Dog';
    component.onNameChange(name);

    expect(component.onFilterNameChanged.emit).toHaveBeenCalledWith(name);
  });

  it('should bind input values correctly', () => {
    const mockStatus = PetStatus.Sold;
    const mockName = 'Cat';

    component.status = mockStatus;
    component.name = mockName;

    fixture.detectChanges();
    expect(component.status).toBe(mockStatus);
    expect(component.name).toBe(mockName);
  });
});
