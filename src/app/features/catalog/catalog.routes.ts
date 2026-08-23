import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-detail/product-detail').then((m) => m.ProductDetail),
  },
];