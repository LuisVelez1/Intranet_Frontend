import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_ENDPOINTS } from '../constants/api.constants';
import { ReservationRequest } from '../models/reservation.model';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ReservationService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ReservationService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('requests reservations by date with the current endpoint and query parameter', () => {
    service.getByDate('2026-01-01').subscribe();
    const req = http.expectOne(
      (request) => request.url === API_ENDPOINTS.reservations + '/by-date',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('date')).toBe('2026-01-01');
    req.flush([]);
  });
  it('requests upcoming reservations from the current endpoint', () => {
    service.getUpcoming().subscribe();
    const req = http.expectOne(API_ENDPOINTS.reservations + '/upcoming');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
  it('posts reservation requests without changing the body', () => {
    const reservation: ReservationRequest = {
      date: '2026-01-01',
      startTime: '09:00',
      endTime: '10:00',
      purpose: 'Planning',
      attendees: 3,
      room: 'Sala Principal',
    };
    service.create(reservation).subscribe();
    const req = http.expectOne(API_ENDPOINTS.reservations);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reservation);
    req.flush({
      ...reservation,
      id: 'r1',
      bookedById: 'u1',
      bookedBy: 'Owner',
      status: 'confirmada',
    });
  });
  it('cancels a reservation with the current PATCH endpoint and empty body', () => {
    service.cancel('r1').subscribe();
    const req = http.expectOne(API_ENDPOINTS.reservations + '/r1/cancel');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush({ id: 'r1' });
  });
});
