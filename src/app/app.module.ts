import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import { RouterModule, Routes }   from '@angular/router';

import { AppComponent } from './app.component';
import { CoachLandingComponent, MemberLandingComponent, LoginComponent, SurveyComponent } from './components/index';
import { AuthService, TestService, HubService, UserService } from './services/index';
import { NotificationsComponent, NotificationsService } from './components/notifications/index';

const appRoutes: Routes = [
  { path: 'member',
      component: MemberLandingComponent,
      data: { title: 'Member Dashboard'} 
    },
  { path: 'member/:id',
      component: MemberLandingComponent,
      data: { title: 'Member Dashboard'} 
    },
  { path: 'coach', 
      component: CoachLandingComponent,
      data: { title: 'Coach Dashboard'} 
    },
  { path: 'coach/:id', 
      component: CoachLandingComponent,
      data: { title: 'Coach Dashboard'} 
    },
  { path: 'survey', 
      component: SurveyComponent,
      data: { title: 'Survey'} 
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
    MemberLandingComponent,
    CoachLandingComponent,
    NotificationsComponent,
    SurveyComponent
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
  providers: [
    AuthService, 
    TestService, 
    HubService, 
    UserService,
    NotificationsService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
