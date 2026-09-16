import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { Login } from '../../pages/login/login';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: Login },
      { path: '**', redirectTo: 'login' },
    ],
  },
];
