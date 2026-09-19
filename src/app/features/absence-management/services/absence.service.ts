import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { AbsenceApiService } from './absence-api.service';
import { AbsenceCreateRequest, AbsenceResponse } from '../models/absence-api';
import { toAbsenceRequest } from '../models/absence-request';
export interface LoadState<T> {
  data: T;
  loading: boolean;
  error: string;
}
export function absenceError(error: unknown): string {
  const e = error as HttpErrorResponse;
  if (e.status === 0) return 'No se pudo conectar con el servidor. Intente nuevamente.';
  if (e.status === 401) return 'La sesión expiró. Inicie sesión nuevamente.';
  if (e.status === 403) return 'No tiene permiso para realizar esta operación.';
  if (e.status === 409) return 'La solicitud ya fue procesada. La lista se actualizará.';
  if (e.error && typeof e.error === 'object') {
    if (typeof e.error.message === 'string') return e.error.message;
    if (e.error.errors)
      return Object.values(e.error.errors)
        .filter((v) => typeof v === 'string')
        .join(' ');
  }
  return 'No se pudo completar la operación. Intente nuevamente.';
}
@Injectable({ providedIn: 'root' })
export class AbsenceService {
  private readonly api = inject(AbsenceApiService);
  private readonly users = inject(UserService);
  private readonly refreshMy = new BehaviorSubject<void>(undefined);
  private readonly refreshPending = new BehaviorSubject<void>(undefined);
  private readonly refreshProfile = new BehaviorSubject<void>(undefined);
  readonly myState$ = this.load(
    this.refreshMy,
    () => this.api.getMyRequests().pipe(map((rows) => rows.map(toAbsenceRequest))),
    [],
  );
  readonly pendingState$ = this.load(
    this.refreshPending,
    () => this.api.getPendingApprovals().pipe(map((rows) => rows.map(toAbsenceRequest))),
    [],
  );
  readonly profileState$ = this.load(this.refreshProfile, () => this.users.getCurrentUser(), null);
  getMyRequests() {
    return this.myState$.pipe(map((state) => state.data));
  }
  getPendingApprovals() {
    return this.pendingState$.pipe(map((state) => state.data));
  }
  reloadMyRequests() {
    this.refreshMy.next();
  }
  reloadPendingApprovals() {
    this.refreshPending.next();
  }
  reloadProfile() {
    this.refreshProfile.next();
  }
  createRequest(request: AbsenceCreateRequest) {
    return this.mutate(this.api.createRequest(request));
  }
  approveRequest(id: string, comment = '') {
    return this.mutate(this.api.approveRequest(id, comment));
  }
  rejectRequest(id: string, comment = '') {
    return this.mutate(this.api.rejectRequest(id, comment));
  }
  private mutate(operation: Observable<AbsenceResponse>) {
    return operation.pipe(
      map(toAbsenceRequest),
      tap(() => {
        this.reloadMyRequests();
        this.reloadPendingApprovals();
      }),
      catchError((error) => {
        if (error.status === 409) {
          this.reloadMyRequests();
          this.reloadPendingApprovals();
        }
        return throwError(() => new Error(absenceError(error)));
      }),
    );
  }
  private load<T>(
    refresh: Observable<void>,
    fetch: () => Observable<T>,
    empty: T,
  ): Observable<LoadState<T>> {
    return refresh.pipe(
      switchMap(() =>
        fetch().pipe(
          map((data) => ({ data, loading: false, error: '' })),
          startWith({ data: empty, loading: true, error: '' }),
          catchError((error) => of({ data: empty, loading: false, error: absenceError(error) })),
        ),
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
