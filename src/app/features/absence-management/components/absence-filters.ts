import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ABSENCE_STATUSES, STATUS_LABELS, AbsenceFilters } from '../models/absence-request';
@Component({
  selector: 'app-absence-filters',
  standalone: true,
  imports: [FormsModule],
  styleUrl: '../absence.scss',
  template: `<div class="filters">
    <label
      >Estado<select [(ngModel)]="value.status" (ngModelChange)="emit()">
        <option value="">Todos</option>
        @for (status of statuses; track status) {
          <option [value]="status">{{ labels[status] }}</option>
        }
      </select></label
    >
    <label
      >Fecha de salida<input type="date" [(ngModel)]="value.date" (ngModelChange)="emit()"
    /></label>
    @if (sites.length) {
      <label
        >Centro de operación<select [(ngModel)]="value.site" (ngModelChange)="emit()">
          <option value="">Todos</option>
          @for (site of sites; track site) {
            <option [value]="site">{{ site }}</option>
          }
        </select></label
      >
    }
    <label
      >Buscar<input
        type="search"
        placeholder="Motivo, persona o tipo"
        [(ngModel)]="value.search"
        (ngModelChange)="emit()"
    /></label>
    <button type="button" class="secondary" (click)="clear()">Limpiar filtros</button>
  </div>`,
})
export class AbsenceFiltersComponent {
  @Input() sites: string[] = [];
  @Output() filtersChange = new EventEmitter<AbsenceFilters>();
  readonly statuses = ABSENCE_STATUSES;
  readonly labels = STATUS_LABELS;
  value: AbsenceFilters = { status: '', date: '', search: '', site: '' };
  emit() {
    this.filtersChange.emit({ ...this.value });
  }
  clear() {
    this.value = { status: '', date: '', search: '', site: '' };
    this.emit();
  }
}
