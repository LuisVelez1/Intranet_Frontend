import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { SITES } from '../../../core/constants/sites.constants';

@Component({
  selector: 'app-create-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.scss'],
})
export class CreateUsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  loading = false;
  error: string | null = null;
  success: string | null = null;
  sedes = SITES;

  areas: any[] = [];

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    cedula: ['', [Validators.required, Validators.pattern(/^[0-9]{6,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['ADMIN', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    position: ['', Validators.required],
    sede: ['', Validators.required],
    areaId: ['', Validators.required],
    birthDate: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas() {
    this.userService.getAreas().subscribe({
      next: (data) => (this.areas = data),
      error: (err) => console.error('Error al cargar áreas', err),
    });
  }

  submit() {
    if (this.loading) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const rawValues = this.form.getRawValue();

    const payload = {
      ...rawValues,
      areaId: Number(rawValues.areaId),
      birthDate: rawValues.birthDate
        ? new Date(rawValues.birthDate).toISOString().split('T')[0]
        : null,
    };

    this.userService.createAdminUser(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Usuario creado correctamente';
        this.form.reset({
          role: 'ADMIN',
          sede: 'Armenia',
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = err?.error?.message || 'Error al crear el usuario';
      },
    });
  }
}
