import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbsenceRequest,
  STATUS_LABELS,
  durationMinutes,
  formatDuration,
  fullDays,
} from '../models/absence-request';
@Component({
  selector: 'app-absence-table',
  standalone: true,
  styleUrl: '../absence.scss',
  template: `<div
    class="table-scroll"
    role="region"
    aria-label="Solicitudes de ausencia"
    tabindex="0"
  >
    <table>
      <caption>
        {{
          rows.length
        }}
        solicitudes · Fechas y horas locales del centro de operación
      </caption>
      <thead>
        <tr>
          @if (approval) {
            <th scope="col">Empleado</th>
          }
          <th scope="col">Solicitud</th>
          <th scope="col">Salida</th>
          <th scope="col">Regreso</th>
          <th scope="col">Duración</th>
          <th scope="col">Motivo</th>
          <th scope="col">Aprobador</th>
          <th scope="col">Estado</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows; track row.id) {
          <tr>
            @if (approval) {
              <td>
                <strong>{{ row.employeeName }}</strong
                ><small>{{ row.type }}</small>
              </td>
            }
            <td>
              {{ row.requestDate }}<small>{{ row.id }}</small>
            </td>
            <td class="date">{{ row.departureAt.replace('T', ' ') }}</td>
            <td class="date">{{ row.returnAt.replace('T', ' ') }}</td>
            <td class="date">{{ duration(row) }}</td>
            <td class="reason">
              <small>{{ row.type }}</small
              >{{ row.reason }}
              @if (row.decisionComment) {
                <small>Comentario: {{ row.decisionComment }}</small>
              }
              @if (row.decisionDate) {
                <small>Decisión: {{ row.decisionDate }}</small>
              }
            </td>
            <td>{{ row.approverName }}</td>
            <td>
              <span class="badge" [attr.data-status]="row.status">{{ labels[row.status] }}</span>
            </td>
            <td>
              @if (approval && row.status === 'PENDING') {
                <div class="actions">
                  @if (approval) {
                    <button
                      type="button"
                      [disabled]="busy"
                      [attr.aria-label]="'Aprobar ' + row.id"
                      (click)="approve.emit(row.id)"
                    >
                      Aprobar</button
                    ><button
                      type="button"
                      [disabled]="busy"
                      class="secondary"
                      [attr.aria-label]="'Rechazar ' + row.id"
                      (click)="reject.emit(row.id)"
                    >
                      Rechazar
                    </button>
                  }
                </div>
              } @else {
                <span>—</span>
              }
            </td>
          </tr>
        } @empty {
          <tr>
            <td [attr.colspan]="approval ? 9 : 8" class="empty">
              No hay solicitudes para mostrar.
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>`,
})
export class AbsenceTableComponent {
  @Input() rows: AbsenceRequest[] = [];
  @Input() approval = false;
  @Input() busy = false;
  @Output() approve = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();
  readonly labels = STATUS_LABELS;
  duration(row: AbsenceRequest) {
    return row.allDay
      ? `${fullDays(row)} día(s) completo(s)`
      : formatDuration(durationMinutes(row));
  }
}
