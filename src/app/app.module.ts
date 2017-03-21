import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';

export const firebaseConfig = {
    apiKey: "AIzaSyB3uJ_NcsO30q-QX6FYvCKh9f9p7K8JfiI",
    authDomain: "liveit-app.firebaseapp.com",
    databaseURL: "https://liveit-app.firebaseio.com",
    storageBucket: "liveit-app.appspot.com",
    messagingSenderId: "712223429525"
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
