import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { LoginInfo } from '../models/login-info.models';

describe('SessionService', () => {
  let service: SessionService;
  const loginInfo: LoginInfo = {
    id: 'u1',
    token:
      'header.' +
      btoa(JSON.stringify({ sub: 'OWNER', exp: Math.floor(Date.now() / 1000) + 3600 })) +
      '.signature',
    firstName: 'First',
    lastName: 'Last',
    roles: ['ROLE_ADMIN'],
    loginTime: '2026-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), SessionService],
    });
    service = TestBed.inject(SessionService);
  });
  afterEach(() => localStorage.clear());

  it('stores login information and a separate token and emits the value', () => {
    let emitted: LoginInfo | null | undefined;
    service.loginInfo$.subscribe((value) => (emitted = value));
    service.setLoginInfo(loginInfo);
    expect(JSON.parse(localStorage.getItem('loginInfo') ?? '{}')).toEqual(loginInfo);
    expect(localStorage.getItem('token')).toBe(loginInfo.token ?? null);
    expect(emitted).toEqual(loginInfo);
  });

  it('reads stored token and login information', () => {
    service.setLoginInfo(loginInfo);
    expect(service.getToken()).toBe(loginInfo.token ?? null);
    expect(service.getLoginInfo()).toEqual(loginInfo);
  });

  it('falls back to the current in-memory login information when storage is absent', () => {
    service.setLoginInfo(loginInfo);
    localStorage.removeItem('loginInfo');

    expect(service.getLoginInfo()).toEqual(loginInfo);
  });
  it('returns the first role without the ROLE_ prefix', () => {
    service.setLoginInfo(loginInfo);
    expect(service.getRole()).toBe('ADMIN');
  });
  it('returns null when no role exists', () => {
    service.setLoginInfo({ ...loginInfo, roles: [] });
    expect(service.getRole()).toBeNull();
  });

  it('clears stored session data and emits null', () => {
    service.setLoginInfo(loginInfo);
    let emitted: LoginInfo | null = loginInfo;
    service.loginInfo$.subscribe((value) => (emitted = value));
    service.clearSession();
    expect(localStorage.getItem('loginInfo')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(emitted).toBeNull();
  });

  it('reports no token as expired', () => expect(service.isTokenExpired()).toBeTrue());
  it('reports a future token expiration as valid', () => {
    localStorage.setItem(
      'token',
      'header.' +
        btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })) +
        '.signature',
    );
    expect(service.isTokenExpired()).toBeFalse();
  });
  it('reports a past token expiration as expired', () => {
    localStorage.setItem(
      'token',
      'header.' +
        btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 3600 })) +
        '.signature',
    );
    expect(service.isTokenExpired()).toBeTrue();
  });

  it('clears malformed tokens and reports them as expired', () => {
    const warning = spyOn(console, 'warn');
    localStorage.setItem('token', 'malformed');
    expect(service.isTokenExpired()).toBeTrue();
    expect(localStorage.getItem('token')).toBeNull();
    expect(warning).toHaveBeenCalled();
  });
});
