import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AbsenceService } from '../services/absence.service';
import { AbsenceFilters, filterRequests } from '../models/absence-request';
import { AbsenceFiltersComponent } from '../components/absence-filters';
import { AbsenceTableComponent } from '../components/absence-table';
@Component({
  selector: 'app-absence-my-requests',
  standalone: true,
  imports: [AsyncPipe, AbsenceFiltersComponent, AbsenceTableComponent],
  styleUrl: '../absence.scss',
  template: `<section class="absence-page">
    <header>
      <p class="eyebrow">Gestión de ausencias</p>
      <h1>Mis solicitudes</h1>
      <p>Solicitudes del usuario autenticado. La cancelación no está disponible en esta versión.</p>
    </header>
    <app-absence-filters (filtersChange)="filters.next($event)" />
    @if (view$ | async; as view) {
      @if (view.loading) {
        <p role="status">Cargando solicitudes…</p>
      } @else if (view.error) {
        <p class="notice error" role="alert">{{ view.error }}</p>
      } @else {
        <app-absence-table [rows]="view.data" />
      }
      <button
        type="button"
        class="secondary"
        [disabled]="view.loading"
        (click)="service.reloadMyRequests()"
      >
        Actualizar solicitudes
      </button>
    }
  </section>`,
})
export class MyRequestsComponent {
  readonly service = inject(AbsenceService);
  readonly filters = new BehaviorSubject<AbsenceFilters>({
    status: '',
    date: '',
    search: '',
    site: '',
  });
  readonly view$ = combineLatest([this.service.myState$, this.filters]).pipe(
    map(([state, filters]) => ({ ...state, data: filterRequests(state.data, filters) })),
  );
}
