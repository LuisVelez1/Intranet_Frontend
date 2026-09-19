import { Routes } from '@angular/router';
export const ABSENCE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'my-requests' },
  {
    path: 'new',
    loadComponent: () => import('./pages/new-request').then((m) => m.NewRequestComponent),
  },
  {
    path: 'my-requests',
    loadComponent: () => import('./pages/my-requests').then((m) => m.MyRequestsComponent),
  },
  {
    path: 'approvals',
    loadComponent: () => import('./pages/approvals').then((m) => m.ApprovalsComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports').then((m) => m.ReportsComponent),
  },
];
