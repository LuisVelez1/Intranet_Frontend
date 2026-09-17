import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthResponse, AuthService } from './auth.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { LoginCredentials } from '../../pages/login/login';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  const response: AuthResponse = {
    token: 'token',
    user: 'OWNER',
    firstName: 'First',
    lastName: 'Last',
    roles: ['ROLE_USER'],
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('trims and uppercases the username and trims the password before login', () => {
    const credentials: LoginCredentials = { username: ' owner ', password: ' secret ' };
    service.login(credentials).subscribe();
    const request = http.expectOne(API_ENDPOINTS.auth + '/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ usuario: 'OWNER', password: 'secret' });
    request.flush(response);
  });

  it('stores session values and returns the backend response after login', () => {
    let actual: AuthResponse | undefined;
    service.login({ username: 'owner', password: 'secret' }).subscribe((value) => (actual = value));
    http.expectOne(API_ENDPOINTS.auth + '/login').flush(response);
    expect(actual).toEqual(response);
    expect(localStorage.getItem('token')).toBe('token');
    expect(localStorage.getItem('user')).toBe('OWNER');
    expect(localStorage.getItem('firstName')).toBe('First');
    expect(localStorage.getItem('lastName')).toBe('Last');
    expect(localStorage.getItem('roles')).toBe(JSON.stringify(['ROLE_USER']));
  });

  it('returns the stored token and evaluates role helpers from browser session state', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('roles', JSON.stringify(['ROLE_USER', 'ROLE_ADMIN']));
    expect(service.getToken()).toBe('stored-token');
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getRoles()).toEqual(['ROLE_USER', 'ROLE_ADMIN']);
    expect(service.hasRole('ROLE_ADMIN')).toBeTrue();
    expect(service.hasRole('ROLE_SUPER_ADMIN')).toBeFalse();
  });

  it('returns an empty role list when roles are absent', () =>
    expect(service.getRoles()).toEqual([]));

  it('clears all local storage on logout to preserve current behavior', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('unrelated', 'value');
    service.logout();
    expect(localStorage.length).toBe(0);
  });

  it('keeps the current local change-password response without an HTTP request', () => {
    let message = '';
    service
      .changePassword({ email: 'owner@example.test', newPassword: 'new' })
      .subscribe((value) => (message = value.message));
    expect(message).toContain('actualizada');
    http.expectNone(() => true);
  });
});
