import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorChallanRegisterComponent } from './contractor-challan-register-component';

describe('ContractorChallanRegisterComponent', () => {
  let component: ContractorChallanRegisterComponent;
  let fixture: ComponentFixture<ContractorChallanRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorChallanRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorChallanRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
