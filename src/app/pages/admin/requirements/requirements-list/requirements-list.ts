import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AreaService } from '../../../../core/services/area.service';
import { AreaResponse } from '../../../../core/models/area.model';
import {
  RequirementResponse,
  RequirementsService,
  RequirementType,
} from '../../../../core/services/requirements.service';

@Component({
  selector: 'app-requirements-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './requirements-list.html',
  styleUrl: './requirements-list.scss',
})
export class RequirementListComponent implements OnInit {
  requirements: RequirementResponse[] = [];
  filtered: RequirementResponse[] = [];
  areas: AreaResponse[] = [];
  types: RequirementType[] = [];
  loading = true;

  // Drawer edición
  drawerOpen = false;
  editForm: any = {};
  editingReq: RequirementResponse | null = null;
  saving = false;

  // Modal eliminación
  reqToDelete: RequirementResponse | null = null;

  filtersForm: FormGroup;

  constructor(
    private requirementsService: RequirementsService,
    private areaService: AreaService,
    private fb: FormBuilder,
  ) {
    this.filtersForm = this.fb.group({
      area: [''],
      status: [''],
      priority: [''],
    });
  }

  ngOnInit(): void {
    this.loadAreas();
    this.loadTypes();
    this.loadRequirements();
    this.filtersForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadAreas(): void {
    this.areaService.findAll().subscribe({
      next: (data) => (this.areas = data),
      error: (err) => console.error('Error cargando áreas', err),
    });
  }

  loadTypes(): void {
    this.requirementsService.getTypes().subscribe({
      next: (data) => (this.types = data),
      error: (err) => console.error('Error cargando tipos', err),
    });
  }

  loadRequirements(): void {
    this.loading = true;
    this.requirementsService.getAll().subscribe({
      next: (data) => {
        this.requirements = data;
        this.filtered = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando requerimientos', err);
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const { area, status, priority } = this.filtersForm.value;
    this.filtered = this.requirements.filter((r) => {
      const okArea = !area || r.areaId === Number(area);
      const okStatus = !status || r.status === status;
      const okPriority = !priority || r.priority === priority;
      return okArea && okStatus && okPriority;
    });
  }

  clearFilters(): void {
    this.filtersForm.reset({ area: '', status: '', priority: '' });
    this.loadRequirements();
  }

  // ── Editar ───────────────────────────────
  openEdit(req: RequirementResponse): void {
    this.editingReq = req;
    this.editForm = {
      title: req.title,
      description: req.description,
      areaId: req.areaId,
      typeId: req.typeId,
      priority: req.priority,
      status: req.status,
      assignedTo: req.assignedToId ?? '',
    };
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editingReq = null;
    this.editForm = {};
  }

  saveEdit(): void {
    if (!this.editingReq) return;
    this.saving = true;

    const payload = {
      ...this.editForm,
      areaId: Number(this.editForm.areaId),
      typeId: Number(this.editForm.typeId),
      assignedTo: this.editForm.assignedTo || undefined,
    };

    this.requirementsService.update(this.editingReq.id, payload).subscribe({
      next: (updated) => {
        const idx = this.requirements.findIndex((r) => r.id === updated.id);
        if (idx !== -1) this.requirements[idx] = updated;
        this.applyFilters();
        this.saving = false;
        this.closeDrawer();
      },
      error: (err) => {
        console.error('Error actualizando requerimiento', err);
        this.saving = false;
      },
    });
  }

  // ── Eliminar ─────────────────────────────
  confirmDelete(req: RequirementResponse): void {
    this.reqToDelete = req;
  }

  cancelDelete(): void {
    this.reqToDelete = null;
  }

  executeDelete(): void {
    if (!this.reqToDelete) return;

    this.requirementsService.delete(this.reqToDelete.id).subscribe({
      next: () => {
        this.requirements = this.requirements.filter((r) => r.id !== this.reqToDelete!.id);
        this.applyFilters();
        this.reqToDelete = null;
      },
      error: (err) => console.error('Error eliminando requerimiento', err),
    });
  }

  // ── Helpers ──────────────────────────────
  translateStatus(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En progreso',
      COMPLETED: 'Completado',
      REJECTED: 'Rechazado',
    };
    return map[status] ?? status;
  }

  translatePriority(priority: string): string {
    const map: Record<string, string> = {
      BAJA: 'Baja',
      MEDIA: 'Media',
      ALTA: 'Alta',
      CRITICA: 'Crítica',
    };
    return map[priority] ?? priority;
  }
}
