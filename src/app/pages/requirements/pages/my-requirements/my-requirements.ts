import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  RequirementsService,
  RequirementResponse,
} from '../../../../core/services/requirements.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  standalone: true,
  selector: 'app-my-requirements',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-requirements.html',
  styleUrl: './my-requirements.scss',
})
export class MyRequirementsComponent implements OnInit {
  requirements: RequirementResponse[] = [];
  loading = true;
  currentUserId = '';

  constructor(
    private requirementsService: RequirementsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.loadMyRequirements(user.id);
      },
      error: (err) => console.error('Error loading user', err),
    });
  }

  loadMyRequirements(userId: string): void {
    this.loading = true;
    this.requirementsService.getMy(userId).subscribe({
      next: (data) => {
        this.requirements = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando requerimientos', err);
        this.loading = false;
      },
    });
  }

  cancelRequirement(req: RequirementResponse): void {
    if (!confirm(`¿Cancelar el requerimiento "${req.title}"?`)) return;

    this.requirementsService.update(req.id, { status: 'REJECTED' }).subscribe({
      next: (updated) => {
        const idx = this.requirements.findIndex((r) => r.id === updated.id);
        if (idx !== -1) this.requirements[idx] = updated;
      },
      error: (err) => console.error('Error cancelando requerimiento', err),
    });
  }

  canCancel(req: RequirementResponse): boolean {
    return req.status === 'PENDING' && req.createdById === this.currentUserId;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: '🕐 Pendiente',
      IN_PROGRESS: '⚙️ En proceso',
      COMPLETED: '✅ Completado',
      REJECTED: '❌ Rechazado',
    };
    return map[status] ?? status;
  }

  getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      BAJA: '🟢',
      MEDIA: '🟡',
      ALTA: '🟠',
      CRITICA: '🔴',
    };
    return icons[priority] ?? '⚪';
  }

  getPriorityLabel(priority: string): string {
    const map: Record<string, string> = {
      BAJA: 'Baja',
      MEDIA: 'Media',
      ALTA: 'Alta',
      CRITICA: 'Crítica',
    };
    return map[priority] ?? priority;
  }
}
