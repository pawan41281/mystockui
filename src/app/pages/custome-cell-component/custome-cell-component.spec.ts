import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeCellComponent } from './custome-cell-component';

describe('CustomeCellComponent', () => {
  let component: CustomeCellComponent;
  let fixture: ComponentFixture<CustomeCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomeCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomeCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
