import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestToolbarComponent } from './guest-toolbar.component';

describe('GuestToolbarComponent', () => {
  let component: GuestToolbarComponent;
  let fixture: ComponentFixture<GuestToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestToolbarComponent]
    });
    fixture = TestBed.createComponent(GuestToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
