import { Routes } from '@angular/router';
import { RequirementsComponent } from '../requirements';

export const REQUIREMENTS_ROUTES: Routes = [
  {
    path: '',
    component: RequirementsComponent,
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('../pages/create/create').then((m) => m.CreateRequirementComponent),
      },
      {
        path: 'my-requeriments',
        loadComponent: () =>
          import('../pages/my-requirements/my-requirements').then((m) => m.MyRequirementsComponent),
      },
      {
        path: 'area-requirements',
        loadComponent: () =>
          import('../pages/area-requirements/area-requirements').then(
            (m) => m.AreaRequirementsComponent,
          ),
      },
      {
        path: 'reports',
        loadComponent: () => import('../pages/reports/reports').then((m) => m.ReportsComponent),
      },
      {
        path: 'agents',
        loadComponent: () => import('../pages/agents/agents').then((m) => m.AgentsComponent),
      },
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
    ],
  },
];
