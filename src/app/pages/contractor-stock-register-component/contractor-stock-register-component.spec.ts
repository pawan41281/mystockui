import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorStockRegisterComponent } from './contractor-stock-register-component';

describe('ContractorStockRegisterComponent', () => {
  let component: ContractorStockRegisterComponent;
  let fixture: ComponentFixture<ContractorStockRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorStockRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorStockRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
