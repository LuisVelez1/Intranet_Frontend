import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { SessionService } from '../core/services/session.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let session: jasmine.SpyObj<SessionService>;
  let router: Router;
  beforeEach(() => {
    session = jasmine.createSpyObj<SessionService>('SessionService', [
      'getToken',
      'isTokenExpired',
      'clearSession',
    ]);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: SessionService, useValue: session },
      ],
    });
    router = TestBed.inject(Router);
  });
  function runGuard(): boolean | UrlTree {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    ) as boolean | UrlTree;
  }
  it('redirects to login when no token exists', () => {
    session.getToken.and.returnValue(null);
    expect(router.serializeUrl(runGuard() as UrlTree)).toBe('/auth/login');
  });
  it('clears an expired session and redirects to login', () => {
    session.getToken.and.returnValue('expired');
    session.isTokenExpired.and.returnValue(true);
    expect(router.serializeUrl(runGuard() as UrlTree)).toBe('/auth/login');
    expect(session.clearSession).toHaveBeenCalled();
  });
  it('allows a valid token', () => {
    session.getToken.and.returnValue('valid');
    session.isTokenExpired.and.returnValue(false);
    expect(runGuard()).toBeTrue();
  });
});
