import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialDocsComponent } from './official-docs.component';

describe('OfficialDocsComponent', () => {
  let component: OfficialDocsComponent;
  let fixture: ComponentFixture<OfficialDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficialDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficialDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
