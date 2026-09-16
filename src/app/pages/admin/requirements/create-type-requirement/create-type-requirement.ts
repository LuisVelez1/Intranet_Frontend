import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RequirementsService,
  RequirementType,
} from '../../../../core/services/requirements.service';
import { AreaService } from '../../../../core/services/area.service';
import { AreaResponse } from '../../../../core/models/area.model';

@Component({
  selector: 'app-create-type-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-type-requirement.html',
  styleUrl: './create-type-requirement.scss',
})
export class CreateTypeRequirementComponent implements OnInit {
  types: RequirementType[] = [];
  areas: AreaResponse[] = [];
  newType = { name: '', description: '', areaId: null as number | null };
  saving = false;

  constructor(
    private requirementsService: RequirementsService,
    private areaService: AreaService,
  ) {}

  ngOnInit(): void {
    this.loadTypes();
    this.loadAreas();
  }

  loadTypes(): void {
    this.requirementsService.getTypes().subscribe({
      next: (data) => (this.types = data),
      error: (err) => console.error('Error cargando tipos', err),
    });
  }

  loadAreas(): void {
    this.areaService.findAll().subscribe({
      next: (data) => (this.areas = data),
      error: (err) => console.error('Error cargando áreas', err),
    });
  }

  getAreaName(areaId?: number): string {
    if (!areaId) return '—';
    return this.areas.find((a) => a.id === areaId)?.name ?? '—';
  }

  addType(): void {
    if (!this.newType.name || !this.newType.areaId) return;
    this.saving = true;

    this.requirementsService
      .createType({
        name: this.newType.name,
        description: this.newType.description || undefined,
        areaId: this.newType.areaId,
      })
      .subscribe({
        next: (created) => {
          this.types.push(created);
          this.newType = { name: '', description: '', areaId: null };
          this.saving = false;
        },
        error: (err) => {
          console.error('Error creando tipo', err);
          this.saving = false;
        },
      });
  }

  removeType(id: number): void {
    this.requirementsService.deleteType(id).subscribe({
      next: () => (this.types = this.types.filter((t) => t.id !== id)),
      error: (err) => console.error('Error eliminando tipo', err),
    });
  }
}
