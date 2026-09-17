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
import { reverseAuthGuard } from './reverse.guard';

describe('reverseAuthGuard', () => {
  let session: jasmine.SpyObj<SessionService>;
  let router: Router;
  beforeEach(() => {
    session = jasmine.createSpyObj<SessionService>('SessionService', [
      'getToken',
      'isTokenExpired',
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
      reverseAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    ) as boolean | UrlTree;
  }
  it('redirects an active session to home', () => {
    session.getToken.and.returnValue('valid');
    session.isTokenExpired.and.returnValue(false);
    expect(router.serializeUrl(runGuard() as UrlTree)).toBe('/home');
  });
  it('allows access when no token exists', () => {
    session.getToken.and.returnValue(null);
    expect(runGuard()).toBeTrue();
  });
  it('allows access when the token is expired', () => {
    session.getToken.and.returnValue('expired');
    session.isTokenExpired.and.returnValue(true);
    expect(runGuard()).toBeTrue();
  });
});
