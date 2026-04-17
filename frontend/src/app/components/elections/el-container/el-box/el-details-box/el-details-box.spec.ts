import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElDetailsBox } from './el-details-box';

describe('ElDetailsBox', () => {
  let component: ElDetailsBox;
  let fixture: ComponentFixture<ElDetailsBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElDetailsBox],
    }).compileComponents();

    fixture = TestBed.createComponent(ElDetailsBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
