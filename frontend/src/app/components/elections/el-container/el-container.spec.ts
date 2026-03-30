import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElContainer } from './el-container';

describe('ElContainer', () => {
  let component: ElContainer;
  let fixture: ComponentFixture<ElContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ElContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
