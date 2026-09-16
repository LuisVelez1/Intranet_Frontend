export interface PasswordCredentials {
  email: string;
  newPassword: string;
}

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { UserA } from '../../../core/models/user-admin.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePasswordComponent implements OnInit {
  private userService = inject(UserService);

  searchText = '';
  users: UserA[] = [];
  filteredUsers: UserA[] = [];
  selectedUser: UserA | null = null;
  newPassword = '';
  message: string | null = null;

  ngOnInit() {
    this.userService.getAllAdminUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  filterUsers() {
    const text = this.searchText.toLowerCase();

    this.filteredUsers = this.users.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(text),
    );
  }

  selectUser(user: UserA) {
    this.selectedUser = user;
    this.searchText = `${user.firstName} ${user.lastName}`;
    this.filteredUsers = [];
  }

  onSubmit() {
    if (!this.selectedUser || !this.newPassword) return;

    this.userService.changePassword(this.selectedUser.id, this.newPassword).subscribe({
      next: () => {
        this.message = 'Contraseña actualizada exitosamente';
        this.newPassword = '';
      },
      error: () => {
        this.message = 'Error al actualizar la contraseña';
      },
    });
  }

  clearSelection() {
    this.selectedUser = null;
    this.searchText = '';
    this.newPassword = '';
    this.filteredUsers = this.users;
  }
}
