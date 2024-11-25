import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetsFormComponent } from './pets-form.component';
import { PetsFacadeService } from '../../../services/pets-facade.service';
import { PetStatus } from '../../../enum/pets.enum';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PetsFormComponent', () => {
  let component: PetsFormComponent;
  let fixture: ComponentFixture<PetsFormComponent>;
  let petsFacadeServiceSpy: jasmine.SpyObj<PetsFacadeService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PetsFormComponent>>;

  const mockPet = {
    id: 1,
    name: 'Dog',
    status: PetStatus.Available,
    category: { id: 1, name: 'Animals' },
    photoUrls: ['photo'],
    tags: [{ id: 1, name: 'Cute' }],
  };

  beforeEach(async () => {
    const petsFacadeServiceMock = jasmine.createSpyObj('PetsFacadeService', ['addPet', 'updatePet']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [PetsFormComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: PetsFacadeService, useValue: petsFacadeServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockPet },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetsFormComponent);
    component = fixture.componentInstance;

    petsFacadeServiceSpy = TestBed.inject(PetsFacadeService) as jasmine.SpyObj<PetsFacadeService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<any>>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with provided pet data', () => {
    expect(component.form.value.name).toBe(mockPet.name);
    expect(component.form.value.status).toBe(mockPet.status);
    expect(component.photoUrls.length).toBe(1);
    expect(component.tags.length).toBe(1);
  });

  it('should add a photo URL', () => {
    const photoUrl = 'http://example.com/newphoto.jpg';
    component.addPhotoUrl({ value: photoUrl } as any);

    expect(component.photoUrls.length).toBe(2);
    expect(component.photoUrls.at(1)?.value).toBe(photoUrl);
  });

  it('should remove a photo URL', () => {
    component.removePhotoUrl(0);

    expect(component.photoUrls.length).toBe(0);
  });

  it('should add a tag', () => {
    const tag = 'Friendly';
    component.addTag({ value: tag } as any);

    expect(component.tags.length).toBe(2);
    expect(component.tags.at(1)?.value.name).toBe(tag);
  });

  it('should remove a tag', () => {
    component.removeTag(0);

    expect(component.tags.length).toBe(0);
  });

  it('should submit a new pet and close dialog on success', () => {
    petsFacadeServiceSpy.addPet.and.returnValue(of(mockPet));
    component.PET_DATA_EDITED = null;

    component.submit();

    expect(petsFacadeServiceSpy.addPet).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(mockPet);
  });

  it('should handle error when submitting a new pet', () => {
    petsFacadeServiceSpy.addPet.and.returnValue(throwError(() => new Error('Error')));

    component.PET_DATA_EDITED = null;
    component.submit();
    expect(component.isLoading).toBeFalse();
  });
  

  it('should submit an edited pet and close dialog on success', () => {
    petsFacadeServiceSpy.updatePet.and.returnValue(of(mockPet));

    component.submit();

    expect(petsFacadeServiceSpy.updatePet).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(mockPet);
  });

  it('should handle error when submitting an edited pet', () => {
    petsFacadeServiceSpy.updatePet.and.returnValue(throwError(() => new Error('Error')));

    component.submit();
    expect(component.isLoading).toBeFalse();
  });
});
