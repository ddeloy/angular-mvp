import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppViewsComponent } from './app-views.component';

describe('AppViewsComponent', () => {
  let component: AppViewsComponent;
  let fixture: ComponentFixture<AppViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppViewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
