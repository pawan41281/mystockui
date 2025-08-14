import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyChallanRegisterComponent } from './party-challan-register-component';

describe('PartyChallanRegisterComponent', () => {
  let component: PartyChallanRegisterComponent;
  let fixture: ComponentFixture<PartyChallanRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyChallanRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyChallanRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
