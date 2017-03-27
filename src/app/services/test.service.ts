import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class TestService {
  public testing:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor( ) { }

  switchTesting() {
    this.testing.next(!this.testing.getValue())
  }
}
