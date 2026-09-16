import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AreaService } from '../../../../core/services/area.service';
import { AreaResponse } from '../../../../core/models/area.model';
import { UserService } from '../../../../core/services/user.service';
import {
  RequirementsService,
  RequirementType,
} from '../../../../core/services/requirements.service';

@Component({
  standalone: true,
  selector: 'app-create-requirement',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class CreateRequirementComponent implements OnInit {
  areas: AreaResponse[] = [];
  allTypes: RequirementType[] = [];
  filteredTypes: RequirementType[] = [];

  currentUserId = '';
  currentUserName = '';
  currentUserEmail = '';

  submitting = false;
  successMessage = '';
  errorMessage = '';

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private requirementsService: RequirementsService,
    private areaService: AreaService,
    private userService: UserService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      areaId: ['', Validators.required],
      typeId: ['', Validators.required],
      priority: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAreas();
    this.loadTypes();
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.currentUserName = `${user.firstName} ${user.lastName}`;
        this.currentUserEmail = user.email ?? '';
      },
      error: (err) => console.error('Error loading user', err),
    });
  }

  loadAreas(): void {
    this.areaService.findAll().subscribe({
      next: (data) => (this.areas = data),
      error: (err) => console.error('Error cargando áreas', err),
    });
  }

  loadTypes(): void {
    this.requirementsService.getTypes().subscribe({
      next: (data) => (this.allTypes = data),
      error: (err) => console.error('Error cargando tipos', err),
    });
  }

  onAreaChange(areaId: string): void {
    this.form.patchValue({ typeId: '' });
    if (!areaId) {
      this.filteredTypes = [];
      return;
    }
    this.requirementsService.getTypesByArea(Number(areaId)).subscribe({
      next: (types) => (this.filteredTypes = types),
      error: (err) => console.error('Error cargando tipos', err),
    });
  }

  submit(): void {
    this.submitting = true;
    this.errorMessage = '';

    const payload = {
      title: this.form.value.title,
      description: this.form.value.description,
      areaId: Number(this.form.value.areaId),
      typeId: Number(this.form.value.typeId),
      priority: this.form.value.priority,
    };

    this.requirementsService.create(payload, this.currentUserId).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = '✅ Requerimiento creado exitosamente.';
        this.form.reset();
        this.filteredTypes = [];

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/requeriments/my-requeriments']);
        }, 1500);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = '❌ Error al crear el requerimiento. Intenta de nuevo.';
        console.error(err);
      },
    });
  }
}
