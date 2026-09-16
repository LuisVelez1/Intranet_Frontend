import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { AGENT_KEYWORDS } from '../../core/constants/agents-keywords.constants';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './requirements.html',
  styleUrl: './requirements.scss',
})
export class RequirementsComponent implements OnInit {
  currentUser: User | null = null;

  private readonly AGENT_KEYWORDS = AGENT_KEYWORDS;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user),
      error: (err) => console.error('Error loading user', err),
    });
  }

  get isAgent(): boolean {
    if (!this.currentUser?.position) return false;
    const pos = this.currentUser.position.toLowerCase();
    return this.AGENT_KEYWORDS.some((k) => pos.includes(k));
  }

  get isSuperAdmin(): boolean {
    return this.currentUser?.roles?.includes('SUPER_ADMIN') ?? false;
  }
}
