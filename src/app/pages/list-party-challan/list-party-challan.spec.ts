import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartyChallan } from './list-party-challan';

describe('ListPartyChallan', () => {
  let component: ListPartyChallan;
  let fixture: ComponentFixture<ListPartyChallan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPartyChallan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPartyChallan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
