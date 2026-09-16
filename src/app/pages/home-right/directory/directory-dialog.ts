import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

interface UserWithFullName extends User {
  fullName: string;
}

@Component({
  selector: 'app-directory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './directory-dialog.html',
  styleUrls: ['./directory-dialog.scss'],
})
export class DirectoryDialogComponent implements OnInit {
  searchText = '';
  employees: UserWithFullName[] = [];
  filteredEmployees: UserWithFullName[] = [];

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<DirectoryDialogComponent>,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getAllAdminUsers().subscribe({
      next: (users) => {
        this.employees = users.map((u) => ({
          ...u,
          fullName: `${u.firstName} ${u.lastName}`,
        }));
        this.filteredEmployees = [...this.employees];
      },
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  filterEmployees() {
    const text = this.searchText.toLowerCase();
    this.filteredEmployees = this.employees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(text) ||
        (e.position?.toLowerCase().includes(text) ?? false),
    );
  }

  clearSearch() {
    this.searchText = '';
    this.filteredEmployees = [...this.employees];
  }

  close() {
    this.dialogRef.close();
  }
}
