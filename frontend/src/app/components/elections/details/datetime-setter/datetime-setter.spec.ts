import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeSetter } from './datetime-setter';

describe('DatetimeSetter', () => {
  let component: DatetimeSetter;
  let fixture: ComponentFixture<DatetimeSetter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatetimeSetter],
    }).compileComponents();

    fixture = TestBed.createComponent(DatetimeSetter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
