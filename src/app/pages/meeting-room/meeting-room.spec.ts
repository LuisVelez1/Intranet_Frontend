import { of, throwError } from 'rxjs';
import { ReservationService } from '../../core/services/reservation.service';
import { UserService } from '../../core/services/user.service';
import { Reservation, ReservationRequest } from '../../core/models/reservation.model';
import { User } from '../../core/models/user.model';
import { MeetingRoomComponent } from './meeting-room';

describe('MeetingRoomComponent', () => {
  let component: MeetingRoomComponent;
  let reservations: jasmine.SpyObj<ReservationService>;
  let users: jasmine.SpyObj<UserService>;
  const owner: User = {
    id: 'owner-id',
    firstName: 'Owner',
    lastName: 'User',
    roles: ['USER'],
    loginTime: '2026-01-01',
  };
  const item = (id: string, bookedById = 'owner-id'): Reservation => ({
    id,
    date: '2026-01-01',
    startTime: '09:00',
    endTime: '10:00',
    bookedById,
    bookedBy: 'Owner',
    purpose: 'Planning',
    attendees: 2,
    room: 'Sala Principal',
    status: 'confirmada',
  });
  beforeEach(() => {
    reservations = jasmine.createSpyObj<ReservationService>('ReservationService', [
      'getByDate',
      'getUpcoming',
      'create',
      'cancel',
    ]);
    users = jasmine.createSpyObj<UserService>('UserService', ['getCurrentUser']);
    reservations.getByDate.and.returnValue(of([]));
    reservations.getUpcoming.and.returnValue(of([]));
    users.getCurrentUser.and.returnValue(of(owner));
    component = new MeetingRoomComponent(reservations, users);
  });
  it('loads the current user and reservations on initialization', () => {
    component.ngOnInit();
    expect(users.getCurrentUser).toHaveBeenCalled();
    expect(component.selectedDate).toBe(component.minDate);
    expect(reservations.getByDate).toHaveBeenCalledWith(component.selectedDate);
    expect(reservations.getUpcoming).toHaveBeenCalled();
  });
  it('allows owners and supported super-admin roles but denies unrelated users', () => {
    component.ngOnInit();
    const booking = item('r1');
    expect(component.canCancel(booking)).toBeTrue();
    users.getCurrentUser.and.returnValue(of({ ...owner, id: 'other-id', roles: ['USER'] }));
    component.ngOnInit();
    expect(component.canCancel(booking)).toBeFalse();
    users.getCurrentUser.and.returnValue(of({ ...owner, id: 'admin-id', roles: ['SUPER_ADMIN'] }));
    component.ngOnInit();
    expect(component.canCancel(booking)).toBeTrue();
    users.getCurrentUser.and.returnValue(
      of({ ...owner, id: 'role-admin-id', roles: ['ROLE_SUPER_ADMIN'] }),
    );
    component.ngOnInit();
    expect(component.canCancel(booking)).toBeTrue();
  });
  it('removes a cancelled reservation from both collections after success', () => {
    reservations.cancel.and.returnValue(of(item('r1')));
    component.allUpcoming = [item('r1'), item('r2')];
    component.reservationsByDate = [item('r1'), item('r3')];
    component.cancelReservation('r1');
    expect(reservations.cancel).toHaveBeenCalledWith('r1');
    expect(component.allUpcoming.map((value) => value.id)).toEqual(['r2']);
    expect(component.reservationsByDate.map((value) => value.id)).toEqual(['r3']);
  });
  it('alerts with the backend message when cancellation fails', () => {
    const alert = spyOn(window, 'alert');
    reservations.cancel.and.returnValue(throwError(() => ({ error: { message: 'Forbidden' } })));
    component.cancelReservation('r1');
    expect(alert).toHaveBeenCalledWith('Forbidden');
  });
  it('does not create a reservation when required values are missing', () => {
    component.newReservation = {};
    component.bookRoom();
    expect(reservations.create).not.toHaveBeenCalled();
  });
  it('sets a conflict error when the end time is not after the start time', () => {
    component.newReservation = {
      date: '2026-01-01',
      startTime: '10:00',
      endTime: '09:00',
      purpose: 'Planning',
      attendees: 2,
      room: 'Sala Principal',
    };
    component.bookRoom();
    expect(reservations.create).not.toHaveBeenCalled();
    expect(component.conflictError).toContain('hora de fin');
  });
  it('adds a successful booking to collections and sets the success message', () => {
    const created = item('r4');
    const request: ReservationRequest = {
      date: '2026-01-01',
      startTime: '11:00',
      endTime: '12:00',
      purpose: 'Planning',
      attendees: 2,
      room: 'Sala Principal',
    };
    reservations.create.and.returnValue(of(created));
    component.selectedDate = '2026-01-01';
    component.showForm = true;
    component.newReservation = request;
    component.bookRoom();
    expect(reservations.create).toHaveBeenCalledWith(request);
    expect(component.allUpcoming.map((value) => value.id)).toEqual(['r4']);
    expect(component.reservationsByDate.map((value) => value.id)).toEqual(['r4']);
    expect(component.loading).toBeFalse();
    expect(component.showForm).toBeFalse();
    expect(component.successMessage).toContain('reservada');
  });
  it('detects overlapping slots and returns a reservation matching its start time', () => {
    const booking = item('r1');
    component.reservationsByDate = [booking];
    expect(component.isSlotBooked('09:30', 'Sala Principal')).toBeTrue();
    expect(component.getSlotReservation('09:00', 'Sala Principal')).toBe(booking);
  });
});
