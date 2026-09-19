import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { reverseAuthGuard } from './guards/reverse.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./layouts/auth-layout/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [reverseAuthGuard],
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'absence-management',
        loadChildren: () =>
          import('./features/absence-management/absence.routes').then((m) => m.ABSENCE_ROUTES),
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfilePageComponent),
      },
      {
        path: 'academy',
        loadChildren: () =>
          import('./pages/academy/routes/academy.routes').then((m) => m.ACADEMY_ROUTES),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./pages/documents/documents').then((m) => m.DocumentsComponent),
      },
      {
        path: 'requeriments',
        loadChildren: () =>
          import('./pages/requirements/routes/requirements.routes').then(
            (m) => m.REQUIREMENTS_ROUTES,
          ),
      },
      {
        path: 'admin',
        loadChildren: () => import('./pages/admin/routes/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
      {
        path: 'fixed-assets',
        loadComponent: () =>
          import('./pages/fixed-assets/fixed-assets').then((m) => m.FixedAssetsComponent),
      },
      {
        path: 'meeting-room',
        loadComponent: () =>
          import('./pages/meeting-room/meeting-room').then((m) => m.MeetingRoomComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'auth/login' },
];
