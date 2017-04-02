import { UserAuth, UserProfile } from './index';

export class User {
    public auth?: UserAuth
    public profile?: UserProfile
    public key?: string

    constructor() { 
        this.setValues(new UserAuth(), new UserProfile());
        this.key = this.convertKey(new UserAuth().email);        
    }
    newUser(auth:UserAuth):User {       
        let nuser = new User();
        nuser.setValues(auth, new UserProfile());
        return nuser; 
    }
    setValues(auth:UserAuth, profile:UserProfile) {
        this.auth = auth;
        this.profile = profile;
        this.key = this.convertKey(auth.email);   
             
    }
    setKey(key:string){ this.key = key; }
    convertKey(email:string){ return email.replace('@','AT').replace('.','DOT'); }
    setAuth(auth:UserAuth) { 
        this.auth = auth; 
    }
    setProfile(profile:UserProfile) { this.profile = profile; }
}




