import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElCard } from './el-card';

describe('ElCard', () => {
  let component: ElCard;
  let fixture: ComponentFixture<ElCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ElCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
