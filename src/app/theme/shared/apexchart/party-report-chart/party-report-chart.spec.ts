import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyReportChart } from './party-report-chart';

describe('PartyReportChart', () => {
  let component: PartyReportChart;
  let fixture: ComponentFixture<PartyReportChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyReportChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyReportChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
