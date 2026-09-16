import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../../core/services/user.service';
import { UserA } from '../../../core/models/user-admin.model';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users: UserA[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllAdminUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.loading = false;
      },
    });
  }
}
