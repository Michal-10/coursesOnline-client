import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnsLoginRegisterComponent } from './btns-login-register.component';

describe('BtnsLoginRegisterComponent', () => {
  let component: BtnsLoginRegisterComponent;
  let fixture: ComponentFixture<BtnsLoginRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnsLoginRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnsLoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
