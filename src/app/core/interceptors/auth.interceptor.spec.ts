import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { SessionService } from '../services/session.service';

describe('authInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let session: jasmine.SpyObj<SessionService>;
  beforeEach(() => {
    session = jasmine.createSpyObj<SessionService>('SessionService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: SessionService, useValue: session },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('adds a Bearer authorization header when a token exists', () => {
    session.getToken.and.returnValue('token');
    client.post('/test', { value: 1 }).subscribe();
    const req = http.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    expect(req.request.body).toEqual({ value: 1 });
    req.flush({ ok: true });
  });
  it('preserves request properties and body when adding authorization', () => {
    session.getToken.and.returnValue('token');
    client.get('/test', { params: { page: '1' } }).subscribe();
    const req = http.expectOne((request) => request.url === '/test');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush([]);
  });
  it('does not add authorization when no token exists', () => {
    session.getToken.and.returnValue(null);
    client.get('/test').subscribe();
    const req = http.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({ ok: true });
  });
});
