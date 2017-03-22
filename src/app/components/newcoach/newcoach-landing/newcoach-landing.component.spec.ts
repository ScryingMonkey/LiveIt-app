import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcoachLandingComponent } from './newcoach-landing.component';

describe('NewcoachComponent', () => {
  let component: NewcoachLandingComponent;
  let fixture: ComponentFixture<NewcoachLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcoachLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcoachLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
