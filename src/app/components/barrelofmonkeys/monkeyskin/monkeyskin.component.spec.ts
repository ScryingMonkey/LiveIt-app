import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonkeyskinComponent } from './monkeyskin.component';

describe('MonkeyskinComponent', () => {
  let component: MonkeyskinComponent;
  let fixture: ComponentFixture<MonkeyskinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonkeyskinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonkeyskinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
