import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { MESSAGES } from '../constants/messages.constants';

describe('errorInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let router: Router;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });
  afterEach(() => localStorage.clear());
  it('clears storage, navigates to login, and annotates 401 errors', () => {
    const navigation = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    localStorage.setItem('token', 'token');
    localStorage.setItem('unrelated', 'value');
    let actual: { status: number; customMessage: string } | undefined;
    client.get('/private').subscribe({ error: (error) => (actual = error) });
    http
      .expectOne('/private')
      .flush({ message: 'expired' }, { status: 401, statusText: 'Unauthorized' });
    expect(localStorage.length).toBe(0);
    expect(navigation).toHaveBeenCalledWith(['/auth/login']);
    expect(actual?.status).toBe(401);
    expect(actual?.customMessage).toBe('Sesión expirada');
  });
  it('preserves the original error and uses the generic message for non-401 responses', () => {
    let actual: { status: number; error: { message: string }; customMessage: string } | undefined;
    client.get('/private').subscribe({ error: (error) => (actual = error) });
    http
      .expectOne('/private')
      .flush({ message: 'server failure' }, { status: 500, statusText: 'Server Error' });
    expect(actual?.status).toBe(500);
    expect(actual?.error.message).toBe('server failure');
    expect(actual?.customMessage).toBe(MESSAGES.ERROR_GENERIC);
    expect(router.url).not.toBe('/auth/login');
  });
});
