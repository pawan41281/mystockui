import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorReportChart } from './contractor-report-chart';

describe('ContractorReportChart', () => {
  let component: ContractorReportChart;
  let fixture: ComponentFixture<ContractorReportChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorReportChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorReportChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
