import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { API_ENDPOINTS } from '../constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl = API_ENDPOINTS.news;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platform: Object,
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(data: any, file?: File): Observable<any> {
    const formData = new FormData();

    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    if (file) {
      formData.append('file', file);
    }

    return this.http.post(this.apiUrl, formData);
  }

  update(id: number, data: any, file?: File): Observable<any> {
    const formData = new FormData();

    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    if (file) {
      formData.append('file', file);
    }

    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
