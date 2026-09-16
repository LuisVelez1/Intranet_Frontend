import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { UserA } from '../../../core/models/user-admin.model';
import { SITES } from '../../../core/constants/sites.constants';

@Component({
  selector: 'app-update-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './update-users.html',
  styleUrls: ['./update-users.scss'],
})
export class UpdateUsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  loading = false;
  error: string | null = null;
  success: string | null = null;
  showDropdown = false;
  areasLoaded = false;
  sedes = SITES;

  users: UserA[] = [];
  filteredUsers: UserA[] = [];
  selectedUserId: string | null = null;
  areas: any[] = [];

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['ADMIN', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    position: ['', Validators.required],
    sede: ['', Validators.required],
    areaId: [null as number | null, Validators.required],
    birthDate: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadAreas();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllAdminUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
      },
    });
  }

  search(term: string) {
    const value = term.toLowerCase().trim();

    this.filteredUsers = this.users.filter((u) => (u.fullName || '').toLowerCase().includes(value));

    this.showDropdown = true;
  }

  selectUser(user: UserA) {
    this.selectedUserId = user.id;

    this.userService.getUserById(user.id).subscribe({
      next: (u) => {
        const birth = u.birthDate ? new Date(u.birthDate).toISOString().split('T')[0] : '';

        this.form.patchValue({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone || '',
          position: u.position,
          sede: u.sede,
          areaId: u.areaId ?? null,
          birthDate: birth,
        });
      },
    });

    this.showDropdown = false;
  }

  loadAreas() {
    this.userService.getAreas().subscribe({
      next: (data) => {
        this.areas = data;
        this.areasLoaded = true;
      },
      error: (err) => console.error(err),
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

    const raw = this.form.getRawValue();

    const payload: any = {
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      position: raw.position,
      sede: raw.sede,
      areaId: raw.areaId !== null && raw.areaId !== undefined ? Number(raw.areaId) : undefined,
      birthDate: raw.birthDate ? new Date(raw.birthDate).toISOString().split('T')[0] : null,
    };

    if (!this.selectedUserId) {
      this.error = 'Debes seleccionar un usuario primero';
      this.loading = false;
      return;
    }

    this.userService.updateAdminUser(this.selectedUserId!, payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Usuario actualizado correctamente';
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = err?.error?.message || 'Error al actualizar el usuario';
      },
    });
  }

  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}
