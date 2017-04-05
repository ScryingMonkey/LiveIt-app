import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { Observable } from 'rxjs/observable';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from "rxjs/Rx";
import { Router }   from '@angular/router';

import { Monkey } from './monkey.interface';
import { HubService } from '../../services/index';


@Injectable()
export class BarrelOfMonkeysService {
    private monkeysOutOfTheBarrel: Array<Monkey> = new Array();
	public monkeysInTheBarrel: Array<Monkey> = new Array();
    public monkeysInWaiting: Array<Monkey> = new Array();
	// Observable that is passed to components.  Shared as an observable.
	private currentMonkey : BehaviorSubject<Monkey> = new BehaviorSubject(this.makeDummyMonkey());
	private monkeyReport : BehaviorSubject<Array<string>> = new BehaviorSubject(Array());
    private showBom : BehaviorSubject<boolean> = new BehaviorSubject(false);
	
// Constructor ===================================================================================
    constructor() {     }

// Helper methods ================================================================================
    monkeyClicked(clickedMonkey:Monkey) {
        console.log('[ BarrelOfMonkeysService.monkeyClicked...');     
        // update currentMonkey with the responses to his options
        this.recordCurrentMonkeyAnswers(clickedMonkey.responses);
         // update monkeysInWaiting with currentMonkey followers 
        this.updateMonkeysInWaiting(clickedMonkey.followers);
        // pulls the first monkey-In-Waiting and sends to updateCurrentMonkey()
        // if monkeysInWaiting is empty, trigger roll up
        this.pullNextMonkey();
    }
    pullNextMonkey() {
        console.log('[ BarrelOfMonkeysService.pullNextMonkey()');
        this.testState();
        // send currentMonkey to monkeysOutOfTheBarrel
        if (this.currentMonkey.value) {
            console.log('...sending '+this.currentMonkey.value.key+' to monkeysOutOfTheBarrel.');
            this.monkeysOutOfTheBarrel.push(this.currentMonkey.value);  
        }
        // pulls the first monkey-In-Waiting and sends to updateCurrentMonkey()
        // if monkeysInWaiting is empty, trigger roll up
        if(this.monkeysInWaiting.length > 0) {
            console.log('...pulling monkeysInWaiting[0]');
            console.log(this.monkeysInWaiting[0]);
            this.updateCurrentMonkey(this.monkeysInWaiting.shift());
            this.testState();        
        } else {
            console.log('...out of monkeys!');
            this.outOfMonkeys();
            this.testState(); 
        }
    }
    updateCurrentMonkey(monkey:Monkey) {
        // if there is a currentMonkey, adds currentMonkey to monkeysOutOfTheBarrel
        // makes input the currentMonkey
        console.log('[ BarrelOfMonkeysService.updateCurrentMonkey()');
        this.testState(); 
        if (monkey) {
            monkey.leader = this.currentMonkey.value.key;  // tracked to facilitate a back button
            console.log('...'+this.currentMonkey.value.key+' is out of the barrel');           
            this.currentMonkey.next(monkey);
            this.currentMonkey.value.responses = [];
            console.log('...'+monkey.key+' is the next monkey');
            this.testState(); 
        } else {
            console.log('...this is the first monkey! : '+monkey.key);
            this.testState(); 
        }
    }
    updateMonkeysInWaiting(followers:Array<string>) {        
        // Adds input to monkeysInWaiting if followers is not empty
        console.log('[ BarrelOfMonkeysService.updateMonkeysInWaiting('+followers.length+' followers)');
        //this.testState();         
        if(followers.length < 1) {
            console.log('...no followers!');
            return false;
        } else {
            let patientMonkeys:Array<Monkey> = new Array();
            console.log('...followers: '+ followers);
            console.dir(followers);
            for(let key of followers) {
                let foundMonkey = this.findMonkey(key, this.monkeysInTheBarrel);
                patientMonkeys.push(foundMonkey);
                // remove patient monkeys from monkeysInTheBarrel by key
                for(let m of patientMonkeys) {
                    this.removeMonkeyFromBarrel(m);
                }
            }
            console.log('...patientMonkeys: ');
            console.dir(patientMonkeys);
            for(let m of patientMonkeys) {
                this.monkeysInWaiting.push(m);
                console.log('...added '+m.key+' to monkeysInWaiting.  monkeysInWaiting:');
                console.dir(this.monkeysInWaiting);

            }
            // this.monkeysInWaiting.concat(patientMonkeys);  //Not working for some reason
            console.log('...monkeysInWaiting updated');
            this.testState(); 
            return true;
        }
    }
    removeMonkeyFromBarrel(monkey: Monkey) {
        // takes the key of a monkey.  Removes any monkey with matching keys from the barrel.
        let tempBOM: Array<Monkey> = [];
        for(let m of this.monkeysInTheBarrel) {
            if (m.key != monkey.key) {
                tempBOM.push(m);
            }
        }
        this.monkeysInTheBarrel = tempBOM;
    }
    outOfMonkeys() {
        //removes original dummy monkey
        let origin = this.monkeysOutOfTheBarrel.shift();
        console.log('...no more monkeys in waiting!'); 
        // alert('No more monkeys in waiting!');
        console.log('...monkey report:');
        // cue app to stop showing barrel of monkyes
        this.showBom.next(false);
        // send results of all monkeys out of the barrel to OrderService
        console.dir(this.makeMonkeyReport());
        this.showBom.next(false);
        this.monkeyReport.complete();
    }
    recordCurrentMonkeyAnswers(responses:Array<string>) {
        console.log('[ BarrelOfMonkeysService.recordCurrentMonkeyAnswers()');        
        console.log('...This method currently does nothing.');
        // TODO: Refactor to accept non string responses
        //this.currentMonkey.value.responses = responses;
    }
    importBOM(monkeyRoster:Array<any>) {  // what is roster?  JSON? path to txt file? 
        // This doesn't do much currently.  
        // TODO: Create monkeys and bom from a config file.  
        console.log('[ BarrelOfMonkeysService.importBOM()');
        console.log('...monkeyRoster');
        console.dir(monkeyRoster);
        this.testState(); 
        // monkeyRoster = this.getDummyBOM();  testing.  provides dummy data
        for (let monkey of monkeyRoster) {
            //TODO: Rewrite to parse monkey from JSON
            let anotherMonkey: Monkey = monkey;
            this.monkeysInTheBarrel.push(anotherMonkey);
        }
        console.log('...imported bom in to monkeysInTheBarrel, monkeysInTheBarrel:');
        console.dir(this.monkeysInTheBarrel);
        // move first monkey in monkeysInTheBarrel to monkeysInWaiting
        this.updateMonkeysInWaiting([this.monkeysInTheBarrel[0].key]);
        // move fist monkey in monkeysInWaiting to currentMonkey
        this.pullNextMonkey();
        // print state to console
        this.testState(); 
    }
    findMonkey(key:string, barrel:Array<Monkey>) {
        console.log('[ BarrelOfMonkeysService.findMonkey('+key+')');     
        // console.log('...searching for: '+key+' in: ');
        console.log(barrel);
        for (let monkey of barrel) {
             if (monkey.key == key) {
                 console.log('...found a monkey with key: '+key);
                 console.log(monkey);
                 return monkey;
             }
         }
         console.log('...found no monkeys!');
     }
// Makers ========================================================================================
    makeMonkeyReport() {
        let report = [];
        for (let m of this.monkeysOutOfTheBarrel) {
            report.push(m.responses.toString());
        }
        return report;
    }
    makeDummyBOM() {
        console.log('[ BarrelOfMonkeysService.getDummyBOM()');                          
        let bom: Array<Monkey> = new Array();
        let monkey:Monkey = this.makeDummyMonkey();
        let keys = ['Bob', 'Joey', 'Bobo', 'Heavy', 'Moses'];
        let hats = ['purple witch hat', 'orange sombrero', 'black top hat', 'beanie', 'beer hat'];
        
        let key = '';
        let blurb1 = 'My name is ';
        let blurb2 = '!  I am wearing a ';
        let blurb3 = '!  Who would you like to see next?';
        let optionType = 'checkbox';
        let options:Array<string> = [];
        let responses:Array<string> = [];
        let followers:Array<string> = [];
        let hat = '';

        for (let n=0; n < keys.length; n++) {
            let monkey: Monkey = {
                key: keys[n], // How the monkey is summoned from the barrel
                blurb: blurb1 + keys[n] + blurb2 + hats[n] + blurb3, // What the monkey says.  Ususally a 1-2 sentence solicitation.
                optionType: optionType, // What kind of responses the monkey offers
                options: options, // The responses the monkey offers
                responses: responses,
                followers: followers, // The monkey or monkeys that comes after this monkey.  If null, you are done!
                submit: 'Next',  // label of the submit button
                hat: hats[n] // A general description of the monkey's head covering (all monkeys wear hats).
            };
            bom.push(monkey);
        }
        for (let n=0; n < bom.length; n++) {     
            if(bom.length > 1) {
                bom[n].followers = [];
                bom[n].options = keys;
            } else {
                monkey.followers = [];
                monkey.options = ['This is the only monkey', 'There is no real choice'];
            }
        }
        return bom; // barrel of monkeys
    }
    makeDummyMonkey() {
        return <Monkey> {
            key: 'dummy', // :string  How the monkey is summoned from the barrel
            blurb: 'How many uncles does a dummyMonkey have?', // :string  What the monkey says.  Ususally a 1-2 sentence solicitation.
            optionType: 'checkbox', // :string  What kind of responses the monkey offers
            options: ['1', '2', '3'], // :String[]  The responses the monkey offers
            followers: [], // :String[]  The keys of the monkey or monkeys that comes after this monkey.  If null, you are done!
            submit: 'Next', // :string  Label of submit button
            hat:  'yellow dunce cap' // :string  A general description of the monkey's head covering (all monkeys wear hats).
        };
    }

// Getters =======================================================================================
    getCurrentMonkey$() { return this.currentMonkey.asObservable(); }
    getMonkeyReport$() { return this.monkeyReport.asObservable(); }
    getShowBom$() { return this.showBom.asObservable(); }


//Tests ==========================================================================================
    testState() {
        console.log('[ BarrelOfMonkeysService.testState() ...currentMonkey.key, currentMonkey, monkeysInWaiting, monkeysInTheBarrel, monkeysOutOfTheBarrel: ');
        console.log(this.currentMonkey.value.key);
        console.dir(this.currentMonkey.value);
        console.dir(this.monkeysInWaiting);
        console.dir(this.monkeysInTheBarrel);
        console.dir(this.monkeysOutOfTheBarrel);
        console.log('...end of test]');
    }
}