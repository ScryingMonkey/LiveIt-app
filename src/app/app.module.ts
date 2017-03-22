import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import { RouterModule, Routes }   from '@angular/router';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UserLandingComponent } from './components/user/user-landing/user-landing.component';
import { CoachLandingComponent } from './components/coach/coach-landing/coach-landing.component';
import { NewcoachLandingComponent } from './components/newcoach/newcoach-landing/newcoach-landing.component';

import { AuthService } from './services/auth.service';
import { TestService } from './services/test.service';

const appRoutes: Routes = [
  { path: 'user/:id',
      component: UserLandingComponent,
      data: { title: 'User Dashboard'} 
      },
  { path: 'coach/:id', 
      component: CoachLandingComponent,
      data: { title: 'Coach Dashboard'} 
      },
  { path: 'newcoach/:id', 
      component: NewcoachLandingComponent,
      data: {title: 'Coach-in-training Dashboard'} 
      },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login',
      component: LoginComponent
      },
  { path: '**', 
      component: LoginComponent
      }
];

export const firebaseConfig = {
    apiKey: "AIzaSyB3uJ_NcsO30q-QX6FYvCKh9f9p7K8JfiI",
    authDomain: "liveit-app.firebaseapp.com",
    databaseURL: "https://liveit-app.firebaseio.com",
    storageBucket: "liveit-app.appspot.com",
    messagingSenderId: "712223429525"
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserLandingComponent,
    CoachLandingComponent,
    NewcoachLandingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, {
      method: AuthMethods.Popup
    }),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
