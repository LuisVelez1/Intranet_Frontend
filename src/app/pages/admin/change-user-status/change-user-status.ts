import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { UserA } from '../../../core/models/user-admin.model';

@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-user-status.html',
  styleUrls: ['./change-user-status.scss'],
})
export class ChangeUserStatusComponent implements OnInit {
  private userService = inject(UserService);

  users: UserA[] = [];
  filteredUsers: UserA[] = [];

  searchText = '';
  selectedUser: UserA | null = null;

  newStatus: 'ACTIVE' | 'INACTIVE' | null = null;

  success: string | null = null;
  error: string | null = null;
  loading = false;

  ngOnInit() {
    this.userService.getAllAdminUsersInactive().subscribe((users) => {
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
    this.success = null;
    this.error = null;
  }

  submit() {
    if (!this.selectedUser || !this.newStatus) return;

    this.loading = true;
    this.success = null;
    this.error = null;

    this.userService.changeUserStatus(this.selectedUser.id, this.newStatus).subscribe({
      next: () => {
        const accion = this.newStatus === 'ACTIVE' ? 'activado' : 'desactivado';
        this.success = `Usuario ${accion} correctamente`;

        this.loading = false;
        this.selectedUser = null;
        this.searchText = '';
        this.newStatus = null;
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado del usuario';
        this.loading = false;
      },
    });
  }

  clearSelection() {
    this.selectedUser = null;
    this.searchText = '';
    this.newStatus = null;
    this.filteredUsers = this.users;
    this.success = null;
    this.error = null;
  }
}
