import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContractorChallan } from './create-contractor-challan';

describe('CreateContractorChallan', () => {
  let component: CreateContractorChallan;
  let fixture: ComponentFixture<CreateContractorChallan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContractorChallan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateContractorChallan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
