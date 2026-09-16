import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface RequirementComment {
  id: number;
  userId: string;
  author: string;
  comment: string;
  createdAt: string;
}

export interface RequirementType {
  id: number;
  name: string;
  description?: string;
  areaId?: number;
}

export interface RequirementResponse {
  id: number;
  title: string;
  description: string;
  areaId: number;
  areaName: string;
  typeId: number;
  typeName: string;
  status: string;
  priority: string;
  createdById: string;
  createdByName: string;
  assignedToId?: string;
  assignedToName?: string;
  dueDate?: string;
  createdAt: string;
  active: boolean;
}

export interface RequirementCreateRequest {
  title: string;
  description: string;
  areaId: number;
  typeId: number;
  priority: string;
  dueDate?: string;
}

export interface RequirementUpdateRequest {
  title?: string;
  description?: string;
  areaId?: number;
  typeId?: number;
  priority?: string;
  status?: string;
  assignedTo?: string;
  dueDate?: string;
}

@Injectable({ providedIn: 'root' })
export class RequirementsService {
  private base = API_ENDPOINTS.requirements;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RequirementResponse[]> {
    return this.http.get<RequirementResponse[]>(this.base);
  }

  getMy(userId: string): Observable<RequirementResponse[]> {
    return this.http.get<RequirementResponse[]>(`${this.base}/my`, {
      params: { userId },
    });
  }

  getByArea(areaId: number): Observable<RequirementResponse[]> {
    return this.http.get<RequirementResponse[]>(`${this.base}/area/${areaId}`);
  }

  getById(id: number): Observable<RequirementResponse> {
    return this.http.get<RequirementResponse>(`${this.base}/${id}`);
  }

  create(request: RequirementCreateRequest, userId: string): Observable<RequirementResponse> {
    return this.http.post<RequirementResponse>(this.base, request, {
      params: { userId },
    });
  }

  update(id: number, request: RequirementUpdateRequest): Observable<RequirementResponse> {
    return this.http.put<RequirementResponse>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getTypes(): Observable<RequirementType[]> {
    return this.http.get<RequirementType[]>(`${this.base}/types`);
  }

  createType(request: {
    name: string;
    description?: string;
    areaId?: number;
  }): Observable<RequirementType> {
    return this.http.post<RequirementType>(`${this.base}/types`, request);
  }

  getTypesByArea(areaId: number): Observable<RequirementType[]> {
    return this.http.get<RequirementType[]>(`${this.base}/types/by-area/${areaId}`);
  }

  deleteType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/types/${id}`);
  }

  createComment(requirementId: number, comment: string): Observable<RequirementComment> {
    return this.http.post<RequirementComment>(`${this.base}/${requirementId}/comments`, {
      comment,
    });
  }

  getComments(requirementId: number): Observable<RequirementComment[]> {
    return this.http.get<RequirementComment[]>(`${this.base}/${requirementId}/comments`);
  }
}
