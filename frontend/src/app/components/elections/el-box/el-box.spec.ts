import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElBox } from './el-box';

describe('ElBox', () => {
  let component: ElBox;
  let fixture: ComponentFixture<ElBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElBox],
    }).compileComponents();

    fixture = TestBed.createComponent(ElBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
