import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePartyChallan } from './create-party-challan';

describe('CreatePartyChallan', () => {
  let component: CreatePartyChallan;
  let fixture: ComponentFixture<CreatePartyChallan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePartyChallan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePartyChallan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
