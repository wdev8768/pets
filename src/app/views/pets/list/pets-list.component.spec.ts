import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PetsListComponent } from './pets-list.component';
import { PetsFacadeService } from '../../../services/pets-facade.service';
import { PetStatus } from '../../../enum/pets.enum';
import { IPet } from '../../../interfaces/pets.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PetsListComponent', () => {
  let component: PetsListComponent;
  let fixture: ComponentFixture<PetsListComponent>;
  let petsFacadeServiceSpy: jasmine.SpyObj<PetsFacadeService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const petsFacadeServiceMock = jasmine.createSpyObj('PetsFacadeService', ['getPets', 'deletePet'], {
      pets$: of([]),
    });
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
  
    TestBed.configureTestingModule({
      imports: [
        PetsListComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: PetsFacadeService, useValue: petsFacadeServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(PetsListComponent);
    component = fixture.componentInstance;
  
    petsFacadeServiceSpy = TestBed.inject(PetsFacadeService) as jasmine.SpyObj<PetsFacadeService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });
  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle pets loading without errors', () => {
    petsFacadeServiceSpy.getPets.and.returnValue(of([]));
  
    component.loadPets();
  
    expect(petsFacadeServiceSpy.getPets).toHaveBeenCalledWith(PetStatus.Available);
    expect(component.isLoading).toBeFalse();
    expect(component.isErrorGetPetsList).toBeFalse();
  });

  it('should apply filters correctly', fakeAsync(() => {
    component.filterName = 'dog';
    const mockPets = [
      { id: 1, name: 'Dog', status: PetStatus.Available },
      { id: 2, name: 'Cat', status: PetStatus.Available },
    ] as IPet[];

    component.dataSource.data = mockPets;
    component.onFilterNameChange('dog');
    tick();

    expect(component.dataSource.filter).toEqual(JSON.stringify({ name: 'dog' }));
  }));

  it('should open the add/edit pet dialog', () => {
    component.showAddForm();

    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), { width: '450px', data: undefined });
  });

  it('should navigate to pet details', () => {
    const mockPet = { id: 1, name: 'Dog', status: PetStatus.Available } as IPet;

    component.viewDetails(mockPet);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pet/1']);
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(component['ComponentSubsc'], 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
