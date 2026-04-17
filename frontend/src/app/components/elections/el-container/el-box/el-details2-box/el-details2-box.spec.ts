import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElDetails2Box } from './el-details2-box';

describe('ElDetails2Box', () => {
  let component: ElDetails2Box;
  let fixture: ComponentFixture<ElDetails2Box>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElDetails2Box],
    }).compileComponents();

    fixture = TestBed.createComponent(ElDetails2Box);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
