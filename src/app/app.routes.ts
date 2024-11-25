import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./views/pets/list/pets-list.component').then(m => m.PetsListComponent),
    },
    {
        path: 'pet/:id',
        loadComponent: () => import('./views/pets/preview/pets-preview.component').then(m => m.PetsPreviewComponent),
    },
];
