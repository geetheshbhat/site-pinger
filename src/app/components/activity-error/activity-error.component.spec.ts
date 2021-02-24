import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityErrorComponent } from './activity-error.component';

describe('ActivityErrorComponent', () => {
  let component: ActivityErrorComponent;
  let fixture: ComponentFixture<ActivityErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
