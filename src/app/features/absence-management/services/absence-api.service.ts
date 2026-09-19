import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { AbsenceCreateRequest, AbsenceResponse } from '../models/absence-api';
@Injectable({ providedIn: 'root' })
export class AbsenceApiService {
  private readonly http = inject(HttpClient);
  private readonly url = API_ENDPOINTS.absences;
  getMyRequests() {
    return this.http.get<AbsenceResponse[]>(`${this.url}/my`);
  }
  getPendingApprovals() {
    return this.http.get<AbsenceResponse[]>(`${this.url}/pending`);
  }
  createRequest(request: AbsenceCreateRequest) {
    return this.http.post<AbsenceResponse>(this.url, request);
  }
  approveRequest(id: string, comment = '') {
    return this.http.put<AbsenceResponse>(`${this.url}/${encodeURIComponent(id)}/approve`, {
      comment,
    });
  }
  rejectRequest(id: string, comment = '') {
    return this.http.put<AbsenceResponse>(`${this.url}/${encodeURIComponent(id)}/reject`, {
      comment,
    });
  }
}
