import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AbsenceService } from '../services/absence.service';
import { localDate, validRange, wallTime } from '../models/absence-request';
export function absenceRangeValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (!v.departureDate || !v.returnDate) return null;
  if (v.allDay) {
    const start = wallTime(v.departureDate + 'T00:00');
    const end = wallTime(v.returnDate + 'T00:00');
    return Number.isFinite(start) && end >= start ? null : { invalidRange: true };
  }
  return validRange(`${v.departureDate}T${v.departureTime}`, `${v.returnDate}T${v.returnTime}`)
    ? null
    : { invalidRange: true };
}
@Component({
  selector: 'app-absence-new-request',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './new-request.html',
  styleUrl: '../absence.scss',
})
export class NewRequestComponent {
  readonly service = inject(AbsenceService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly profileState$ = this.service.profileState$;
  get requestDate() {
    return localDate();
  }
  readonly form = inject(FormBuilder).nonNullable.group(
    {
      type: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          (c: AbstractControl) => (c.value.trim() ? null : { required: true }),
        ],
      ],
      allDay: [false],
      departureDate: ['', Validators.required],
      departureTime: [''],
      returnDate: ['', Validators.required],
      returnTime: [''],
      reason: [
        '',
        [
          Validators.required,
          Validators.maxLength(2000),
          (c: AbstractControl) => (c.value.trim() ? null : { required: true }),
        ],
      ],
    },
    { validators: absenceRangeValidator },
  );
  success = '';
  error = '';
  saving = false;
  submit() {
    this.success = '';
    this.error = '';
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving) return;
    const v = this.form.getRawValue();
    this.saving = true;
    this.service
      .createRequest({
        type: v.type.trim(),
        startDate: v.departureDate,
        endDate: v.returnDate,
        startTime: v.allDay ? null : v.departureTime,
        endTime: v.allDay ? null : v.returnTime,
        reason: v.reason.trim(),
      })
      .subscribe({
        next: (request) => {
          this.form.reset();
          this.success = `Solicitud creada. Aprobador: ${request.approverName}. Puede consultarla en Mis solicitudes.`;
          this.saving = false;
          this.cdr.markForCheck();
        },
        error: (error: Error) => {
          this.error = error.message;
          this.saving = false;
          this.cdr.markForCheck();
        },
      });
  }
}
