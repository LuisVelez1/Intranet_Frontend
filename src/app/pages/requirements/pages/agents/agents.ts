import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { UserA } from '../../../../core/models/user-admin.model';
import { AGENT_KEYWORDS } from '../../../../core/constants/agents-keywords.constants';

@Component({
  standalone: true,
  selector: 'app-agents',
  imports: [CommonModule],
  templateUrl: './agents.html',
  styleUrl: './agents.scss',
})
export class AgentsComponent implements OnInit {
  allUsers: UserA[] = [];
  agents: UserA[] = [];
  loading = true;

  private readonly AGENT_KEYWORDS = AGENT_KEYWORDS;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.userService.getAllAdminUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.agents = users.filter(
          (u) =>
            u.position && this.AGENT_KEYWORDS.some((k) => u.position!.toLowerCase().includes(k)),
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando agentes', err);
        this.loading = false;
      },
    });
  }

  getInitials(user: UserA): string {
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
  }

  getAreaName(user: UserA): string {
    return (user as any).areaName ?? (user as any).area ?? 'Sin área';
  }
}
