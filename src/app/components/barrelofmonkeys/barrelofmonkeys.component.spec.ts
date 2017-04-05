import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrelofmonkeysComponent } from './barrelofmonkeys.component';

describe('BarrelofmonkeysComponent', () => {
  let component: BarrelofmonkeysComponent;
  let fixture: ComponentFixture<BarrelofmonkeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarrelofmonkeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarrelofmonkeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
