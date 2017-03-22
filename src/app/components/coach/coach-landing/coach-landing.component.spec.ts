import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachLandingComponent } from './coach-landing.component';

describe('CoachLandingComponent', () => {
  let component: CoachLandingComponent;
  let fixture: ComponentFixture<CoachLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
