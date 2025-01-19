import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotDashboardComponent } from './pivot-dashboard.component';

describe('PivotDashboardComponent', () => {
  let component: PivotDashboardComponent;
  let fixture: ComponentFixture<PivotDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PivotDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PivotDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
