import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorOpeningStock } from './contractor-opening-stock';

describe('ContractorOpeningStock', () => {
  let component: ContractorOpeningStock;
  let fixture: ComponentFixture<ContractorOpeningStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorOpeningStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorOpeningStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
