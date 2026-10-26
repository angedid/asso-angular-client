import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationCallbackComponent } from './authorization-callback.component';

describe('AuthorizationCallbackComponent', () => {
  let component: AuthorizationCallbackComponent;
  let fixture: ComponentFixture<AuthorizationCallbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizationCallbackComponent]
    });
    fixture = TestBed.createComponent(AuthorizationCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
