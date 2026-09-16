import { Routes } from '@angular/router';
import { AdminComponent } from '../admin';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        loadComponent: () => import('../users-list/users').then((m) => m.UsersComponent),
      },
      {
        path: 'users/create',
        loadComponent: () =>
          import('../create-users/create-user').then((m) => m.CreateUsersComponent),
      },
      {
        path: 'users/update',
        loadComponent: () =>
          import('../update-users/update-users').then((m) => m.UpdateUsersComponent),
      },
      {
        path: 'users/change-password',
        loadComponent: () =>
          import('../change-password/change-password').then((m) => m.ChangePasswordComponent),
      },
      {
        path: 'users/change-status',
        loadComponent: () =>
          import('../change-user-status/change-user-status').then(
            (m) => m.ChangeUserStatusComponent,
          ),
      },

      {
        path: 'areas',
        loadComponent: () =>
          import('../areas/area-list/area-list').then((m) => m.AreaListComponent),
      },
      {
        path: 'areas/create',
        loadComponent: () =>
          import('../areas/area-form/area-form').then((m) => m.AreaFormComponent),
      },
      {
        path: 'areas/edit/:id',
        loadComponent: () =>
          import('../areas/area-form/area-form').then((m) => m.AreaFormComponent),
      },

      {
        path: 'requirements',
        loadComponent: () =>
          import('../requirements/requirements-list/requirements-list').then(
            (m) => m.RequirementListComponent,
          ),
      },
      {
        path: 'requirements/create',
        loadComponent: () =>
          import('../requirements/create-type-requirement/create-type-requirement').then(
            (m) => m.CreateTypeRequirementComponent,
          ),
      },

      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];
