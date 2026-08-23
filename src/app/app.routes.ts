import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.authRoutes),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'catalog',
        loadChildren: () =>
          import('./features/catalog/catalog.routes').then((m) => m.catalogRoutes),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./features/cart/cart.routes').then((m) => m.cartRoutes),
      },
    ],
  },
];