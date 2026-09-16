import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { LoadingService } from './core/services/loading.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the route outlet and react to loading state', () => {
    const fixture = TestBed.createComponent(App);
    const loading = TestBed.inject(LoadingService);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('router-outlet')).not.toBeNull();
    const spinner = element.querySelector('#splash-screen');
    expect(spinner).not.toBeNull();
    expect(spinner?.classList.contains('hide')).toBeTrue();
    loading.show();
    fixture.detectChanges();
    expect(spinner?.classList.contains('hide')).toBeFalse();
    loading.hide();
    fixture.detectChanges();
    expect(spinner?.classList.contains('hide')).toBeTrue();
  });
});
