import { Component, OnInit } from '@angular/core';
import { HubService } from '../../services/index';

@Component({
  selector: 'testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  constructor(private _hub:HubService ) { }

  ngOnInit() {
  }

}
