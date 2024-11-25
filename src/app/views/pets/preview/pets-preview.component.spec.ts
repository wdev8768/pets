import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PetsPreviewComponent } from './pets-preview.component';
import { PetsService } from '../../../services/api/pets.service';
import { IPet } from '../../../interfaces/pets.interface';

describe('PetsPreviewComponent', () => {
  let component: PetsPreviewComponent;
  let fixture: ComponentFixture<PetsPreviewComponent>;
  let petsServiceSpy: jasmine.SpyObj<PetsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const petsServiceMock = jasmine.createSpyObj('PetsService', ['getPetById']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [PetsPreviewComponent],
      providers: [
        { provide: PetsService, useValue: petsServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '1' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetsPreviewComponent);
    component = fixture.componentInstance;

    petsServiceSpy = TestBed.inject(PetsService) as jasmine.SpyObj<PetsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet data on init and update the view', () => {
    const mockPet = { id: 1, name: 'Dog', status: 'available' } as IPet;
    petsServiceSpy.getPetById.and.returnValue(of(mockPet));

    component.ngOnInit();

    expect(petsServiceSpy.getPetById).toHaveBeenCalledWith(1);
    expect(component.recordData).toEqual(mockPet);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error and navigate to home page if pet not found', () => {
    petsServiceSpy.getPetById.and.returnValue(throwError(() => new Error('Not found')));

    component.ngOnInit();

    expect(petsServiceSpy.getPetById).toHaveBeenCalledWith(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should unsubscribe from subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(component['ComponentSubsc'], 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
