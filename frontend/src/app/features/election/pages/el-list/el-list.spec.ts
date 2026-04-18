import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElList } from './el-list';

describe('ElList', () => {
  let component: ElList;
  let fixture: ComponentFixture<ElList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElList],
    }).compileComponents();

    fixture = TestBed.createComponent(ElList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
