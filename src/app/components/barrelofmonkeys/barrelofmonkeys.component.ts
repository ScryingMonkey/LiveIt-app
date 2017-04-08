import { Component, OnInit, Input } from '@angular/core';
// import { FORM_DIRECTIVES }   from '@angular/forms';

import { Monkey, MonkeyskinComponent, BarrelOfMonkeysService } from './index';

@Component({
    selector: 'barrel-of-monkeys',
    templateUrl: 'barrelofmonkeys.component.html',
    styleUrls: ['./barrelofmonkeys.component.css'],
    // providers: [BarrelOfMonkeysService]
})
export class BarrelOfMonkeysComponent implements OnInit {
    @Input() bom: Array<any>;

    private monkey: Monkey;

    constructor(private _bom: BarrelOfMonkeysService) {
        console.log('[ BarrelOfMonkeysComponent.constructor...');
        this._bom.getCurrentMonkey$().subscribe( monkey => {
            console.log('[ BarrelOfMonkeysComponent.constructor.currentMonkey$.subscribe...');
            //this._bomService.testState();  
            this.monkey = monkey;  // binds monkey in view (monkeySkin) to currentMonkey in monkeyService
            // TODO: Define what should be in monkeySkin and what should be here
        } );             
     }

    ngOnInit() { 
        console.log('[ BarrelOfMonkeysComponent.ngOnInit()...');
        console.log('...bom :');
        console.dir(this.bom);
        console.log('........testing state ');
        this._bom.testState;
        console.log('........ending state test');

        if(this.bom != null) {
            this._bom.importBOM( this.bom );            
        } else {         
            console.log('...bom == null');   
            this._bom.importBOM( this._bom.makeDummyBOM() );
        }
    }
}
